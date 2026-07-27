# UK Property Platform

Greenfield UK lettings platform — public listings, tenant management, and a
landlord portal. **Next.js 16 (App Router) + Supabase (Postgres, Auth, Storage).**

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full technical blueprint
(data model, RLS, route map, feature map) and the list of open items still
needing the client's input.

## Prerequisites

- Node 20+ (built on v24)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (installed: v2.109+)
- Docker Desktop — **required** to run Supabase locally (`supabase start`)

## Setup

```bash
# 1. Install deps
npm install

# 2. Environment
cp .env.local.example .env.local
#    Fill in the values. For LOCAL dev, `supabase start` prints the URL,
#    anon key, and service_role key to paste in.

# 3. Start local Supabase (needs Docker) — runs migrations automatically
supabase start

# 4. Load schema + seed data into local DB
supabase db reset        # applies migrations/ then seed.sql

# 5. Regenerate DB types from the live schema (replaces the hand-written stub)
supabase gen types typescript --local > types/database.ts

# 6. Run the app
npm run dev              # http://localhost:3000
```

### Seed credentials (local only)

`supabase db reset` creates two sign-in accounts (password: `password123`):

| Email | Role |
|---|---|
| `admin@example.com` | admin |
| `landlord@example.com` | landlord |

Plus three sample published listings owned by the test landlord.

## Deploying the database to a cloud Supabase project

```bash
supabase link --project-ref <your-project-ref>
supabase db push                    # applies migrations to the cloud DB
# Then, in the Supabase Dashboard:
#   Authentication → Hooks → Custom Access Token → enable
#     public.custom_access_token_hook   (injects the role claim into the JWT)
```

> The access-token hook is the piece that puts `role` into the JWT so RLS
> policies (`public.auth_role()`) work. Locally it's wired via
> `supabase/config.toml`; in the cloud it must be enabled in the Dashboard.

## Project layout

```
app/                     # Next.js App Router (routes to be built — see ARCHITECTURE §5)
lib/supabase/
  client.ts              # browser client (RLS as user/anon)
  server.ts              # server client (RLS as user) — Server Components/Actions
  service.ts             # service-role client (bypasses RLS) — server-only
  middleware.ts          # session refresh + role-aware redirect helper
proxy.ts                 # Next 16 proxy (was `middleware.ts`) — calls updateSession
types/database.ts        # DB types (regenerate with `supabase gen types`)
supabase/
  migrations/            # versioned schema + RLS
  seed.sql               # local dev seed
  config.toml            # local stack config (access-token hook enabled)
```

## Security model (why RLS matters)

Landlord data isolation (PRD F7/§9) is enforced by **Postgres Row-Level
Security**, not application code. Every table has RLS on; a landlord's queries
can only ever return their own rows. The `service.ts` client is the only way to
bypass this and is server-only, used behind explicit admin checks. See
[ARCHITECTURE §4](./ARCHITECTURE.md).

**Never** commit `.env.local` or expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
