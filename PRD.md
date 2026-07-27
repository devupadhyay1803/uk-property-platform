# UK Property Platform — Requirements Extraction & PRD

**Source material:** 3 agency documents from *Digital Heroes* to client *Azeez*:
1. `00 — The Proposal` (Pre-Order Proposal, issued 18 July 2026)
2. `01 — Welcome & Discovery Packet` (issued 18 July 2026)
3. `02 — Project Operating Agreement` (issued 19 July 2026)

> **Reader warning — read this first.**
> These are **scope/commercial documents, not a technical conversation.** There is no chat transcript, no reported bugs, no live change history, and **no technical specification** (no stated tech stack, database schema, API contract, or visual design tokens). Every section below separates:
> - ✅ **STATED** — written explicitly in the documents.
> - 🔶 **INFERRED** — reasonable derivation from stated scope, marked as such.
> - ❓ **MISSING / ASK** — not in the documents; a developer must confirm before building.
> Nothing has been invented and presented as fact.

---

## 1. Project Overview

| Field | Detail | Source |
|---|---|---|
| **Project name** | UK Property Platform (product/plan name: *"The Launch MVP"*) | ✅ Stated |
| **Client / decision maker** | Azeez — sole decision maker, no external sign-off needed (`olanihunazeez@gmail.com`) | ✅ Stated |
| **Vendor** | Digital Heroes; Managing Director / Founder: Shreyansh Singh (Fiverr: shreyanshsin261) | ✅ Stated |
| **Business goal** | Launch a live UK property platform listing ~100 properties, managing tenants, and giving landlords their own portal to view and engage — built to scale later | ✅ Stated |
| **Build type** | Greenfield — completely from scratch, no migration, no legacy software | ✅ Stated |
| **Target geography** | United Kingdom only (single currency, UK locale) | ✅ Stated |
| **Scale at launch** | Approximately 100 properties; architecture with headroom to grow past 100 | ✅ Stated |
| **Chosen approach** | Lean, launch-first MVP with a scalable foundation | ✅ Stated |

**Target users (three roles):** ✅ Stated
- **Property seekers / tenants** — public visitors browsing and enquiring; tenants tracked in the system.
- **Landlords** — sign in to a dedicated dashboard to view owned properties and engagement.
- **Admin** — full oversight, manages listings/tenants/landlord accounts.

**Problem being solved:** ✅ Stated — Azeez currently has *no platform*. Needs a properly-architected, scalable build live quickly, without overspending before the platform earns. Off-the-shelf products don't fit; a custom multi-role platform is required.

---

## 2. Functional Requirements

The proposal describes **11 numbered workstreams**; the Welcome Packet adds "Brand & Design Foundation" and still refers to "eleven workstreams." ⚠️ **Contradiction flagged** (see §23/§25).

| # | Feature | Description | Priority | Status |
|---|---|---|---|---|
| F1 | **Property Listings Engine** | Custom listing pages (photos, key details, price, location, description); structured trust-building layout; categorisation by property type, status (available/let), location; enquiry/contact capture on each listing routed to right landlord or admin; hold/display 100+ from day one | High | Approved (in scope) |
| F2 | **Listing admin management** | Add, edit, publish and unpublish any listing from the admin side | High | Approved |
| F3 | **Tenant Management System** | Add/track/store tenant records against properties they occupy; tenant profiles (contact details, tenancy status, property association); communication log; status tracking (active/pending/past) | High | Approved |
| F4 | **Admin tenant search** | Search across all tenants from one place for fast retrieval as portfolio grows | High | Approved |
| F5 | **Landlord Portal & Engagement** | Secure landlord login + dedicated dashboard; view owned properties + current listing/occupancy status; basic reporting (properties, tenants, enquiry activity); engagement touchpoints; strict data separation between landlords | High | Approved |
| F6 | **Search, Filter & Discovery** | Keyword + location search across full listing set; filters (property type, price range, availability); clean results layout desktop+mobile; fast indexed queries past 100 listings | High | Approved |
| F7 | **User Roles & Access Control** | Distinct Tenant / Landlord / Admin roles each with own view; secure password-protected auth; permission boundaries (landlord can't see another landlord's data); admin oversight from single control point | High | Approved |
| F8 | **Database & Architecture** | Relational model linking properties, tenants, landlords, enquiries; structured for 100+ records with headroom; clean backend; prepared for future payments/automation without rebuild | High | Approved |
| F9 | **SEO Foundation** | Clean search-friendly URLs; meta titles/descriptions/heading hierarchy; semantic crawlable markup + image alt text; sitemap + indexing; fast-loading pages | High | Approved |
| F10 | **CRO — Conversion Rate Optimisation** | CTAs at high-intent points; streamlined enquiry flow (minimal fields); trust-building layout + information hierarchy; mobile-optimised conversion paths | Medium | Approved |
| F11 | **Mobile-First Responsive Design** | Fully responsive mobile/tablet/desktop; touch-friendly nav/search/browse; listings, filters, enquiry flow legible at small widths | High | Approved |
| F12 | **Analytics & Tracking** | GA4 setup + connection; track listing views + enquiries | Medium | Approved |
| F13 | **Hosting, Delivery & Support** | Deploy + go-live on client environment; hosting configured; handover; 1 month post-launch support (bug fixes/adjustments); management guidance | High | Approved |
| F14 | **Brand & Design Foundation** | Clean trustworthy UK-property interface; consistent look across listings/portal/admin; optional simple brand+logo creation if client has none | High | Approved |

