# semaauth-website — Development Roadmap

North star: marketing site + real admin console, dogfooding semaAUTH for login, real approved content only.

## Stage 0 — Content & configuration lock

- [ ] Content pack from product: pricing, logos, compliance wording, contact email
- [ ] Replace placeholder marketing claims with approved copy
- [x] `.env.example` with auth + API configuration
- [ ] Production deployment target confirmed (Vercel recommended)

## Stage 1 — Dogfood auth *(in progress)*

- [x] OAuth client `semaauth_website` (migration `012_semaauth_website_client.sql`)
- [x] `@semaauth/sdk-web` integration
- [x] BFF routes: `POST /auth/session`, `/auth/refresh`, `/auth/logout`
- [x] `/login` and `/callback` pages (PKCE + MFA)
- [x] Protected `/dashboard/*` via session gate
- [x] Header CTAs wired to login flow

## Stage 2 — API layer & BFF

- [ ] Typed admin API client (`@semaauth/shared-types`)
- [ ] Server proxy routes `/api/admin/*` with Bearer from session
- [ ] TanStack Query hooks for dashboard data
- [ ] Loading, error, and empty states

## Stage 3 — Dashboard read-only (APIs exist)

- [ ] Users → `GET /admin/users`
- [ ] Audit → `GET /admin/audit-events`
- [ ] Settings → `GET/PATCH /admin/tenant/settings`
- [ ] Overview metrics from live data
- [ ] Session revoke action

## Stage 4 — Apps, security, billing (backend gaps)

- [ ] `/admin/apps` CRUD in backend-core
- [ ] Wire Applications page
- [ ] Security policies beyond tenant settings
- [ ] Billing (real or honestly deferred)

## Stage 5 — Marketing polish & product truth

- [ ] Real dashboard screenshots in product blocks
- [ ] Hero preview from live console
- [ ] Performance pass (LCP, images)

## Stage 6 — Documentation depth

- [ ] Getting started aligned with SDK
- [ ] Architecture guide
- [ ] API reference
- [ ] Integration guides (React, Express, NestJS)

## Stage 7 — Ops & production

- [ ] Contact form delivery
- [ ] Analytics
- [ ] CI/CD pipeline
- [ ] Security headers + CSP
- [ ] Sitemap + OG images

## Stage 8 — Onboarding & trial flow

- [ ] Tenant provisioning / invite flow
- [ ] Post-signup checklist in dashboard
- [ ] Org switcher for multi-tenant admins

---

## Local dev (Stage 1)

1. Run migrations on backend-core (includes `012_semaauth_website_client.sql`)
2. Start backend: `backend-core` on `:8080`
3. Copy `.env.example` → `.env.local` in semaauth-website

**Dependencies:** `@semaauth/*` packages install from [github.com/semaAUTH/semaauth](https://github.com/semaAUTH/semaauth) (`main` branch, monorepo paths). Source is compiled on `pnpm install` via `scripts/build-semaauth-deps.mjs` (GitHub does not ship `dist/`). Optional: push `prepare` scripts in semaauth to run the same build automatically.

4. `pnpm dev` in semaauth-website on `:3000`
5. Sign in with dev user: `dev@example.com` / `password123`
