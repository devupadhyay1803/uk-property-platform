# UK Property Platform — Technical Architecture

**Stack:** Next.js (App Router) + Supabase (Postgres, Auth, Storage, Edge)
**Maps to:** PRD "The Launch MVP" (F1–F14), resolving the §6 backend + §27 stack blockers.
**Status:** Build-ready blueprint. Items still needing Azeez's input are collected in [§14](#14-open-items-still-needing-client-input).

---

## 1. Why this stack fits the PRD

| PRD requirement | How Next.js + Supabase covers it |
|---|---|
| Relational model (F8, §26 "relational/SQL") | Postgres — first-class relational DB |
| Landlord data isolation (F7, §9 "landlords never see another landlord's data") | **Postgres Row-Level Security (RLS)** — enforced at the DB, not just the app layer |
| Secure password auth, 3 roles (F7) | Supabase Auth (email/password) + `role` in JWT claims |
| Clean SEO URLs, crawlable markup, fast pages (F9) | Next.js App Router: SSR/SSG, `generateMetadata`, streaming, `sitemap.ts` |
| Fast indexed search past 100 listings (F6, §18) | Postgres B-tree + GIN/`tsvector` indexes; pagination |
| Property photos, multiple per listing (F1, §16) | Supabase Storage buckets + signed/public URLs |
| Prepared for future payments/automation without rebuild (F8) | Postgres + Edge Functions leave room for Stripe, webhooks, cron |
| Deploy on client environment (F13) | Vercel (recommended) or self-host Next.js; Supabase cloud or self-host |
| GA4 (F12) | `@next/third-parties` GA4 component |

**One decision to confirm with client:** Supabase is a managed cloud service. The PRD (F13) says "deploy on **your** environment." Supabase can be cloud-hosted (fastest, recommended) or self-hosted. See §14.

---

## 2. High-level architecture

```
┌─────────────────────────────────────────────────────────┐
│  Browser (public visitors, landlords, admin)             │
└───────────────┬─────────────────────────────────────────┘
                │  HTTPS
┌───────────────▼─────────────────────────────────────────┐
│  Next.js App Router (Vercel or client env)               │
│  • Public pages: SSG/ISR (listings, detail) — SEO        │
│  • Auth'd pages: SSR (landlord dashboard, admin)         │
│  • Server Actions / Route Handlers (mutations, enquiries)│
│  • Middleware: session refresh + role-aware redirects    │
└───────────────┬─────────────────────────────────────────┘
                │  @supabase/ssr (RLS-scoped queries)
┌───────────────▼─────────────────────────────────────────┐
│  Supabase                                                │
│  • Postgres (schema + RLS policies)  ← source of truth   │
│  • Auth (users, JWT with role claim)                     │
│  • Storage (property-photos, brand-assets buckets)       │
│  • Edge Functions (enquiry routing email; future: cron)  │
└──────────────────────────────────────────────────────────┘
```

**Key principle: two Supabase clients.**
- **Anon/user client** (browser + most server code) — always runs under RLS. This is what enforces landlord isolation.
- **Service-role client** (server-only, never shipped to browser) — bypasses RLS. Used *only* for admin operations that legitimately cross tenant boundaries and for the enquiry-routing function. Guarded behind server-side role checks.

---

## 3. Data model

Resolves PRD §7 (which was inferred/unconfirmed). Postgres DDL below is the proposed migration.

### 3.1 Roles & identity

Supabase Auth owns `auth.users`. We mirror app data in `public.profiles`, linked 1:1.

```sql
create type user_role as enum ('tenant', 'landlord', 'admin');
create type property_status as enum ('available', 'let');
create type tenancy_status as enum ('active', 'pending', 'past');
create type enquiry_status as enum ('new', 'contacted', 'closed');

create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        user_role not null default 'tenant',
  full_name   text not null,
  email       text not null,
  phone       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
```

> **Role source of truth.** `profiles.role` is authoritative. It is *also* copied into the JWT via a custom access-token hook (§4.2) so RLS policies can read the role without a table join on every query.

### 3.2 Properties / listings (F1)