**Explicitly OUT of scope (see §32 Future Features):** online payment/rent collection; automated communications & messaging; advanced reporting/dashboards; native mobile apps; entry of the ~100 properties data (client supplies); ongoing marketing/ads/SEO content writing; third-party integrations beyond GA4; multi-currency / non-UK localisation.

---

## 3. User Stories

**Property seeker / public visitor**
- As a property seeker, I want to search listings by keyword and location, so I can find relevant properties quickly.
- As a property seeker, I want to filter by property type, price range and availability, so I can narrow results.
- As a property seeker, I want to view a listing with photos, price, location and description, so I can assess a property.
- As a property seeker, I want to submit an enquiry from a listing, so I can contact the landlord/admin with minimal steps.
- As a mobile visitor, I want the site to work smoothly on my phone, since most property searches start on a phone.

**Tenant** *(role exists; ❓ tenant-facing screens not detailed — see §25)*
- As a tenant, I want a distinct account view, so I only see what's relevant to me.

**Landlord**
- As a landlord, I want to log in securely to my own dashboard, so I can manage my properties privately.
- As a landlord, I want to view my owned properties and their listing/occupancy status, so I know where each stands.
- As a landlord, I want basic reporting on properties, tenants and enquiry activity, so I stay informed without calling in.
- As a landlord, I want assurance my data is separated from other landlords, so my information stays private.

**Admin**
- As an admin, I want to add/edit/publish/unpublish any listing, so I control what's public.
- As an admin, I want to add/track/store tenant records against properties, so tenancy data is organised.
- As an admin, I want to search across all tenants, so I can retrieve records fast.
- As an admin, I want to receive routed enquiries and system notifications, so nothing is missed.
- As an admin, I want oversight of the whole platform from one control point, so I can manage everything centrally.

---

## 4. Pages / Screens

⚠️ **No page-level wireframes, component lists, empty states or loading states are specified in the source.** The list below is 🔶 **INFERRED** from described features. Empty/loading states = ❓ MISSING, must be designed.

| Page / Screen | Likely components (inferred) | Empty state | Loading state |
|---|---|---|---|
| **Home / landing** | Hero, search bar, featured/recent listings, CTAs | ❓ ask | ❓ ask |
| **Listings results** | Search bar, filters (type, price range, availability), results grid/list, pagination/indexing, sort | "No properties match" (❓ confirm) | ❓ ask |
| **Listing detail** | Photo gallery, key details, price, location, description, status badge (available/let), enquiry form + CTA | n/a | ❓ ask |
| **Enquiry form** | Minimal fields (❓ exact fields unknown), submit; routes to landlord/admin | — | ❓ ask |
| **Auth (login)** | Login form, password-protected; role-aware redirect | — | ❓ ask |
| **Landlord dashboard** | Owned-properties list, listing/occupancy status, basic reporting widgets, engagement touchpoints | "No properties yet" (❓ confirm) | ❓ ask |
| **Admin — listings management** | Table of listings, add/edit, publish/unpublish, status | ❓ ask | ❓ ask |
| **Admin — tenant management** | Tenant records table, add/edit tenant, communication log, status (active/pending/past), search | ❓ ask | ❓ ask |
| **Admin — oversight / control point** | Platform-wide view across properties/tenants/landlords/enquiries | ❓ ask | ❓ ask |
| **Tenant view** | ❓ Not described — must clarify scope | ❓ ask | ❓ ask |
| **SEO utility** | Sitemap, per-page meta | n/a | n/a |
| **Public content pages** | About, contact, privacy policy / terms (UK) — text supplied by client or placeholders | n/a | n/a |

