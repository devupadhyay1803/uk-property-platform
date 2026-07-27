# UK Property Platform — Work Handoff

**Last updated:** 2026-07-24
**Project dir:** `~/uk-property-platform`
**Stack:** Next.js 16 (App Router) + Supabase (Postgres, Auth, Storage) + Tailwind v4 + TypeScript
**Reference docs in repo:** `ARCHITECTURE.md` (full blueprint), `README.md` (setup), this file (status).

> Read `ARCHITECTURE.md` first — it maps every PRD feature (F1–F14) to the design,
> and §14 lists the 10 open questions that gate specific features.

---

## 1. What was supposed to be done (overall goal)

Build the "Launch MVP" UK lettings platform from the PRD: public property listings,
tenant management, landlord portal, admin — 3 roles, ~100 properties, UK/GBP,
SEO + analytics, on a scalable relational foundation.

**Immediate task in progress:** get the local database live (via Docker) and build
the **public listings vertical** so the seeded dummy listings render end-to-end.

---

## 2. What's DONE ✅

**Foundation**
- Next.js 16 app scaffolded (TS, Tailwind v4, ESLint, App Router).
- Supabase deps installed (`@supabase/supabase-js`, `@supabase/ssr`); `supabase init` done.
- Client wiring in `lib/supabase/`: `client.ts` (browser), `server.ts` (session server),
  `service.ts` (service-role, server-only), `middleware.ts` (session/redirect helper),
  `public.ts` (cookie-less anon client for public/ISR pages).
- `proxy.ts` (root) — Next 16's renamed middleware; refreshes session + role-aware guards.
- `types/database.ts` — hand-written, type-alias based (see §4 error notes).

**Database (written, NOT yet applied to a live DB — see §3)**
- `supabase/migrations/20260724000001_initial_schema.sql` — all tables (profiles,
  properties, property_photos, tenant_records, communication_log, enquiries), enums,
  triggers (updated_at, search_vector, enquiry routing, auto-profile-on-signup),
  indexes, `auth_role()` + `custom_access_token_hook`, **RLS on every table**
  (landlord isolation = F7/§9), storage buckets + policies.
- `supabase/migrations/20260724000002_tenant_portal.sql` — `service_requests` table
  + RLS, and a policy letting tenants read their own property.
- `supabase/seed.sql` — admin@example.com + landlord@example.com (password `password123`)
  + 3 sample listings (Manchester/Leeds/Birmingham).
- Access-token hook enabled in `supabase/config.toml`.

**Public listings vertical (BUILT, builds clean)**
- Home page `app/(public)/page.tsx` (ISR) — hero + search + featured listings.
- Results `app/(public)/properties/page.tsx` — keyword/location/type/price/availability
  filters + pagination (12/page).
- Detail `app/(public)/properties/[slug]/page.tsx` — gallery, details, SEO
  `generateMetadata`, JSON-LD, enquiry form.
- Enquiry `actions.ts` (Server Action → RLS anon insert; trigger routes to landlord)
  + `enquiry-form.tsx` (`useActionState`).
- SEO: `app/sitemap.ts`, `app/robots.ts`.
- Components: `listing-card.tsx`, `property-image.tsx`, `search-filters.tsx`.
- Utils: `lib/format.ts` (GBP; price stored as **pence** integer),
  `lib/queries/properties.ts` (search/featured/detail/slugs).

**Decisions locked**
- Tenants **get their own login**, created by **admin invite** (public self-signup OFF).
- Tenant portal = **basic tenant info** (in scope) + **service requests**
  (⚠️ NET-NEW vs PRD → a **Custom Extra** per the Operating Agreement; log/quote it).

**Verification:** `npx tsc --noEmit` ✅ · `npx eslint .` ✅ · `npm run build` ✅

---

## 3. What's UNDERWAY / BLOCKED 🚧

**Getting the local DB live — BLOCKED on Docker.**
- Docker Desktop 4.83 installed (`brew install --cask docker`).
- `open -a Docker` launched it; daemon reported up briefly, **then the Docker Desktop
  Linux VM (context `desktop-linux`) started returning `EOF`** on `docker ps` / `supabase status`.
- `supabase start` timed out at 10 min on first run (still pulling images).
- **Net result: local Postgres is NOT up; migrations NOT applied; app can't show data yet.**

### Fix Docker, then bring the DB up (do this first)
1. **Open the Docker Desktop app window** and complete first-run:
   accept the Service Agreement, grant privileged access (enter Mac password if asked).
   Wait until the whale icon / dashboard says **"Engine running"**.
2. If it stays stuck on EOF: quit Docker fully (menu-bar whale → Quit), reopen, wait ~1 min.
   Verify: `docker ps` returns a clean (empty) table, not `EOF`.
3. Then, in `~/uk-property-platform`:
   ```bash
   supabase start          # first run pulls ~1–2GB of images; can take 5–15 min
   ```
   It prints **API URL**, **anon key**, **service_role key**.