```sql
create table public.properties (
  id             uuid primary key default gen_random_uuid(),
  landlord_id    uuid not null references public.profiles(id) on delete restrict,
  title          text not null,
  slug           text not null unique,                 -- SEO clean URL (F9)
  description    text,
  price_pcm      integer not null,                     -- pence/month, GBP, integer (avoid float)
  property_type  text not null,                         -- see §14: enum vs free text
  bedrooms       smallint,
  bathrooms      smallint,
  address_line   text not null,
  city           text not null,
  postcode       text not null,
  latitude       double precision,                      -- optional; maps = §14 open Q
  longitude      double precision,
  status         property_status not null default 'available',
  published      boolean not null default false,        -- admin publish/unpublish (F2)
  meta_title     text,                                  -- SEO override (F9)
  meta_description text,
  search_vector  tsvector,                              -- full-text search (F6)
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.property_photos (
  id          uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  storage_path text not null,                           -- path in 'property-photos' bucket
  alt_text    text,                                     -- image alt (F9 SEO/a11y)
  sort_order  smallint not null default 0,
  created_at  timestamptz not null default now()
);
```

### 3.3 Tenants (F3)

Per PRD §25 Q1 (open): tenants may be admin-managed records only, OR full login users. **This schema supports admin-managed records now, with a clean upgrade path to logins later** — `tenant_records.profile_id` is nullable; if a tenant later gets a login, link it.

```sql
create table public.tenant_records (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid references public.profiles(id) on delete set null, -- null = no login yet
  property_id   uuid references public.properties(id) on delete set null,
  full_name     text not null,
  email         text,
  phone         text,
  status        tenancy_status not null default 'pending',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.communication_log (   -- F3 "every interaction in one place"
  id                uuid primary key default gen_random_uuid(),
  tenant_record_id  uuid not null references public.tenant_records(id) on delete cascade,
  author_id         uuid references public.profiles(id) on delete set null,
  note              text not null,
  created_at        timestamptz not null default now()
);
```

### 3.4 Enquiries (F1, F10 — routed to landlord/admin)

```sql
create table public.enquiries (
  id            uuid primary key default gen_random_uuid(),
  property_id   uuid not null references public.properties(id) on delete cascade,
  landlord_id   uuid references public.profiles(id) on delete set null, -- denormalised for routing/RLS
  name          text not null,
  email         text not null,
  phone         text,
  message       text not null,
  status        enquiry_status not null default 'new',
  created_at    timestamptz not null default now()
);
```
> `landlord_id` is copied from the property at insert time (trigger) so RLS can scope enquiries to a landlord without a join, and routing survives even if the property is later deleted.

### 3.5 Indexes (F6 / §18 "fast indexed queries past 100")

```sql
create index on public.properties (status, published);
create index on public.properties (city);
create index on public.properties (price_pcm);
create index on public.properties (property_type);
create index on public.properties (landlord_id);
create index on public.properties using gin (search_vector);   -- keyword search
create index on public.property_photos (property_id, sort_order);
create index on public.enquiries (landlord_id, status);
create index on public.tenant_records (property_id);
create index on public.tenant_records (status);
```

`search_vector` is maintained by a trigger over `title`, `description`, `city`, `postcode`.

### 3.6 Relationships summary
Landlord `1—N` Property · Property `1—N` PropertyPhoto · Property `1—N` Enquiry · Property `1—N` TenantRecord (occupancy) · TenantRecord `1—N` CommunicationLog. Matches PRD §7.

---

## 4. Auth & authorization

### 4.1 Authentication (F7)
- Supabase Auth, **email + password**. Password policy configurable in Supabase (min length, leaked-password protection via HaveIBeenPwned — enable it).
- Sessions via `@supabase/ssr` (cookie-based), refreshed in Next.js **middleware** on every request.
- Sign-up policy: **public self-service sign-up disabled.** Admin and landlord accounts are provisioned (PRD §16 collects landlord/admin names+emails). New landlords created by admin via invite. This matches the PRD — there is no public "register" story except possibly tenants (open Q, §14).

### 4.2 Roles in the JWT
A custom **access-token hook** injects `role` into every JWT from `profiles.role`. RLS policies then read `auth.jwt() ->> 'role'` — no per-query join.

```sql
-- Custom Access Token Hook (registered in Supabase Auth settings)
create function public.custom_access_token_hook(event jsonb)
returns jsonb language plpgsql stable as $$
declare claims jsonb; user_role text;
begin
  select role into user_role from public.profiles where id = (event->>'user_id')::uuid;
  claims := event->'claims';
  claims := jsonb_set(claims, '{app_metadata,role}', to_jsonb(coalesce(user_role,'tenant')));
  return jsonb_set(event, '{claims}', claims);
end; $$;
```