---

## 5. UI / UX Requirements

| Aspect | Detail | Source |
|---|---|---|
| **Platform feel** | Clean, trustworthy, professional | ✅ Stated (marked "confirm this reads right") |
| **Consistency** | One visual language across listings, portal, admin | ✅ Stated |
| **Colours** | ❓ No preference captured — agency to choose "a clean neutral system" unless client specifies | ✅ Stated as open |
| **Fonts / type** | ❓ No preference captured — agency to choose unless client specifies | ✅ Stated as open |
| **Brand name + logo** | Client supplies, or agency creates a simple one | ✅ Stated |
| **Layout** | Trust-building, sensible information hierarchy guiding eye to next action | ✅ Stated |
| **Responsive** | Mobile-first; fully responsive mobile/tablet/desktop; touch-friendly nav/search/browse; legible at small widths | ✅ Stated |
| **Mobile/desktop behaviour** | Conversion paths optimised for mobile (most searches start on phone); results layout optimised both | ✅ Stated |
| **Performance UX** | Fast-loading pages (ranking + conversion factor) | ✅ Stated |
| **Icons** | ❓ Not specified | MISSING |
| **Animations** | ❓ Not specified | MISSING |
| **Spacing / design tokens** | ❓ Not specified | MISSING |
| **Design references / inspiration** | ❓ Blank — client asked for any property sites they like ("Inspiration → Refine") | ✅ Stated as open |
| **Must-not / avoid** | ❓ Blank — client to state anything to avoid | ✅ Stated as open |

---

## 6. Backend Requirements

✅ **Stated (high level):**
- Relational data model linking **properties, tenants, landlords, enquiries**.
- Structured for **100+ records at launch** with headroom to grow.
- Clean backend for property and record management.
- Architecture **prepared for future payments and automation without a rebuild**.
- **Authentication:** secure, password-protected accounts for every user.
- **Roles:** Tenant, Landlord, Admin (each with own view).
- **Permissions:** landlords cannot see other landlords' data; admin has platform-wide oversight from a single control point.
- **Business logic:** enquiries captured and routed to the correct landlord or admin; listing publish/unpublish controlled by admin; tenant status lifecycle (active/pending/past).

❓ **MISSING / ASK:** tech stack, framework, database engine (e.g., Postgres/MySQL vs. document store — "relational" is stated so SQL is implied 🔶), hosting/deployment target details, validation rules (field-level), password policy specifics, session/token strategy.

---

## 7. Database Design

⚠️ **No schema is given.** Entities are ✅ **named**; fields below are 🔶 **INFERRED** from feature descriptions and **must be confirmed**.

**Entity: User** 🔶
| Field | Type (inferred) | Req/Opt | Notes |
|---|---|---|---|
| id | UUID/int | Req | PK |
| email | string | Req | login |
| password_hash | string | Req | secure auth |
| role | enum(tenant, landlord, admin) | Req | ✅ roles stated |
| name | string | Req | |
| created_at / updated_at | timestamp | Req | |

**Entity: Property / Listing** 🔶
| Field | Type | Req/Opt | Notes |
|---|---|---|---|
| id | UUID/int | Req | PK |
| title / key details | string | Req | ✅ |
| description | text | Opt | ✅ |
| price | decimal (GBP) | Req | ✅ UK currency |
| location | string/geo | Req | ✅ |
| property_type | enum/string | Req | ✅ categorisation |
| status | enum(available, let) | Req | ✅ |
| published | boolean | Req | ✅ publish/unpublish |
| photos | media[] | Opt | ✅ multiple images |
| landlord_id | FK → User(landlord) | Req | 🔶 relationship |
| slug / SEO URL | string | Req | ✅ clean URLs |
| meta_title / meta_description | string | Opt | ✅ SEO |

**Entity: Tenant** 🔶 (may be modeled as User(role=tenant) + Tenant profile — ❓ confirm)
| Field | Type | Req/Opt | Notes |
|---|---|---|---|
| id | UUID/int | Req | PK |
| contact_details | string(s) | Req | ✅ |
| tenancy_status | enum(active, pending, past) | Req | ✅ |
| property_id | FK → Property | Req | ✅ property association |
| communication_log | related records | Opt | ✅ |

