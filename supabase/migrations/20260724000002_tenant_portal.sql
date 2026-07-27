-- ============================================================================
-- Tenant portal — basic tenant info + service requests
-- Client decision 2026-07-24: tenants get their own login (resolves PRD §25 Q1).
--
-- SCOPE NOTE: "basic tenant info" is in scope (F7 tenant own view).
-- "Service requests" is NET-NEW vs the PRD (no mention in any source doc) —
-- it is a Custom Extra per the Operating Agreement §01/§03. Kept intentionally
-- minimal (request + status, NO threaded messaging) to avoid crossing into the
-- deferred "automated communications & messaging" future phase (PRD §32).
-- ============================================================================

-- Let a logged-in tenant read the property tied to their tenancy, even if it is
-- unpublished (needed for the "basic tenant info" view).
create policy "tenant reads own property" on public.properties
  for select using (
    id in (select property_id from public.tenant_records where profile_id = auth.uid())
  );

-- ----------------------------------------------------------------------------
-- service_requests  (Custom Extra)
-- ----------------------------------------------------------------------------
create type public.service_request_status
  as enum ('open', 'in_progress', 'resolved', 'closed');

create table public.service_requests (
  id                uuid primary key default gen_random_uuid(),
  created_by        uuid not null references public.profiles(id) on delete cascade,
  tenant_record_id  uuid references public.tenant_records(id) on delete set null,
  property_id       uuid references public.properties(id) on delete set null,
  landlord_id       uuid references public.profiles(id) on delete set null, -- denormalised for routing/RLS
  category          text,          -- e.g. plumbing / electrical / general (free text for MVP)
  title             text not null,
  description       text not null,
  status            public.service_request_status not null default 'open',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger service_requests_set_updated_at
  before update on public.service_requests
  for each row execute function public.set_updated_at();

-- On insert, derive the tenant's current tenancy → property → landlord so the
-- request routes correctly without the tenant supplying (or being trusted with)
-- those ids. Mirrors the enquiries routing trigger.
create or replace function public.service_requests_set_context()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  tr record;
begin
  select id, property_id into tr
  from public.tenant_records
  where profile_id = new.created_by
  order by (status = 'active') desc, updated_at desc
  limit 1;

  if tr.id is not null then
    new.tenant_record_id := coalesce(new.tenant_record_id, tr.id);
    new.property_id      := coalesce(new.property_id, tr.property_id);
  end if;

  if new.property_id is not null then
    select landlord_id into new.landlord_id
    from public.properties where id = new.property_id;
  end if;

  return new;
end; $$;

create trigger service_requests_set_context_before_insert
  before insert on public.service_requests
  for each row execute function public.service_requests_set_context();

create index service_requests_created_by_idx     on public.service_requests (created_by);
create index service_requests_landlord_status_idx on public.service_requests (landlord_id, status);
create index service_requests_property_idx        on public.service_requests (property_id);

-- ----------------------------------------------------------------------------
-- RLS
-- ----------------------------------------------------------------------------
alter table public.service_requests enable row level security;

-- Tenant: create and read their own requests only.
create policy "tenant creates own request" on public.service_requests
  for insert with check (created_by = auth.uid());
create policy "tenant reads own requests" on public.service_requests
  for select using (created_by = auth.uid());

-- Landlord: read + update status of requests on their properties.
create policy "landlord reads property requests" on public.service_requests
  for select using (landlord_id = auth.uid());
create policy "landlord updates property requests" on public.service_requests
  for update using (landlord_id = auth.uid()) with check (landlord_id = auth.uid());

-- Admin: full oversight.
create policy "admin manages requests" on public.service_requests
  for all using (public.auth_role() = 'admin') with check (public.auth_role() = 'admin');