Helper for policies:
```sql
create function public.auth_role() returns text language sql stable as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', 'tenant');
$$;
```

### 4.3 Row-Level Security policies — the core of landlord isolation (F7, §9)

RLS is **on for every table**. This is what makes "a landlord can never see another landlord's data" a database guarantee, not an app-code hope.

```sql
alter table public.profiles          enable row level security;
alter table public.properties        enable row level security;
alter table public.property_photos   enable row level security;
alter table public.tenant_records    enable row level security;
alter table public.communication_log enable row level security;
alter table public.enquiries         enable row level security;

-- PROPERTIES ---------------------------------------------------------------
-- Public: anyone can read published listings (the public site).
create policy "public reads published" on public.properties
  for select using (published = true);

-- Landlord: full read of own listings (incl. unpublished).
create policy "landlord reads own" on public.properties
  for select using (landlord_id = auth.uid());

-- Admin: reads everything.
create policy "admin reads all properties" on public.properties
  for select using (public.auth_role() = 'admin');

-- Only admin writes listings (F2/F9: publish/unpublish is admin-only).
create policy "admin writes properties" on public.properties
  for all using (public.auth_role() = 'admin')
  with check (public.auth_role() = 'admin');

-- ENQUIRIES ----------------------------------------------------------------
-- Anyone (anon) can submit an enquiry (public visitors, §11/§26).
create policy "anyone submits enquiry" on public.enquiries
  for insert with check (true);
-- Landlord sees only enquiries for their properties.
create policy "landlord reads own enquiries" on public.enquiries
  for select using (landlord_id = auth.uid());
-- Admin sees all.
create policy "admin reads all enquiries" on public.enquiries
  for select using (public.auth_role() = 'admin');

-- TENANT RECORDS + COMMS: admin manages; landlord reads for own properties.
create policy "admin manages tenants" on public.tenant_records
  for all using (public.auth_role() = 'admin')
  with check (public.auth_role() = 'admin');
create policy "landlord reads own tenants" on public.tenant_records
  for select using (
    property_id in (select id from public.properties where landlord_id = auth.uid())
  );
```
*(Photos and communication_log follow the same shape — public read for photos of published properties; admin write; landlord read scoped through the parent property.)*

> **Landlord isolation test (must be in QA, PRD §35.10):** authenticate as Landlord A, attempt to query Landlord B's property/enquiry/tenant by id → must return 0 rows. Add this as an automated integration test.

---

## 5. Application structure (Next.js App Router)

```
app/
  (public)/
    page.tsx                      # Home / landing (hero, search, featured)  [SSG/ISR]
    properties/
      page.tsx                    # Listings results + filters               [SSR]
      [slug]/page.tsx             # Listing detail + enquiry form            [SSG/ISR]
    about/page.tsx  contact/page.tsx  privacy/page.tsx  terms/page.tsx
    sitemap.ts                    # dynamic sitemap (F9)
    robots.ts
  (auth)/
    login/page.tsx
  (landlord)/
    dashboard/page.tsx            # owned properties + status                [SSR]
    dashboard/reporting/page.tsx  # basic reporting (F5)                     [SSR]
  (tenant)/
    portal/page.tsx               # basic tenant info: property/tenancy status [SSR]
    portal/requests/page.tsx      # service requests list + new (Custom Extra)  [SSR]
  (admin)/
    admin/
      listings/page.tsx           # table + add/edit/publish (F2)
      listings/[id]/edit/page.tsx
      tenants/page.tsx            # records + search (F3, F4)
      tenants/[id]/page.tsx       # profile + comms log + status
      overview/page.tsx           # oversight control point (F5/§10)
  api/                            # Route Handlers where needed (webhooks, GA proxy)
  layout.tsx                      # root: fonts, GA4, theme
components/                       # shared UI (listing card, filters, forms)
lib/
  supabase/
    server.ts   client.ts   middleware.ts   service.ts (service-role, server-only)
  queries/                        # typed data-access helpers
middleware.ts                     # session refresh + role-aware route guards
supabase/
  migrations/                     # SQL migrations (schema + RLS above)
  functions/route-enquiry/        # Edge Function: email routing
types/database.ts                 # generated from Supabase schema
```

**Route protection:** `middleware.ts` refreshes the session and redirects: unauthenticated hitting `(landlord)`/`(admin)` → `/login`; wrong-role → 403. This is a UX guard *on top of* RLS (defence in depth) — RLS remains the real boundary.