**Entity: Landlord** 🔶 (likely User(role=landlord) + profile)
| Field | Type | Req/Opt | Notes |
|---|---|---|---|
| id | UUID/int | Req | PK |
| owned_properties | FK[] → Property | — | ✅ |
| reporting data | derived | — | ✅ basic reporting |

**Entity: Enquiry** 🔶
| Field | Type | Req/Opt | Notes |
|---|---|---|---|
| id | UUID/int | Req | PK |
| property_id | FK → Property | Req | ✅ per-listing |
| routed_to | FK → User(landlord/admin) | Req | ✅ routing |
| contact fields | string | Req | ❓ exact fields unknown |
| created_at | timestamp | Req | |

**Entity: CommunicationLog** 🔶 — timestamped interactions linked to tenant (and/or property). ✅ concept stated, fields ❓.

**Relationships (✅ stated as "relational model linking properties, tenants, landlords and enquiries"):** Landlord 1—N Property; Property 1—N Tenant (occupancy) / Property 1—N Enquiry; Enquiry N—1 routed User.

---

## 8. API Requirements

⚠️ **No API contract exists in the source.** The following is a 🔶 **INFERRED starter list** for a developer to design and confirm — treat as proposal, not spec.

| Method | Endpoint (proposed) | Purpose | Input | Output |
|---|---|---|---|---|
| POST | `/auth/login` | Authenticate user | email, password | token/session, role |
| GET | `/listings` | List/search/filter properties | query: keyword, location, type, price range, availability, page | listing array + pagination |
| GET | `/listings/{slug}` | Listing detail | slug | listing object |
| POST | `/listings` | Create listing (admin) | listing fields | created listing |
| PUT | `/listings/{id}` | Edit listing (admin) | fields | updated listing |
| PATCH | `/listings/{id}/publish` | Publish/unpublish (admin) | published bool | status |
| POST | `/listings/{id}/enquiries` | Submit enquiry | contact fields | confirmation; routed to landlord/admin |
| GET | `/landlord/properties` | Landlord's owned properties | auth | property list + status |
| GET | `/landlord/reporting` | Basic reporting | auth | properties/tenants/enquiry activity |
| GET | `/admin/tenants` | List/search tenants | query, page | tenant array |
| POST | `/admin/tenants` | Add tenant record | tenant fields | created tenant |
| PUT | `/admin/tenants/{id}` | Edit tenant / status | fields | updated tenant |
| GET | `/admin/overview` | Platform oversight | auth(admin) | aggregate data |

❓ **ASK:** exact enquiry fields, pagination style, auth scheme, whether tenant has a self-service login/API.

---

## 9. Business Rules

✅ **Stated:**
- **Data isolation:** landlords never see another landlord's data.
- **Admin authority:** only admin can add/edit/publish/unpublish listings; admin has platform-wide oversight.
- **Enquiry routing:** each enquiry routes to the correct landlord or to admin.
- **Tenant status:** must be one of active / pending / past.
- **Listing status:** available / let; plus published/unpublished.
- **Scale rule:** system must comfortably hold/display 100+ properties from day one; search stays fast past 100.
- **UK-only:** single currency (GBP), UK locale; no multi-currency/localisation.
- **Auth required:** every account is password-protected and secure.

**Commercial / process rules (from Operating Agreement):** ✅ Stated
- **Revisions:** 3 rounds included, folded into Build + QA. One round = **one consolidated list**, not scattered messages. Scattered messages are batched into the current round.
- **Change requests:** anything **new or beyond** agreed scope = a **Custom Extra**, quoted in USD, and **no out-of-scope work starts until the Custom Extra is accepted in writing** in the order thread.
- **Revision vs change test:** changes how something agreed *looks/reads* → revision; *adds a capability* → change/future phase.
- **Approvals ("silence is a yes"):** each milestone auto-approves after **48h** of no response (T+0 ship, T+24 reminder, T+48 auto-approve). Auto-approval is reversible within reason if a genuine issue is flagged quickly.
- **Bug severity SLAs:** P1 Critical → same business day; P2 Major → within 1 business day; P3 Minor → within support window; P4 Cosmetic → batched. A bug = build not doing what was agreed (not a new request).
- **Status cadence:** one RAG (Green/Amber/Red) update every Monday in the order thread.
- **Escalation:** mark message "urgent/escalate" in order thread; not a channel for out-of-scope demands or timeline compression.
- **Communication channel:** the Fiverr order thread is the single source of truth. Working hours 8am–1am IST. Response SLA: within one business day. Off-platform calls recapped in writing into the thread same day.
- **Security process:** agency will **never** ask for passwords/credentials in the Fiverr inbox; credentials handed over via a secure method only.

