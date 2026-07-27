-- ============================================================================
-- UK Property Platform — Initial schema
-- Maps to ARCHITECTURE.md §3 (data model) + §4 (auth/RLS).
-- Safe to run on a fresh Supabase project (local or cloud).
-- ============================================================================

create extension if not exists pgcrypto;   -- gen_random_uuid()

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
create type public.user_role       as enum ('tenant', 'landlord', 'admin');
create type public.property_status  as enum ('available', 'let');
create type public.tenancy_status   as enum ('active', 'pending', 'past');
create type public.enquiry_status   as enum ('new', 'contacted', 'closed');

-- ----------------------------------------------------------------------------
-- Shared helper: updated_at maintenance
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end; $$;

-- ----------------------------------------------------------------------------
-- profiles (1:1 with auth.users)
-- ----------------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        public.user_role not null default 'tenant',
  full_name   text not null default '',
  email       text not null default '',
  phone       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile whenever an auth user is created.
-- Role/full_name can be seeded via user metadata at provisioning time.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'tenant')
  );
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- properties / listings
-- ----------------------------------------------------------------------------
create table public.properties (
  id               uuid primary key default gen_random_uuid(),
  landlord_id      uuid not null references public.profiles(id) on delete restrict,
  title            text not null,
  slug             text not null unique,
  description      text,
  price_pcm        integer not null,            -- pence per month (GBP), integer
  property_type    text not null,
  bedrooms         smallint,
  bathrooms        smallint,
  address_line     text not null,
  city             text not null,
  postcode         text not null,
  latitude         double precision,
  longitude        double precision,
  status           public.property_status not null default 'available',
  published        boolean not null default false,
  meta_title       text,
  meta_description text,
  search_vector    tsvector,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

-- Full-text search vector maintenance (F6 keyword search)
create or replace function public.properties_search_vector()
returns trigger language plpgsql as $$
begin
  new.search_vector :=
      setweight(to_tsvector('english', coalesce(new.title, '')), 'A')
    || setweight(to_tsvector('english', coalesce(new.city, '')), 'A')
    || setweight(to_tsvector('english', coalesce(new.postcode, '')), 'B')
    || setweight(to_tsvector('english', coalesce(new.description, '')), 'C');
  return new;
end; $$;

create trigger properties_search_vector_update
  before insert or update of title, city, postcode, description
  on public.properties
  for each row execute function public.properties_search_vector();

-- ----------------------------------------------------------------------------
-- property_photos
-- ----------------------------------------------------------------------------
create table public.property_photos (
  id           uuid primary key default gen_random_uuid(),
  property_id  uuid not null references public.properties(id) on delete cascade,
  storage_path text not null,
  alt_text     text,
  sort_order   smallint not null default 0,
  created_at   timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- tenant_records (+ optional login link, see ARCHITECTURE §4 hedge)
-- ----------------------------------------------------------------------------
create table public.tenant_records (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid references public.profiles(id) on delete set null,  -- null = no login yet
  property_id  uuid references public.properties(id) on delete set null,
  full_name    text not null,
  email        text,
  phone        text,
  status       public.tenancy_status not null default 'pending',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger tenant_records_set_updated_at
  before update on public.tenant_records
  for each row execute function public.set_updated_at();

create table public.communication_log (
  id                uuid primary key default gen_random_uuid(),
  tenant_record_id  uuid not null references public.tenant_records(id) on delete cascade,
  author_id         uuid references public.profiles(id) on delete set null,
  note              text not null,
  created_at        timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- enquiries (public submit → routed to landlord/admin)
-- ----------------------------------------------------------------------------
create table public.enquiries (
  id           uuid primary key default gen_random_uuid(),
  property_id  uuid not null references public.properties(id) on delete cascade,
  landlord_id  uuid references public.profiles(id) on delete set null,  -- denormalised for routing/RLS
  name         text not null,
  email        text not null,
  phone        text,
  message      text not null,
  status       public.enquiry_status not null default 'new',
  created_at   timestamptz not null default now()
);

-- Copy landlord_id from the property at insert time so RLS/routing never joins.
create or replace function public.enquiries_set_landlord()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  select landlord_id into new.landlord_id
  from public.properties where id = new.property_id;
  return new;
end; $$;

create trigger enquiries_set_landlord_before_insert
  before insert on public.enquiries
  for each row execute function public.enquiries_set_landlord();

-- ----------------------------------------------------------------------------
-- Indexes (F6 / §18 fast queries past 100 rows)
-- ----------------------------------------------------------------------------
create index properties_status_published_idx on public.properties (status, published);
create index properties_city_idx             on public.properties (city);
create index properties_price_idx            on public.properties (price_pcm);
create index properties_type_idx             on public.properties (property_type);
create index properties_landlord_idx         on public.properties (landlord_id);
create index properties_search_idx           on public.properties using gin (search_vector);
create index property_photos_property_idx     on public.property_photos (property_id, sort_order);
create index enquiries_landlord_status_idx    on public.enquiries (landlord_id, status);
create index tenant_records_property_idx      on public.tenant_records (property_id);
create index tenant_records_status_idx        on public.tenant_records (status);
create index tenant_records_profile_idx       on public.tenant_records (profile_id);

-- ============================================================================
-- AUTH HELPERS
-- ============================================================================

-- Reads the role claim injected by the access-token hook. Falls back to 'tenant'.
create or replace function public.auth_role()
returns text language sql stable as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', 'tenant');
$$;

-- Custom Access Token Hook: inject profiles.role into every JWT (app_metadata.role).
-- NOTE: after migrating, enable this hook in Supabase:
--   Dashboard → Authentication → Hooks → Custom Access Token → select this function,
--   or (local) it is wired via config.toml [auth.hook.custom_access_token].
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb language plpgsql stable as $$
declare
  claims    jsonb;
  user_role text;
begin
  select role::text into user_role
  from public.profiles
  where id = (event ->> 'user_id')::uuid;

  claims := coalesce(event -> 'claims', '{}'::jsonb);
  claims := jsonb_set(
    claims,
    '{app_metadata,role}',
    to_jsonb(coalesce(user_role, 'tenant'))
  );

  return jsonb_set(event, '{claims}', claims);
end; $$;

-- Grants required for the Auth hook to run and read roles.
grant usage on schema public to supabase_auth_admin;
grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook(jsonb) from authenticated, anon, public;
grant select on table public.profiles to supabase_auth_admin;

-- ============================================================================
-- ROW LEVEL SECURITY — the landlord-isolation guarantee (F7 / §9)
-- ============================================================================
alter table public.profiles          enable row level security;
alter table public.properties        enable row level security;
alter table public.property_photos   enable row level security;
alter table public.tenant_records    enable row level security;
alter table public.communication_log enable row level security;
alter table public.enquiries         enable row level security;

-- ---- profiles --------------------------------------------------------------
create policy "own profile read"  on public.profiles
  for select using (id = auth.uid());
create policy "own profile update" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
create policy "admin reads profiles" on public.profiles
  for select using (public.auth_role() = 'admin');
create policy "admin writes profiles" on public.profiles
  for all using (public.auth_role() = 'admin') with check (public.auth_role() = 'admin');
-- Allow the Auth admin role (hook) to read roles.
create policy "auth admin reads roles" on public.profiles
  for select to supabase_auth_admin using (true);

-- ---- properties ------------------------------------------------------------
create policy "public reads published" on public.properties
  for select using (published = true);
create policy "landlord reads own" on public.properties
  for select using (landlord_id = auth.uid());
create policy "admin reads all properties" on public.properties
  for select using (public.auth_role() = 'admin');
create policy "admin writes properties" on public.properties
  for all using (public.auth_role() = 'admin') with check (public.auth_role() = 'admin');

-- ---- property_photos -------------------------------------------------------
create policy "public reads photos of published" on public.property_photos
  for select using (
    exists (select 1 from public.properties p
            where p.id = property_id and p.published = true)
  );
create policy "landlord reads own photos" on public.property_photos
  for select using (
    exists (select 1 from public.properties p
            where p.id = property_id and p.landlord_id = auth.uid())
  );
create policy "admin writes photos" on public.property_photos
  for all using (public.auth_role() = 'admin') with check (public.auth_role() = 'admin');

-- ---- tenant_records --------------------------------------------------------
create policy "admin manages tenants" on public.tenant_records
  for all using (public.auth_role() = 'admin') with check (public.auth_role() = 'admin');
create policy "landlord reads own tenants" on public.tenant_records
  for select using (
    property_id in (select id from public.properties where landlord_id = auth.uid())
  );
-- (Optional future) a linked tenant can read their own record:
create policy "tenant reads own record" on public.tenant_records
  for select using (profile_id = auth.uid());

-- ---- communication_log -----------------------------------------------------
create policy "admin manages comms" on public.communication_log
  for all using (public.auth_role() = 'admin') with check (public.auth_role() = 'admin');
create policy "landlord reads own comms" on public.communication_log
  for select using (
    tenant_record_id in (
      select tr.id from public.tenant_records tr
      join public.properties p on p.id = tr.property_id
      where p.landlord_id = auth.uid()
    )
  );

-- ---- enquiries -------------------------------------------------------------
create policy "anyone submits enquiry" on public.enquiries
  for insert with check (true);
create policy "landlord reads own enquiries" on public.enquiries
  for select using (landlord_id = auth.uid());
create policy "landlord updates own enquiries" on public.enquiries
  for update using (landlord_id = auth.uid()) with check (landlord_id = auth.uid());
create policy "admin manages enquiries" on public.enquiries
  for all using (public.auth_role() = 'admin') with check (public.auth_role() = 'admin');

-- ============================================================================
-- STORAGE (F1 photos, F14 brand assets)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('property-photos', 'property-photos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('brand-assets', 'brand-assets', true)
on conflict (id) do nothing;

-- Public read of both buckets (images are public on the listings site).
create policy "public read property photos" on storage.objects
  for select using (bucket_id = 'property-photos');
create policy "public read brand assets" on storage.objects
  for select using (bucket_id = 'brand-assets');

-- Only admin can upload/modify/delete assets.
create policy "admin writes property photos" on storage.objects
  for all
  using (bucket_id = 'property-photos' and public.auth_role() = 'admin')
  with check (bucket_id = 'property-photos' and public.auth_role() = 'admin');
create policy "admin writes brand assets" on storage.objects
  for all
  using (bucket_id = 'brand-assets' and public.auth_role() = 'admin')
  with check (bucket_id = 'brand-assets' and public.auth_role() = 'admin');
