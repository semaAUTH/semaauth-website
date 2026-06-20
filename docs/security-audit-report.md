# semaAUTH Security Review Report

> **Scope note:** Apple Sign in and SMS OTP MFA are **out of launch scope** for this release. Launch ships Google/GitHub/Microsoft social login and TOTP MFA only. SMS-related findings below refer to code that is not enabled for production use until a gateway is integrated.

## Scope
This review is based on a code inspection of the repository, with focus on authentication flows, token handling, configuration defaults, secret exposure, and deployment assumptions.

## Executive summary
The repository has several strong design choices:
- public clients are expected to use PKCE only,
- access tokens are not stored in browser storage,
- JWT verification is designed around JWKS instead of DB lookups,
- the docs explicitly call out tenant isolation and token handling rules.

The main concerns are not a complete redesign issue; they are a set of security and operational gaps that can weaken the protection model if left unchanged in production.

---

## Remediation status (Phase 10)

| Finding | Status |
| --- | --- |
| Refresh token scope over-issued on rotation | **Fixed** — `scope` persisted on `refresh_tokens` (migration `010`) |
| Config validation too permissive | **Fixed** — `SEMAAUTH_ENV=production` requires signing key, strong session key, HTTPS issuer |
| Session cookie `Secure: false` in production | **Fixed** — `Secure` enabled when `SEMAAUTH_ENV=production` |
| SMS OTP verification (stub code) | **Not implemented for launch** — SMS OTP MFA is excluded from the current release and must not be treated as enabled behavior |
| Secret hygiene (local `.env`) | **Not resolved** — production deployments must use a secret manager, not local env files |
| Security headers on auth pages | **Fixed** — middleware on `/oauth/*`, `/auth/*`, `/dev/*` |
| Production CORS allowlist | **Fixed** — `SEMAAUTH_ALLOWED_CORS_ORIGINS` required in production |
| Committed `dist` artifacts | **Open** — build outputs must not be committed; CI must generate them only |

---

## Findings

| Severity | Area | Finding | Status |
| --- | --- | --- | --- |
| High | Session handling | Session cookie falls back to dev secret; `Secure=false` in development | **Fixed in prod** — `SEMAAUTH_ENV=production` requires strong key + `Secure` cookies |
| High | Secret hygiene | Local `.env` files can leak OAuth secrets | **Open** — use secret manager in production |
| High | Token scope handling | Refresh flow re-issued hardcoded scope | **Fixed** — migration `010`, scope preserved on rotation |
| Medium | MFA flow | SMS path did not validate OTP | **Out of scope** — SMS OTP MFA excluded from launch; do not enable until gateway integrated |
| Medium | Config validation | Server accepted missing/weak signing/session keys | **Fixed** — production validation in `config.Validate()` |
| Medium | Deployment posture | Localhost defaults usable in production | **Fixed** — prod requires explicit CORS allowlist |
| Low | Supply-chain hygiene | `dist` outputs may be committed | **Open** — gitignore or CI-only builds |

---

## Detailed notes

### 1) Insecure fallback secret and cookie settings

**Status: Fixed for production** (Phase 10). Development still allows fallback secret and `Secure=false` by design.

Evidence:
- Dev fallback: [backend-core/internal/session/session.go](backend-core/internal/session/session.go) — `dev-insecure-session-key` only when `SEMAAUTH_ENV≠production`
- Production: `NewManager(..., production bool)` sets `Secure=true`; startup fails without strong `SEMAAUTH_SESSION_KEY`

Remaining:
- Security headers on auth pages (Workstream A, below)

### 2) Credential leakage risk from local env files
Evidence:
- The repo contains a local env file with OAuth client secrets and signing/session settings: [.env](.env)
- The sample env file also documents secret variables: [.env.example](.env.example)

Risk:
- Local dev credentials can be copied, logged, or shared unintentionally and must never be treated as production secrets.
- Even when `.env` is not committed, a local workspace copy can leak credentials to anyone with access to the machine or repo snapshot.

Recommendation:
- Use a secret manager (e.g. Vault, AWS Secrets Manager, Doppler, GitHub Actions secrets).
- Rotate any credentials that were exposed in screenshots, logs, or copied files.
- Add a pre-commit or CI check to reject accidental secret commits.

### 3) Refresh token flow over-issues scope

**Status: Fixed** (Phase 10, migration `010`).

Evidence:
- Refresh handler uses `record.Scope`: [backend-core/internal/protocols/token/handler.go](backend-core/internal/protocols/token/handler.go)
- Scope column on `refresh_tokens` table: [backend-core/migrations/010_refresh_scope_and_sms_mfa.sql](backend-core/migrations/010_refresh_scope_and_sms_mfa.sql)

### 4) SMS MFA path

**Status: Out of launch scope** — SMS OTP MFA is a future upgrade. Do not enable `sms_enabled` in production until a real gateway is integrated.

Evidence:
- Stub provider only: [backend-core/internal/services/mfa/sms.go](backend-core/internal/services/mfa/sms.go)
- Verification plumbing exists in [backend-core/internal/services/mfa/service.go](backend-core/internal/services/mfa/service.go) but is not user-facing at launch