---

## 10. Admin Features
✅ Stated: add/edit/publish/unpublish any listing; add/track/store tenant records; tenant communication log; tenant status tracking; search across all tenants; enquiry routing target; platform-wide oversight from a single control point; receives system + enquiry notifications (via admin email); manage listings/tenants/landlord accounts (with handover guidance).

## 11. Customer (Tenant / Property-Seeker) Features
✅ Stated: browse listings; keyword + location search; filter (type, price, availability); view listing detail (photos, price, location, description, status); submit enquiry. Tenant record tracked by admin (contact, status, property association, communication log). ❓ Whether tenants have a self-service login/portal is **not described** — clarify.

## 12. Vendor Features
❓ **Not applicable / none in scope.** There is no multi-vendor/marketplace concept. ("Landlord" is the closest role and is covered in §5 features, not a vendor storefront.)

---

## 13. Dashboard Requirements
- **Landlord dashboard** ✅: owned properties + listing/occupancy status; basic reporting (properties, tenants, enquiry activity at a glance); engagement touchpoints.
- **Admin control point** ✅: platform-wide oversight; listings + tenant management + search.
- **Advanced reporting / analytics dashboards** ❌ explicitly **future phase** — launch reporting is "basic by design."

---

## 14. Notifications
- **In-app / routing** ✅: enquiries captured and routed to correct landlord or admin.
- **Email** ✅ (partial): the platform **admin email** receives system + enquiry notifications.
- **Automated communications & messaging** ❌ **out of scope** (named future phase) — no automated email flows, SMS, or push at launch.
- **SMS / Push** ❓ none in scope.

---

## 15. Integrations
| Service | Status |
|---|---|
| **Google Analytics 4 (GA4)** | ✅ In scope — setup + tracking on listing views & enquiries |
| Payment gateway (Stripe/Razorpay/etc.) | ❌ Out of scope (future: online payment & rent collection) |
| Google Maps | ❓ Not mentioned (location is stated, but maps not specified — ask) |
| Firebase / Twilio / Cloudinary | ❌ Not mentioned / not in scope |
| Any third-party integration beyond GA4 | ❌ "Scoped and quoted on request" |

---

## 16. Files & Media Requirements
- **Property photos** ✅ — multiple per listing, client-supplied, ready to publish.
- **Logo & brand assets** ✅ — client-supplied files, or agency creates a simple set.
- **Content text** ✅ — About/contact/policy text client-supplied, or agency drafts placeholders.
- **Property data** ✅ — client supplies ~100 listings as a spreadsheet or shared folder (agency loads structure; **data entry itself is out of scope**).
- Videos / PDFs / other uploads ❓ — not mentioned.

---

## 17. Security Requirements
✅ Stated: secure, password-protected authentication for every account; permission boundaries enforcing landlord data isolation; admin-only control point; credentials never collected via chat/inbox, handed over via secure method only.
❓ **ASK:** encryption at rest/in transit specifics, password policy, rate limiting (none stated), session expiry, 2FA (not mentioned), GDPR/UK-GDPR handling of tenant/landlord personal data (⚠️ **risk — see §31**).

---

## 18. Performance Requirements
✅ Stated: fast, **indexed queries** that stay quick well past 100 listings; fast-loading pages (page speed as ranking + conversion factor); results layout optimised desktop + mobile.
🔶 Inferred: pagination and search indexing implied by "indexed queries" and "results layout."
❓ **ASK:** caching strategy, explicit pagination size, sorting options, concrete performance targets (e.g., LCP/TTFB).

---

## 19. SEO Requirements
✅ Stated: clean, search-friendly URL structure across pages and listings; proper meta titles, descriptions and heading hierarchy; semantic, crawlable markup + image alt text; sitemap + indexing setup; fast-loading pages.
❌ Out of scope: ongoing SEO content writing / marketing campaigns.

---

## 20. Accessibility Requirements
❓ **None explicitly stated.** "Semantic, crawlable markup," "image alt text," and "legible at small widths" partially support accessibility but no WCAG target is given. **Recommend confirming an accessibility standard** (e.g., WCAG 2.1 AA), especially given UK public-facing use.

---

