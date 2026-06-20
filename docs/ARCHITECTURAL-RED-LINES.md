# Architectural Red Lines ("The No-No's")

Non-negotiable constraints for semaAUTH. Violating any of these introduces account takeover, token theft, or cross-tenant data leaks.

Full context: [SPECIFICATION.md](./SPECIFICATION.md)

---

## ❌ NO Frontend Client Secrets

**Rule:** Client secrets must never exist in React, Expo, Flutter, or React Native.

**Why:** Anything shipped to a browser or app binary can be extracted. A embedded secret is not secret.

**Do instead:**

| Client | Flow | Secret |
| --- | --- | --- |
| Web SPA (Vite/React) | Authorization Code + PKCE (S256) | None |
| Mobile (Expo/RN/Flutter) | Authorization Code + PKCE (S256) | None |
| Server (NestJS/Express BFF) | May hold refresh cookie + proxy token exchange | Server env only |

**semaAUTH enforcement:** `SemaAuthClientConfig` has no `clientSecret` field. `assertPublicClientConfig()` throws if a secret is detected.

---

## ❌ NO Browser LocalStorage for Tokens

**Rule:** Never store access or ID tokens in `localStorage` or `sessionStorage`.

**Why:** Any XSS vulnerability lets an attacker read persisted tokens and impersonate users until expiry.

**Do instead:**

| Token | Web storage |
| --- | --- |
| Access token | React state / in-memory context (`@semaauth/sdk-web`) |
| ID token | Same as access token |
| Refresh token | `HttpOnly; Secure; SameSite=Lax` cookie set by backend adapter |

Silent refresh: browser calls same-origin BFF → adapter reads cookie → POST `/oauth/token`.

After login, the SPA calls `POST /auth/session` once to move the refresh token from the token response into the HttpOnly cookie (refresh token must not remain in JS memory).

---

## ❌ NO Mobile WebViews

**Rule:** Never use embedded WebViews (`WKWebView`, `WebView`) for login.

**Why:** The host app can intercept credentials, cookies, and redirect URLs inside a WebView.

**Do instead:**

| Platform | Library |
| --- | --- |
| Expo | `expo-auth-session` |
| React Native | `react-native-inappbrowser-reborn` |
| Flutter | `flutter_web_auth_2` |

Tokens after login: Keychain / Keystore via `expo-secure-store`, `react-native-keychain`, or `flutter_secure_storage`.

---

## ❌ NO Database Hits for Token Verification

**Rule:** Do not query PostgreSQL to validate access tokens on routine API requests.

**Why:** Adds latency, cost, and a single point of failure at scale. JWTs exist precisely to enable local verification.

**Do instead:**

1. Fetch JWKS from `https://<issuer>/.well-known/jwks.json` (cache ~24h).
2. Verify signature, `exp`, `iss`, `aud`, and `tid` in adapter middleware memory.
3. Attach `AdapterAuthContext` to the request — no DB round trip.

Database is used for: login, refresh token rotation/revocation, MFA, user management — not per-request access-token checks.

---

## ❌ NO Code-Only Tenant Splitting

**Rule:** Do not rely on application-level `WHERE tenant_id = ?` filters alone.

**Why:** One missed filter in any query leaks another tenant's data. Defense must be at the database engine.

**Do instead:**

```sql
BEGIN;
SET LOCAL semaauth.current_tenant_id = '<tenant-uuid>';
-- queries here; RLS policies enforce isolation automatically
COMMIT;
```

Every tenant table has RLS enabled. Adapters resolve tenant from subdomain, `X-Tenant-ID`, or path, then wrap all DB work in `ExecuteInTenantContext()`.

---

## Review checklist (PR gate)

- [ ] No `clientSecret` in client packages or public env vars
- [ ] No token persistence in `localStorage` / `sessionStorage`
- [ ] Mobile auth uses system browser APIs only
- [ ] JWT guards use JWKS, not DB lookups
- [ ] All tenant DB access uses RLS transaction wrapper