Before enabling in a future release:
- Integrate `TwilioSmsProvider` (or equivalent)
- Rate-limit challenge attempts
- End-to-end test SMS login flow

### 5) Config validation is too permissive

**Status: Fixed for production** (Phase 10).

Evidence:
- `SEMAAUTH_ENV=production` requires signing key, strong session key, HTTPS issuer: [backend-core/internal/config/config.go](backend-core/internal/config/config.go)
- Tests: [backend-core/internal/config/config_test.go](backend-core/internal/config/config_test.go)

Remaining:
- Ephemeral signing key generation still allowed in development when `SEMAAUTH_SIGNING_KEY` is empty

### 6) Security headers are not explicitly enforced on auth responses

**Status: Fixed** (Milestone 1) — [backend-core/internal/server/security_headers.go](backend-core/internal/server/security_headers.go)

Evidence (historical):
- Auth handlers did not set CSP/X-Frame-Options/Referrer-Policy directly.

Now applied via middleware on `/oauth/*`, `/auth/*`, and `/dev/*`.

### 7) Dev-oriented CORS logic is permitted only for local testing and must be restricted in production

**Status: Fixed** (Milestone 1) — [backend-core/internal/server/cors.go](backend-core/internal/server/cors.go)

Evidence:
- Localhost HTTP origins allowed only when `SEMAAUTH_ENV≠production`
- Production requires `SEMAAUTH_ALLOWED_CORS_ORIGINS` (https only)

---

## Good patterns already present

These are required positives and must be preserved:
- The documentation explicitly forbids public client secrets and browser token storage: [docs/ARCHITECTURAL-RED-LINES.md](docs/ARCHITECTURAL-RED-LINES.md)
- The web SDK keeps tokens in memory rather than browser storage: [sdk-web/src/session/storage.ts](sdk-web/src/session/storage.ts)
- The JWT/JWKS flow is implemented for public verification: [backend-core/internal/protocols/jwks/handler.go](backend-core/internal/protocols/jwks/handler.go)
- The repo uses `Cache-Control: no-store` for sensitive responses: [backend-core/internal/protocols/token/handler.go](backend-core/internal/protocols/token/handler.go)

---

## Mandatory hardening plan

| Item | Status |
| --- | --- |
| Production config validation (signing key, session key, HTTPS issuer) | ✅ Done |
| Preserve refresh token scope on rotation | ✅ Done |
| Secure session cookies in production | ✅ Done |
| Secret manager (not local `.env`) | ❌ Open |
| Security headers on auth responses | ✅ Done |
| Production CORS allowlist | ✅ Done |
| `POST /oauth/revoke` + core logout | ✅ Done |
| Token introspection | ✅ Done |
| Centralized JWT claim validation | ✅ Done |
| Admin / audit APIs | ❌ Open — Workstream D |
| CI: `go test`, secret scanning | **Partial** — `go test ./...` in CI; secret scanning still open |

---

## Development guide to close the remaining gap

This section is the implementation plan for taking the repository from a solid OAuth/OIDC core to a production-grade identity platform. The goal is not to add abstract features; it is to complete the missing operational and security control points that are required for enterprise readiness.

### 1) Delivery objective

By the end of this work, the platform must satisfy all of the following:

- production startup fails if required secrets or issuer settings are missing;
- auth responses are protected with explicit security headers;
- logout and token revocation are complete and verifiable;
- token introspection and session management are available for API consumers;
- admin and tenant controls are reachable through documented APIs;
- every workstream has automated tests and CI enforcement.

### 2) Workstream order

The implementation must happen in the exact order below so that later work is not blocked by missing controls:

1. config + deployment hardening;
2. logout / revocation / session lifecycle;
3. introspection and token validation policy;
4. admin management and org-level controls;
5. observability and audit trails;
6. test coverage and release gates.

### 3) Workstream A — production config and startup hardening

#### Required outcome
The server must not boot in production with weak or ambiguous trust settings.

#### Already done (Phase 10 + Milestone 1)
- `Config.Validate()` rejects weak/missing signing and session keys when `SEMAAUTH_ENV=production`
- HTTPS issuer required in production
- Session cookies use `Secure=true` in production
- `SEMAAUTH_ALLOWED_CORS_ORIGINS` required in production (https origins only)
- Security headers middleware on auth routes (CSP, X-Frame-Options, Referrer-Policy, HSTS in prod)

#### Still required

None for Workstream A — proceed to Workstream B (logout/revoke).

### 4) Workstream B — complete logout and token revocation ✅

#### Done (Milestone 2)
- `POST /oauth/revoke` — RFC 7009; revokes full refresh-token family ([revoke.go](backend-core/internal/protocols/token/revoke.go))
- `GET /oauth/logout` — clears login session cookie; optional `refresh_token` revoke + `post_logout_redirect_uri` ([logout.go](backend-core/internal/protocols/token/logout.go))
- BFF `POST /auth/logout` — calls core revoke then clears HttpOnly refresh cookie ([adapter-core/revoke.ts](packages/adapter-core/src/revoke.ts))
- OIDC discovery exposes `revocation_endpoint` and `end_session_endpoint`
- Tests in [revoke_test.go](backend-core/internal/protocols/token/revoke_test.go)