## 21. Bugs Mentioned
**None.** No bugs are reported in these documents (project not yet built). The Operating Agreement only defines the **bug-handling policy** (P1–P4 severities and SLAs) for the post-launch support window — captured in §9.

---

## 22. UI Changes Requested
**None.** No revisions/UI change requests exist yet — the project has not started. The documents only define *how* UI changes will be classified (revision vs change) once build begins.

---

## 23. Feature Changes (chronological)
No mid-project feature changes (single set of documents, pre-kickoff). ⚠️ **One documentation inconsistency to resolve:**

| Old / Doc | New / Doc | Note |
|---|---|---|
| Proposal lists **11 numbered workstreams** (Property Listings → Hosting/Support) | Welcome Packet adds **"A. Brand & Design Foundation"** as a scope group | Welcome Packet still says "eleven workstreams" while listing 12 groupings. **Confirm whether Brand & Design is a 12th workstream or folded into others.** |

---

## 24. Client Decisions (finalised)
✅ All from documents:
- Build a custom UK property platform from scratch (greenfield).
- Include **all three pillars** (listings, tenant management, landlord portal) rather than dropping one to hit budget.
- Chosen plan: **The Launch MVP — $1,000 USD**, 28 days, 3 revision rounds, 1 month support.
- Lean, launch-first approach with scalable foundation.
- Target ~100 properties, UK only, English/GBP.
- Azeez is sole decision maker; approvals via Fiverr order thread.
- Payment in-platform via Fiverr (paid in full per Welcome Packet).
- Accepts silent-approval (48h), revision, change, bug, and escalation policies.

---

