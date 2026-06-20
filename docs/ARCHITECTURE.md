# semaAUTH Monorepo Architecture

How this repository is organized, what belongs where, and naming conventions.

**Canonical spec:** [SPECIFICATION.md](./SPECIFICATION.md)

---

## Top-level layout

```
semaauth/
├── backend-core/          # Go OAuth/OIDC engine (source of truth for auth)
├── adapters/              # Framework integrations (Express, NestJS)
├── sdk-web/               # Browser/React client SDK
├── sdk-mobile/            # Mobile client SDK (Expo / RN / Flutter patterns)
├── packages/              # Shared TypeScript libraries (no framework coupling)
├── demo/                  # Thin integration demos (wiring only)
├── docs/                  # Specification + architecture + red lines
├── scripts/               # Dev setup helpers
└── .github/workflows/     # CI
```

| Path | Package | Layer |
|------|---------|-------|
| `backend-core/` | — | Auth server |
| `packages/shared-types/` | `@semaauth/shared-types` | Contracts |
| `packages/jwt-verify/` | `@semaauth/jwt-verify` | JWKS JWT verify (adapters) |
| `packages/adapter-core/` | `@semaauth/adapter-core` | Shared adapter logic (BFF refresh) |
| `adapters/express/` | `@semaauth/adapter-express` | Express middleware + BFF |
| `adapters/nestjs/` | `@semaauth/adapter-nestjs` | NestJS module + guard + BFF |
| `sdk-web/` | `@semaauth/sdk-web` | React PKCE + session |
| `sdk-mobile/` | `@semaauth/sdk-mobile` | Mobile PKCE + secure storage ports |
| `demo/api-express/` | `@semaauth/demo-api-express` | Express demo |
| `demo/api-nestjs/` | `@semaauth/demo-api-nestjs` | NestJS demo |
| `demo/web-react-vite/` | `@semaauth/demo-web-react-vite` | Vite SPA demo |

**Rule:** User-facing SDKs and adapters live at repo root. Cross-cutting TS libs live under `packages/`.

---

## backend-core (Go)

```
backend-core/
├── cmd/server/            # Entrypoint only
├── internal/
│   ├── config/            # Env loading
│   ├── crypto/            # Ed25519, Argon2id, opaque tokens
│   ├── database/          # Pool + RLS transaction helper (set_config)
│   ├── models/            # Domain structs
│   ├── protocols/         # HTTP handlers by OAuth surface
│   │   ├── authorize/     # GET/POST /oauth/authorize, PKCE
│   │   ├── token/         # POST /oauth/token, /oauth/revoke, /oauth/introspect
│   │   ├── jwks/          # GET /.well-known/jwks.json
│   │   ├── discovery/     # GET /.well-known/openid-configuration
│   │   ├── mfa/           # POST /oauth/mfa/verify, TOTP enrollment
│   │   ├── social/        # IdP OAuth callbacks
│   │   ├── userinfo/      # GET /oauth/userinfo
│   │   └── webauthn/      # Passkey register/authenticate
│   ├── server/            # Route wiring, CORS, middleware chain
│   ├── store/postgres/    # RLS-scoped repositories
│   ├── session/           # Login session cookies (authorize flow)
│   ├── tenant/            # HTTP tenant resolution (Host / X-Tenant-ID)
│   ├── services/          # Business logic (not HTTP)
│   │   ├── user.go        # User management (Phase 2+)
│   │   ├── mfa/           # TOTP (launch); SMS port stub remains out of launch scope
│   │   └── social/        # IdP normalization (Phase 6)
│   ├── dev/               # Dev playground HTML
│   └── integration/       # Full OAuth flow tests
└── migrations/            # Sequential SQL: 001_, 002_, …
```

### Naming notes

| Name | Location | Meaning |
|------|----------|---------|
| `database/tenant.go` | RLS | `SET LOCAL semaauth.current_tenant_id` per transaction |
| `tenant/resolver.go` | HTTP | Resolve tenant from request Host or header |
| `adapters/*/tenant*` | Node | Ensure `req.semaauth.tenantId` before DB handlers |