#### Usage

```bash
# Revoke refresh token (RFC 7009 — always 200 when client is valid)
curl -X POST http://localhost:8080/oauth/revoke \
  -H "X-Tenant-ID: ..." \
  -d "token=REFRESH_TOKEN&token_type_hint=refresh_token&client_id=semaauth_example_spa"

# Browser logout with redirect
curl "http://localhost:8080/oauth/logout?client_id=...&post_logout_redirect_uri=http://localhost:5174/&refresh_token=..."
```

### 5) Workstream C — token introspection and validation policy ✅

#### Done (Milestone 3)
- `POST /oauth/introspect` — RFC 7662 for access JWTs and refresh tokens ([introspect.go](backend-core/internal/protocols/token/introspect.go))
- Shared claim validation — `ParseAndValidateAccessToken` / `ValidateAccessClaims` ([access_token.go](backend-core/internal/crypto/access_token.go))
- UserInfo and adapters use strict `iss`, `aud`, `sub`, `tid`, `jti`, `exp`, `iat`, `nbf` checks
- `@semaauth/jwt-verify` validates `aud` and `iat` explicitly
- OIDC discovery exposes `introspection_endpoint`

#### Example

```bash
curl -X POST http://localhost:8080/oauth/introspect \
  -H "X-Tenant-ID: ..." \
  -d "token=ACCESS_OR_REFRESH_TOKEN&client_id=semaauth_example_spa&token_type_hint=access_token"
```

### 6) Workstream D — admin and tenant management surface

#### Required outcome
The platform must expose a usable management API for users, sessions, and tenant-level controls.

#### Files to change
- [backend-core/internal/services/](backend-core/internal/services/)
- [backend-core/internal/store/postgres/](backend-core/internal/store/postgres/)
- [backend-core/internal/protocols/](backend-core/internal/protocols/)
- [backend-core/internal/server/server.go](backend-core/internal/server/server.go)

#### Required actions
1. Add authenticated admin endpoints for:
   - listing users;
   - viewing user status and MFA state;
   - revoking a user’s active sessions;
   - updating tenant-level settings.
2. Add a tenant-scoped audit record model for:
   - login attempts;
   - token refresh events;
   - revoke/logout events;
   - MFA completion/failure events.
3. Ensure all admin endpoints are tenant-scoped and require the correct authorization policy.

#### Acceptance criteria
- admin operations are scoped to the correct tenant;
- session revocation affects the intended user without disturbing unrelated tenants;
- audit events contain enough metadata to explain what happened and when.

#### Validation tests
- tenancy isolation tests for admin endpoints;
- permission tests for unauthorized access;
- audit log verification tests.

### 7) Workstream E — observability, auditability, and release gates

#### Required outcome
The platform must provide enough operational evidence to run safely in production.

#### Files to change
- [backend-core/internal/server/server.go](backend-core/internal/server/server.go)
- [backend-core/internal/protocols/](backend-core/internal/protocols/)
- [.github/workflows/](.github/workflows/)

#### Required actions
1. Add structured logs for:
   - auth code issuance;
   - token exchange success/failure;
   - revoke/logout events;
   - MFA challenge success/failure.
2. Add metrics for:
   - login attempts;
   - token refresh count;
   - revoke/logout events;
   - MFA failure rate.
3. Add CI checks for:
   - `go test`;
   - `go vet`;
   - secret scanning;
   - dependency vulnerability checks;
   - config-lint checks for missing production variables.

#### Acceptance criteria
- all high-risk auth events are observable;
- CI blocks releases with failing auth tests or exposed secrets;
- logs contain enough context to investigate incidents without extra manual tracing.

### 8) Definition of done

The gap is closed only when all of the following are true:

- all required endpoints are implemented and documented;
- all security controls are covered by automated tests;
- production config validation blocks unsafe starts;
- logout and revoke flows are verified end-to-end;
- admin and audit APIs are available for operational use;
- every milestone above has been completed and verified in CI.

### 9) Required milestone sequence

The following sequence is mandatory and must be completed in order:

1. **Milestone 1 — config hardening + security headers** ✅
   - production-only validation checks;
   - enforce secure cookie settings;
   - add auth response headers;
   - production CORS allowlist.

2. **Milestone 2 — logout + revoke + cookie cleanup** ✅
   - implement revoke and logout flows;
   - ensure session and refresh-token cleanup;
   - BFF logout calls core revoke.

3. **Milestone 3 — introspection + token validation policy** ✅
   - add token introspection;
   - validate issuer/audience/expiry claims centrally;
   - reject revoked or expired refresh tokens via introspection.

4. **Milestone 4 — audit/admin APIs**
   - add tenant-scoped admin APIs;
   - persist audit events for security-sensitive actions;
   - enforce authorization on every admin route.

5. **Milestone 5 — CI gates + release verification**
   - require automated tests and secret scanning before release;
   - block production-ready merges when auth checks fail;
   - verify deployment configuration in CI.