**Rendering strategy (F9 SEO + F18 perf):**
- Public listing pages → **SSG with ISR** (`revalidate`), regenerated on publish via on-demand revalidation. Fast, crawlable, cacheable.
- Search results → SSR (query-param driven).
- Dashboards/admin → SSR, `no-store` (private, always fresh).

---

## 6. Feature → implementation map

| PRD feature | Implementation |
|---|---|
| **F1 Listings engine** | `properties` + `property_photos`; detail page SSG; enquiry form → Server Action → insert (RLS `anyone submits`) → Edge Function routes email |
| **F2 Listing admin** | Admin CRUD under `(admin)/admin/listings`; publish toggles `published` + triggers ISR revalidation of `/properties/[slug]` and `/properties` |
| **F3 Tenant mgmt** | `tenant_records` + `communication_log`; admin CRUD; status enum |
| **F4 Tenant search** | Postgres `ilike`/`tsvector` over name/email/phone; indexed |
| **F5 Landlord portal** | `(landlord)/dashboard`; queries auto-scoped by RLS to `landlord_id = auth.uid()`; reporting = aggregate counts |
| **F6 Search/filter** | Server Action / SSR query with `where` on status/type/price + `search_vector @@ plainto_tsquery`; keyset or offset pagination |
| **F7 Roles/access** | Supabase Auth + JWT role claim + RLS (§4) |
| **F8 DB/architecture** | This schema; Postgres; room for `payments`, `messages` tables later |
| **F9 SEO** | `generateMetadata` per page, `slug` URLs, `sitemap.ts`, semantic HTML, image `alt`, SSG speed |
| **F10 CRO** | Minimal enquiry form (name/email/message + optional phone); CTAs on cards + detail |
| **F11 Mobile-first** | Tailwind responsive; touch targets; test at 360px |
| **F12 Analytics** | `@next/third-parties` GA4; custom events on listing view + enquiry submit |
| **F13 Hosting** | Vercel or client env; Supabase project; env vars; handover doc |
| **F14 Brand/design** | Design tokens (colours/type) — §14 open; neutral system as default |

---

## 7. Enquiry routing (F1, F14 notifications)

1. Public visitor submits enquiry form (Server Action) → row inserted into `enquiries` (RLS allows anon insert; `landlord_id` set by trigger from the property).
2. A Postgres trigger / DB webhook invokes the **`route-enquiry` Edge Function**.
3. Function looks up the property's landlord + the platform admin email (§14: admin email) and sends email (Resend/Postmark/SMTP — provider TBD, §14).
4. Enquiry appears in landlord dashboard (their rows) and admin overview (all rows).

> PRD §14: automated *messaging flows* are out of scope (future phase). This is single transactional routing only — in scope.

---

## 8. Storage & media (F1, §16)

- Bucket `property-photos` — **public read** (listing images are public). Write via admin only (Storage RLS policy mirrors table policy).
- Bucket `brand-assets` — logo etc.
- Upload flow: admin uploads → store `storage_path` + `alt_text` in `property_photos`.
- Serve via Next `<Image>` with the Supabase image transformation/CDN URL for responsive sizes (perf, F18).
- Client supplies the ~100 listings' photos (PRD §16 — data entry itself out of scope; we build the loader).

---

## 9. SEO (F9) & Analytics (F12)

- **URLs:** `/properties/[slug]` — slug generated from title + city, uniqueness enforced by DB.
- **Metadata:** `generateMetadata` reads `meta_title`/`meta_description` (fallback to title/description).
- **Sitemap:** `app/sitemap.ts` queries all published slugs.
- **Structured data:** JSON-LD `RealEstateListing` on detail pages (bonus for crawlability).
- **GA4:** `<GoogleAnalytics gaId=... />`; fire `view_item` on detail render, `generate_lead` on enquiry submit.

---

## 10. Security & compliance