## 25. Pending Questions (must clarify before/at kickoff)
1. **Tenant portal:** Do tenants get a self-service login/view, or are tenants purely admin-managed records? (Role exists but tenant-facing screens undefined.)
2. **"Eleven workstreams" vs 12 scope groups** — reconcile (see §23).
3. **Enquiry form fields** — exact fields required.
4. **Maps** — is a map view/geolocation on listings expected? (Location is stated; maps aren't.)
5. **Brand:** does client have a name/logo/colours/fonts, or should agency create them?
6. **Design inspiration & "must-not"** — both left blank in discovery.
7. **Reporting scope** — what exactly counts as "basic reporting" for landlords?
8. **Engagement touchpoints** — concrete definition (what does a landlord "engage" with?).

---

## 26. Assumptions
🔶 Explicitly derived (developer should validate):
- Relational/SQL database (documents say "relational model").
- Currency is GBP; UK date/locale formats.
- Web-only, browser-based, responsive (no native app).
- Tenant records are admin-created; enquiries come from anonymous public visitors.
- Photos hosted with the platform (no CDN named).
- Single-tenant application instance (not SaaS multi-org) — one Azeez-owned platform.

---

## 27. Missing Information (blockers to confirm)
- **Tech stack / framework / DB engine / hosting target** — entirely unspecified.
- **Property data:** client to supply ~100 listings (spreadsheet/folder) with key details, price, location, type, status + photos.
- **Domain** (registrar/DNS access).
- **Hosting account / deployment environment.**
- **Admin email** for top-level admin role + notifications.
- **GA4 account** (or willingness to create one).
- **Brand assets** (logo, colours, fonts) or instruction to create.
- **Legal content:** UK privacy policy + terms text; contact details.
- **Accessibility target** (none stated).
- **GDPR/data-protection approach** for personal data (tenants/landlords).
- Full field-level validation rules, empty/loading states, pagination sizes.

---

## 28. Timeline / Deadlines
✅ Stated — **28-day path**, starting the same business day after confirmation (both proposal timeline and Welcome Packet timeline given; minor phrasing differences reconciled below):

| Days | Phase | What happens | Approval gate |
|---|---|---|---|
| **1–2** | Onboarding | Kickoff, requirements confirmed; collect property data, brand+logo, design prefs, domain/hosting access | Requirements confirmed (auto at 48h) |
| **3–7** | Design & Foundation | UI direction (listings/portals/admin) + relational DB architecture | Direction approved at 48h |
| **8–20** | Build | Listings engine, tenant mgmt, landlord portal, search/filter, roles/access, SEO, analytics | Milestone reviews (auto at 48h) |
| **21–25** | QA + Revisions | Cross-device testing, role checks, bug fixes, performance pass; 3 revision rounds folded in | Delivery review (auto at 48h) |
| **26–28** | Launch + Handover | Deploy/go-live on client env, walkthrough, handover | Acceptance |
| **+1 month** | Care | Post-launch support: fixes, adjustments, guidance | Closed at window end |

> ⚠️ Minor source discrepancy: Proposal §05 shows **Build = Days 3–22, QA = Days 23–26, Delivery = Days 27–28**; Welcome Packet §06 shows **Design 3–7, Build 8–20, QA+revisions 21–25, Launch 26–28**. The Welcome Packet is the later, more detailed document — treat it as authoritative but confirm.

**Client response windows:** every hand-off (kickoff data, design review, build feedback, delivery acceptance) requires a response **within 2 working days (48h)** or it auto-approves.

---

## 29. Credentials Mentioned (placeholders only — no secrets present)
- Domain registrar / DNS access — *to be provided securely*
- Hosting account / deployment environment access — *to be provided securely*
- Platform admin email — *to be provided*
- Google Analytics 4 account — *to be provided or created*
- (Optional) existing code repository / accounts — *only if carried over*
- `{{LIVE_URL}}` — placeholder for interactive asset/access checklist page (agency fills before sending)

No actual keys, passwords, or secrets appear in the documents (agency policy: credentials never shared in plain chat).

---

## 30. Third-Party Services
- **Fiverr** — order/payment platform & sole communication channel (order thread).
- **Google Analytics 4** — analytics.
- **Domain registrar / DNS** and **hosting provider** — TBD by client environment.
- No payment processor, SMS, maps, media CDN, or messaging service in scope.

---

## 31. Risks
1. **No technical spec** — stack, schema, and API undefined; estimation/architecture risk.
2. **UK-GDPR / data protection** — platform stores personal data (tenants, landlords, enquirers) with no stated compliance plan. ⚠️ Legal/privacy risk.
3. **Accessibility** — no WCAG target for a UK public site.
4. **Client-supplied data dependency** — timeline explicitly depends on property data + access arriving in Days 1–2; late/partial delivery slips the 28 days (agency's stated top risk).
5. **Scope-vs-budget tension** — full 3-pillar custom platform for $1,000/28 days is aggressive; feature depth ("basic reporting," "engagement touchpoints") is loosely defined and prone to revision churn.
6. **Silent auto-approval (48h)** — quality risk if client is slow to review; milestones ship unreviewed.
7. **Documentation inconsistencies** — 11 vs 12 workstreams; two slightly different timelines.
8. **Tenant role ambiguity** — building the wrong thing if tenant portal expectations differ.

---

## 32. Future Features (client wants later / named future phases)
✅ Explicitly listed as "Not in this build," on the same scalable foundation:
1. Online payment & rent collection.
2. Automated communications & messaging (email flows, etc.).
3. Advanced reporting & dashboards.
4. Native mobile apps (iOS / Android).
5. Ongoing marketing, ads, or SEO content writing.
6. Third-party integrations beyond GA4.
7. Multi-currency / non-UK localisation.
(All quotable later as **Custom Extras / future phases**.)

---

## 33. Action Items (TODO checklist)

**Discovery / pre-build**
- [ ] Confirm tech stack, DB engine, hosting target
- [ ] Resolve 11-vs-12 workstream inconsistency
- [ ] Confirm tenant portal scope (login vs admin-only records)
- [ ] Collect ~100 property listings data + photos
- [ ] Collect brand assets (or approve agency-created brand)
- [ ] Capture colours, fonts, inspiration, must-nots
- [ ] Get domain, hosting, admin email, GA4 access (securely)
- [ ] Confirm accessibility target + UK-GDPR approach
- [ ] Finalise enquiry form fields + validation rules

**Design**
- [ ] UI direction for listings, portals, admin (one visual language)
- [ ] Design empty + loading states for all screens
- [ ] Mobile-first responsive layouts

**Backend**
- [ ] Design relational schema (Property, Tenant, Landlord, Enquiry, User, CommunicationLog)
- [ ] Build auth (password-protected, role-based)
- [ ] Enforce role permissions + landlord data isolation
- [ ] Enquiry capture + routing logic
- [ ] Listing publish/unpublish + status logic
- [ ] Tenant status lifecycle (active/pending/past)
- [ ] Indexed search + filters (keyword, location, type, price, availability)
- [ ] Basic landlord reporting

**Frontend**
- [ ] Public: home, listings results, listing detail, enquiry form
- [ ] Auth + role-aware routing
- [ ] Landlord dashboard
- [ ] Admin: listings mgmt, tenant mgmt + search, oversight
- [ ] Tenant view (pending scope confirmation)

**SEO / Analytics**
- [ ] Clean URLs, meta, headings, alt text, semantic markup
- [ ] Sitemap + indexing
- [ ] GA4 setup + track listing views & enquiries

**Launch**
- [ ] Cross-device QA + role checks + performance pass
- [ ] Fold in 3 revision rounds
- [ ] Deploy/go-live on client environment
- [ ] Handover + management guidance
- [ ] Start 1-month support window

---

## 34. Development Roadmap

**Phase 1 — Onboarding & Foundation (Days 1–7)**
Collect data/access/brand; confirm open questions (§25); UI direction; relational DB architecture.

**Phase 2 — Core Build (Days 8–20)**
Listings engine + admin management; tenant management + search; landlord portal + basic reporting; roles/access + data isolation; search/filter/discovery; enquiry routing; SEO foundation; GA4.

**Phase 3 — QA, Re, QA, Revisions & Hardening (Days 21–25)**
Cross-device testing, role/permission checks, performance/indexing pass, bug fixes; fold in 3 revision rounds.

**Phase 4 — Launch & Care (Days 26–28 + 1 month)**
Deploy/go-live on client environment, handover + guidance; 1-month post-launch support (P1–P4 SLAs).

**Phase 5+ — Future (post-MVP, quoted separately)**
Payments/rent collection → automated messaging → advanced reporting → native apps → integrations/localisation.

---

## 35. Final PRD (consolidated)

### 35.1 Summary
Build **UK Property Platform** ("The Launch MVP") — a greenfield, UK-only, mobile-first web platform for property lettings with three roles (Tenant, Landlord, Admin), scoped for ~100 properties at launch on a scalable relational foundation. Delivered by Digital Heroes for **$1,000 USD in 28 days**, with 3 revision rounds and 1 month of support.

### 35.2 Goals & Non-Goals
**Goals:** live listings site with search/filter; admin listing + tenant management; secure landlord portal with basic reporting; SEO + GA4; responsive; fast; scalable for future payments/automation.
**Non-Goals (launch):** payments/rent collection, automated messaging, advanced dashboards, native apps, marketing/content, non-GA4 integrations, multi-currency/non-UK.

### 35.3 Users & Roles
Tenant, Landlord, Admin — distinct views; password-protected; strict landlord data isolation; admin has full oversight. (Tenant portal depth = open question.)

### 35.4 Functional scope
Per §2 (F1–F14). Core pillars = Property Listings Engine, Tenant Management System, Landlord Portal & Engagement; supported by Search/Filter, Roles/Access, DB/Architecture, SEO, CRO, Mobile-First, Analytics, Hosting/Support, Brand/Design.

### 35.5 Data model
Relational: Property, Tenant, Landlord, Enquiry, User (+ CommunicationLog), linked per §7. Schema to be confirmed.

### 35.6 Non-functional
Fast indexed queries past 100 records; fast page loads; mobile-first responsive; secure auth + permission boundaries; SEO-ready markup. Accessibility target and GDPR approach **to be defined**.

### 35.7 Integrations & infra
GA4; client-provided domain + hosting; Fiverr for payment/comms. No other integrations at launch.

### 35.8 Delivery, process & governance
28-day phased plan (§28); 3 consolidated revision rounds; Custom Extras for out-of-scope; 48h silent auto-approval; weekly Monday RAG updates; P1–P4 bug SLAs during 1-month support; order thread as single record.

### 35.9 Open items (must resolve to build)
Tech stack; tenant portal scope; 11-vs-12 workstreams; enquiry fields; maps; brand/design tokens; reporting/engagement definitions; accessibility + data-protection; all access/credentials + property data (§25, §27).

### 35.10 Acceptance criteria (launch)
- Public users can search, filter, view listings, and submit enquiries on mobile + desktop.
- Enquiries route to the correct landlord/admin.
- Admin can add/edit/publish/unpublish listings and manage/search tenant records with status tracking + communication log.
- Landlords log in securely, see only their own properties/occupancy + basic reporting; no cross-landlord data leakage.
- Roles enforced; auth secure.
- SEO foundation + GA4 tracking live; sitemap indexed.
- Platform holds 100+ listings with fast search; deployed on client environment; handover complete.

---

*Extraction complete. All items are traced to the three source documents; inferred and missing items are labelled so nothing is mistaken for a client instruction.*