4. Create env + apply schema + types:
   ```bash
   cp .env.local.example .env.local     # paste the 3 values from step 3
   supabase db reset                    # applies both migrations + seed.sql
   supabase gen types typescript --local > types/database.ts   # replaces the stub
   npm run dev                          # http://localhost:3000
   ```
5. Verify: home + `/properties` show 3 listings; open one; submit an enquiry
   (saves to DB — no email yet, see §5). Inspect data in Studio: http://127.0.0.1:54323.

---

## 4. Errors hit & how they were fixed (for context)

| Error | Fix |
|---|---|
| Next 16 deprecated `middleware.ts` | Renamed to `proxy.ts`, function `proxy` (per bundled docs) |
| `create-next-app` refused non-empty dir | Moved `ARCHITECTURE.md` out during scaffold, restored after |
| Supabase inserts typed as `never` | `types/database.ts`: use `type` aliases (not `interface`) + add `Relationships: []` per table + `CompositeTypes` — satisfies supabase-js `GenericSchema` |
| Stale `.next` type referenced deleted `app/page.tsx` | `rm -rf .next` before build |
| ESLint `no-html-link-for-pages` on reset `<a>` | Use `next/link` |
| **Docker VM `EOF` (OPEN)** | See §3 — needs Docker Desktop first-run completed in GUI |

---

## 5. What's LEFT to build (priority order)

1. **Auth** — `/login` page + role-aware redirect (wiring already in `proxy.ts`;
   uses Supabase Auth email/password). Also an admin "invite tenant/landlord" flow.
2. **Admin area** `app/(admin)/admin/…` — listings CRUD + publish/unpublish (F2),
   tenant management + search (F3/F4), platform oversight (F5/§10).
   On publish, call `revalidatePath('/properties')` + the slug (ISR refresh).
3. **Landlord dashboard** `app/(landlord)/dashboard` — owned properties + occupancy +
   basic reporting (F5). RLS auto-scopes to `landlord_id = auth.uid()`.
4. **Tenant portal** `app/(tenant)/portal` — basic info + service requests UI
   (schema already exists in migration 0002).
5. **Enquiry routing email** — Supabase Edge Function `route-enquiry`.
   ⚠️ BLOCKED on open Q §14 #6 (email provider: Resend/Postmark/SMTP + admin email).
   Until then, enquiries capture to DB but send no email.
6. **Photos** — admin upload to `property-photos` bucket; swap `property-image.tsx`
   placeholder `<img>` for `next/image` + `images.remotePatterns` (perf).
7. **GA4** (F12) via `@next/third-parties` — track listing views + enquiries.
8. **Public content pages** — about/contact/privacy/terms (currently linked, not built).
9. **QA** — landlord-isolation integration test (auth as Landlord A, try to read B's
   data → expect 0 rows), cross-device, perf pass.
10. **Deploy** — Vercel + cloud Supabase (`supabase link` → `db push`; enable the
    access-token hook in the Dashboard). Resolve §14 items (esp. hosting, GDPR, a11y).

**Still-open questions (ARCHITECTURE §14):** Supabase cloud vs self-host, property_type
enum vs free text, maps (= Custom Extra), enquiry fields, email provider, brand tokens,
UK-GDPR, accessibility target, pagination size, 11-vs-12 workstreams.

---

## 6. Continuing in Antigravity

1. Open the folder `~/uk-property-platform` in **Google Antigravity**.
2. Give the agent this context: *"Read HANDOFF.md and ARCHITECTURE.md. The public
   listings vertical is built and the app builds clean. First unblock Docker and bring
   the local Supabase DB up per HANDOFF §3, then continue the build in the priority
   order in HANDOFF §5."*
3. Key guardrails to tell it:
   - This is **Next.js 16** — `middleware.ts` is `proxy.ts`; `params`/`searchParams`
     are Promises (await them). Read `node_modules/next/dist/docs/` if unsure.
   - **Landlord isolation is enforced by RLS**, not app code — keep it that way; the
     service-role client (`lib/supabase/service.ts`) is server-only, behind role checks.
   - After schema changes: add a **new** migration file (don't edit applied ones) and
     re-run `supabase gen types` to refresh `types/database.ts`.
   - **Service requests are a Custom Extra** — keep out-of-scope additions flagged.
4. Verify after each change: `npx tsc --noEmit && npx eslint . && npm run build`.

---

## 7. Quick command reference

```bash
cd ~/uk-property-platform
docker ps                 # confirm Docker VM healthy (not EOF)
supabase start            # start local stack
supabase db reset         # re-apply migrations + seed
supabase status           # show URLs/keys
supabase gen types typescript --local > types/database.ts
npm run dev               # dev server
npm run build             # production build (also type-checks)
# Studio UI: http://127.0.0.1:54323   |   App: http://localhost:3000
# Seed logins: admin@example.com / landlord@example.com  (password: password123)
```