| Area | Approach |
|---|---|
| Landlord isolation | RLS (§4.3) — DB-enforced |
| Auth | Supabase Auth; enable leaked-password protection; HTTPS only |
| Service-role key | Server-only env var; **never** in client bundle; used behind role checks |
| Rate limiting | Enquiry submit + login: rate-limit in middleware/Edge (e.g. Upstash) — PRD §17 flagged none stated |
| **UK-GDPR** (PRD §31 risk #2) | Store minimal personal data; document lawful basis; add data-deletion path for tenant/enquirer records; privacy policy page. **Needs client sign-off — §14** |
| Secrets handover | Per PRD §9/§29: credentials via secure method, never plain chat |

---

## 11. Performance (F18)

- SSG/ISR for public pages → sub-second loads, cache-friendly.
- DB indexes (§3.5) keep search fast well past 100 rows.
- Pagination: default **page size 12** (confirm, §14); offset for MVP, keyset if lists grow large.
- `next/image` responsive + Supabase image CDN.
- Targets to agree (PRD §18 had none): LCP < 2.5s, TTFB < 600ms on 4G mobile.

---

## 12. Environments & deployment (F13)

| Env | Purpose |
|---|---|
| Local | Supabase CLI (local Postgres) + `next dev` |
| Staging | Supabase project + Vercel preview — for milestone reviews (§28 gates) |
| Production | Client environment (Vercel or self-host) + Supabase prod |

- Schema changes via `supabase/migrations` (versioned, reviewable).
- Types generated from schema → `types/database.ts` (end-to-end type safety).
- CI: run migration + landlord-isolation integration test on every PR.

---

## 13. Suggested build order (maps to PRD §34 phases 1–3)

1. **Foundation** — Supabase project, schema migration, RLS, Auth + role hook, seed data.
2. **Public site** — home, listings results + search/filter, listing detail, enquiry form + routing. (SEO from day one.)
3. **Admin** — listing CRUD + publish, tenant records + search + comms log.
4. **Landlord portal** — dashboard, owned properties, basic reporting, isolation tests.
5. **SEO/analytics polish** — sitemap, metadata, GA4, JSON-LD.
6. **QA + hardening** — cross-device, role/permission matrix, perf pass, landlord-isolation test suite. (PRD §35.10 acceptance criteria.)

---

## 14. Open items still needing client input

These are the PRD's unresolved questions (§25/§27), now framed against the stack. They gate specific build decisions:

1. **Supabase cloud vs self-host** — PRD F13 says "your environment." Recommend Supabase Cloud + Vercel (fastest, within budget). Confirm client accepts managed hosting, or budget/time for self-host.
2. **Tenant portal scope (PRD §25 Q1) — RESOLVED (client decision, 2026-07-24):** tenants **get their own login**. Schema already supports this (`tenant_records.profile_id` link + `"tenant reads own record"` RLS policy). In scope per F7 ("distinct Tenant role, own view"). Two follow-on questions now open — see 2a/2b.
   - **2a. What does a tenant see in their portal? — RESOLVED (2026-07-24):** (i) **basic tenant info** — their tenancy (property, address, tenancy status), read-only [in scope, F7]; and (ii) **service requests** — tenant can raise a maintenance/service request and track its status. ⚠️ **Service requests are NET-NEW vs the PRD** (not in any source doc) → a **Custom Extra** per Operating Agreement §01/§03; should be quoted/logged in the Fiverr thread. Built minimal (request + status, no threaded messaging) to stay clear of the deferred "automated messaging" future phase (§32). Schema: `service_requests` table in migration `...0002_tenant_portal.sql`.
   - **2b. How is a tenant account created?** Proposed default: **admin creates/invites** the tenant and links them to a `tenant_record` (matches admin-managed tenant flow F3). Alternative: tenant self-registers. Public self-registration stays OFF unless confirmed.
3. **`property_type`** — fixed enum (flat/house/studio/…) vs free text. Enum recommended for clean filters (F6).
4. **Maps (§25 Q4)** — lat/long columns are in the schema but a map view is not built unless confirmed. Google Maps = a third-party integration beyond GA4 (PRD §15 — would be a Custom Extra).
5. **Enquiry form fields (§25 Q3)** — assumed name/email/message + optional phone. Confirm.
6. **Email provider for routing (§7 here)** — Resend/Postmark/SMTP; needs an admin email (PRD §29) + sender domain.
7. **Brand tokens (§25 Q5/Q6)** — colours, fonts, inspiration, must-nots. Default = clean neutral system.
8. **UK-GDPR approach (PRD §31 risk #2)** — data-retention/deletion policy + privacy text. Legal input needed.
9. **Accessibility target (PRD §20)** — recommend WCAG 2.1 AA for a UK public site; confirm.
10. **Pagination size + sort options (§18)** — assumed 12/page; confirm sort (price, newest).

---

*Blueprint aligns to PRD F1–F14 and §35 acceptance criteria. Assumptions are labelled and collected in §14 so nothing is built on an unconfirmed decision.*