Do **not** put compiled binaries in `backend-core/` — use `make build-go` → `bin/semaauth`.

---

## Adapters (Express + NestJS)

Both adapters share refresh BFF logic via `@semaauth/adapter-core` and JWT verify via `@semaauth/jwt-verify`.

### File naming convention (both adapters)

| File | Purpose |
|------|---------|
| `router.ts` / `controller.ts` | BFF routes (`POST /auth/session`, `/auth/refresh`, `/auth/logout`) |
| `verify.ts` / `guard.ts` | Bearer JWT → `req.semaauth` |
| `tenant.ts` / `interceptor.ts` | Tenant context guard |
| `types.ts` | Request extensions |
| `index.ts` | Public exports only |

**Express:** functional filenames (`router.ts`, `verify.ts`).  
**NestJS:** same pattern — `module.ts`, `guard.ts`, `controller.ts` (no `semaauth.` prefix on files; `SemaAuth*` on exported classes).

---

## sdk-web (browser only)

```
sdk-web/src/
├── index.ts               # Public barrel — apps import from here only
├── react/                 # React context, guards, TanStack Query
├── oauth/                 # PKCE, authorize URL, token exchange
└── session/               # In-memory tokens, BFF refresh fetch
```

**Do not** add server-side JWT middleware here — use `@semaauth/jwt-verify` or `@semaauth/adapter-express`.

PKCE verifier/state must use `sessionStorage` only during redirect. Tokens must never be stored in browser storage.

---

## sdk-mobile

```
sdk-mobile/src/
├── client.ts              # SemaAuthClient
├── callback.ts            # Deep-link parsing
├── oauth/                 # PKCE, token exchange, refresh
├── platform/
│   ├── secure-store.ts    # SecureTokenStore port
│   ├── system-browser.ts
│   └── pending-auth.ts    # PKCE state before callback
├── session/
│   └── interceptor.ts     # createAuthInterceptor
└── index.ts
```

Platform implementations (Keychain, expo-auth-session) belong in app code, not this package.

---

## demo/

Thin wiring only — **no duplicated auth logic**.

```
demo/
├── api-express/src/index.ts   # Express + adapter-express
├── api-nestjs/src/            # NestJS + adapter-nestjs
└── web-react-vite/src/        # Vite SPA + sdk-web
```

---

## Migrations

Sequential numeric prefix, one concern per file:

```
001_initial.sql
002_dev_seed.sql
003_dev_playground_redirect.sql
004_dev_callback_only.sql
005_example_clients.sql
006_example_spa_port_5174.sql
007_social_auth_states.sql
008_mfa_sessions.sql
009_webauthn.sql
010_refresh_scope_and_sms_mfa.sql
```

`docker-compose` runs `001` + `002` on first boot; `scripts/setup.sh` applies `003+` patches idempotently.

---

## Dependency direction

```
demo/ → sdk-* / adapters → packages/* → shared-types
adapters → adapter-core, jwt-verify
backend-core → (no TS dependencies)
```

Never import adapters or sdk-web from `backend-core`. Never put secrets in `VITE_*` / `EXPO_PUBLIC_*` env vars.

---

## Adding new code

| Adding… | Put it in… |
|---------|------------|
| OAuth HTTP endpoint | `backend-core/internal/protocols/` |
| Social IdP provider | `backend-core/internal/services/social/` |
| Social callback route | `backend-core/internal/protocols/social/` |
| DB repository | `backend-core/internal/store/postgres/` |
| Shared TS type | `packages/shared-types/` |
| JWT verify helper | `packages/jwt-verify/` |
| Adapter shared logic | `packages/adapter-core/` |
| Express middleware | `adapters/express/src/` |
| NestJS guard/module | `adapters/nestjs/src/` |
| React hook / PKCE | `sdk-web/src/{react,oauth,session}/` |
| Mobile platform port | `sdk-mobile/src/platform/` |
