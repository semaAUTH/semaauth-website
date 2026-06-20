# semaAUTH Library: Production-Grade Architectural Specification

This document is the **single source of truth** for building **semaAUTH** (formerly semaPass): a cost-effective, enterprise-ready, multi-tenant authentication platform. It defines architecture, database structures, OAuth/OIDC flows, client/backend matrices, cryptographic rules, social provider integration, API payloads, and monorepo layout.

**Target ecosystem**

| Layer | Technologies |
| --- | --- |
| Backend adapters | NestJS, Express |
| Web clients | React, Vite, TanStack Query |
| Mobile clients | React Native, Expo, Flutter |
| Core engine | Go (Clean Architecture) |
| Database | PostgreSQL 15+ with Row-Level Security |
| Cache / sessions | Redis is required for high-scale cache deployments; refresh tokens remain in PostgreSQL at launch. |

---

## 1. System Topology & Architectural Constraints

```
                            [ Client Layer ]
    +--------------------------------------------------------------+
    |  Web: React + Vite + TanStack Query                          |
    |  Mobile: React Native / Expo / Flutter                       |
    +--------------------------------------------------------------+
           |                                             |
           | (OIDC / OAuth 2.1 via PKCE)                 | (Public Verification)
           v                                             v
+-------------------------+                     +------------------+
| Backend Service Layer   |                     | Edge Cache Layer |
| - NestJS Adapter        |                     | (Cloudflare)     |
| - Express Adapter       |                     +------------------+
+-------------------------+                              |
           |                                             |
           +----------------------+                      | (Static JWKS)
                                  v                      v
                       +-----------------------------------+
                       |        PostgreSQL Database        |
                       | - Shared Schema, Tenant Isolation|
                       | - Row-Level Security (RLS)        |
                       +-----------------------------------+
                                  |
                                  v
                       +-----------------------------------+
                       |     semaAUTH Core Engine (Go)     |
                       | OAuth2.1 / OIDC / Social / MFA    |
                       +-----------------------------------+
```

### Architectural Red Lines ("The No-No's")

| Rule | Requirement |
| --- | --- |
| ❌ NO frontend client secrets | React, Expo, Flutter, and React Native must use **Authorization Code + PKCE** only. |
| ❌ NO browser localStorage for tokens | Access and ID tokens must never be stored in `localStorage` or `sessionStorage`. |
| ❌ NO mobile WebViews for auth | Use ASWebAuthenticationSession (iOS), Custom Tabs (Android), or equivalent OS browser sheets. |
| ❌ NO DB hits for access-token verification | Validate JWT signatures in memory using cached JWKS. |
| ❌ NO code-only tenant isolation | Enforce tenant boundaries with PostgreSQL RLS, not app-level filters alone. |
| ❌ NO RS256 for semaAUTH-issued tokens | Prefer **Ed25519 (EdDSA)** or **ES256** for issued access/ID tokens. |
| ❌ NO automatic social account linking by email | Require explicit password confirmation before linking social IdPs to native accounts. |

---

## 2. Monorepo Directory Structure

```
semaauth/
├── docs/
│   └── SPECIFICATION.md          # This document
├── .github/workflows/
│   └── ci.yml
├── backend-core/                 # Go authentication engine
│   ├── cmd/server/
│   ├── internal/
│   │   ├── crypto/               # Ed25519 signing, Argon2id hashing
│   │   ├── database/             # Pool, RLS context manager
│   │   ├── models/               # Tenant, User, Token domain types
│   │   ├── protocols/
│   │   │   ├── authorize/        # PKCE, consent, social redirect
│   │   │   └── token/            # Code exchange, refresh rotation
│   │   ├── services/
│   │   │   ├── mfa/              # TOTP + SMS port
│   │   │   └── social/           # Google, Apple, Microsoft, GitHub
│   │   └── config/
│   └── migrations/
├── adapters/
│   ├── express/                  # @semaauth/adapter-express
│   └── nestjs/                     # @semaauth/adapter-nestjs
├── sdk-web/                        # @semaauth/sdk-web
├── sdk-mobile/                     # @semaauth/sdk-mobile
├── demo/                           # Thin integration demos (Express, NestJS, Vite SPA)
├── edge/jwks-worker/               # Cloudflare JWKS cache for edge deployments (not required for core runtime)
└── packages/
    ├── shared-types/               # @semaauth/shared-types
    ├── jwt-verify/                 # @semaauth/jwt-verify
    └── adapter-core/               # @semaauth/adapter-core (shared BFF logic)
```

See also [docs/ARCHITECTURE.md](./ARCHITECTURE.md) for naming rules and dependency direction.

---

## 3. Multi-Tenant Database Schema (PostgreSQL)

Single database, shared schema. Tenant context is bound per transaction via `SET LOCAL`.

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tenants
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    issuer_domain VARCHAR(255) NOT NULL UNIQUE,
    settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. OAuth clients (per tenant)
CREATE TABLE oauth_clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    client_id VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    client_type VARCHAR(16) NOT NULL CHECK (client_type IN ('public', 'confidential')),
    redirect_uris TEXT[] NOT NULL,
    allowed_scopes TEXT[] NOT NULL DEFAULT ARRAY['openid', 'profile', 'email'],
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),  -- NULL for social-only users
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    display_name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tenant_id, email)
);

-- 4. Social identities
CREATE TABLE user_social_identities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_name VARCHAR(50) NOT NULL CHECK (provider_name IN ('google', 'apple', 'microsoft', 'github')),
    provider_user_id VARCHAR(255) NOT NULL,
    profile_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tenant_id, provider_name, provider_user_id)
);

-- 5. MFA
CREATE TABLE user_mfa (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    totp_secret VARCHAR(128),
    totp_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    phone_number VARCHAR(32),
    phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    sms_enabled BOOLEAN NOT NULL DEFAULT FALSE
);

-- 6. Authorization codes (PKCE-bound, short-lived)
CREATE TABLE authorization_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES oauth_clients(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    code_hash VARCHAR(64) NOT NULL UNIQUE,
    redirect_uri TEXT NOT NULL,
    scope TEXT NOT NULL,
    code_challenge VARCHAR(128) NOT NULL,
    code_challenge_method VARCHAR(8) NOT NULL DEFAULT 'S256',
    state VARCHAR(128) NOT NULL,
    nonce VARCHAR(128),
    provider_name VARCHAR(50),
    expires_at TIMESTAMPTZ NOT NULL,
    consumed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Refresh tokens (opaque, rotatable, revocable)
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES oauth_clients(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    family_id UUID NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Signing keys (JWKS source)
CREATE TABLE signing_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    kid VARCHAR(64) NOT NULL,
    algorithm VARCHAR(16) NOT NULL DEFAULT 'EdDSA',
    public_key_jwk JSONB NOT NULL,
    private_key_encrypted BYTEA NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tenant_id, kid)
);

CREATE INDEX idx_users_tenant_email ON users(tenant_id, email);
CREATE INDEX idx_social_lookup ON user_social_identities(tenant_id, provider_name, provider_user_id);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);
CREATE INDEX idx_auth_codes_hash ON authorization_codes(code_hash);

-- Row-Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_social_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mfa ENABLE ROW LEVEL SECURITY;
ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE authorization_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE signing_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_users_isolation ON users
    USING (tenant_id = current_setting('semaauth.current_tenant_id', true)::UUID);

CREATE POLICY tenant_social_isolation ON user_social_identities
    USING (tenant_id = current_setting('semaauth.current_tenant_id', true)::UUID);

CREATE POLICY tenant_mfa_isolation ON user_mfa
    USING (tenant_id = current_setting('semaauth.current_tenant_id', true)::UUID);

CREATE POLICY tenant_tokens_isolation ON refresh_tokens
    USING (tenant_id = current_setting('semaauth.current_tenant_id', true)::UUID);

CREATE POLICY tenant_auth_codes_isolation ON authorization_codes
    USING (tenant_id = current_setting('semaauth.current_tenant_id', true)::UUID);

CREATE POLICY tenant_clients_isolation ON oauth_clients
    USING (tenant_id = current_setting('semaauth.current_tenant_id', true)::UUID);

CREATE POLICY tenant_keys_isolation ON signing_keys
    USING (tenant_id = current_setting('semaauth.current_tenant_id', true)::UUID);
```

### Tenant context execution pattern

Every database mutation runs inside a transaction:

1. `BEGIN`
2. `SET LOCAL semaauth.current_tenant_id = '<tenant-uuid>'`
3. Execute queries (RLS applies automatically)
4. `COMMIT`

Tenant resolution order (first match wins):

1. Subdomain: `{tenant-slug}.auth.example.com`
2. Header: `X-Tenant-ID: <uuid>`
3. Path: `/t/{tenantId}/...` (admin APIs only)

---

## 4. Cryptography & Token Engine

### Password hashing

| Parameter | Value |
| --- | --- |
| Algorithm | Argon2id |
| Time cost | 3 |
| Memory | 65536 KiB (64 MB) |
| Parallelism | 4 |
| Salt | 16 bytes random per password |
| Stored format | PHC string: `$argon2id$v=19$m=65536,t=3,p=4$...` |

### Issued tokens

| Token | Format | TTL | Storage |
| --- | --- | --- | --- |
| Access Token | JWT (EdDSA / Ed25519) | 15 minutes | In-memory (web) / secure hardware (mobile) |
| ID Token | JWT (EdDSA / Ed25519) | 15 minutes | Same as access token |
| Refresh Token | Opaque random (256-bit) | 30 days | HttpOnly cookie (web) / Keychain (mobile) |
| Authorization Code | Opaque random (256-bit) | 5 minutes | Server only (hashed in DB) |

### Refresh token rotation

On every `/oauth/token` refresh grant:

1. Validate presented refresh token hash.
2. Issue new access + ID + refresh tokens.
3. Revoke the consumed refresh token.
4. If a revoked token is reused, revoke entire `family_id` (reuse detection).

### JWKS edge deployment

Publish at: `https://<auth-domain>/.well-known/jwks.json`

```json
{
  "keys": [
    {
      "kty": "OKP",
      "crv": "Ed25519",
      "kid": "semaauth_key_v1",
      "use": "sig",
      "alg": "EdDSA",
      "x": "<base64url-public-key>"
    }
  ]
}
```

Also expose OIDC discovery at `/.well-known/openid-configuration`.

Cache JWKS client-side for **24 hours**; refresh on `kid` mismatch.

---

## 5. OAuth 2.1 / OIDC State Machine

### Supported flows

| Flow | Clients | Client secret |
| --- | --- | --- |
| Authorization Code + PKCE (S256) | Web SPA, mobile, server-rendered web | Never on public clients |
| Refresh Token | All | N/A (opaque token + rotation) |

**Not supported at launch:** Implicit flow, Resource Owner Password Credentials, client credentials for user auth.

### State machine (authorization)

```
IDLE
  │  client builds PKCE + state + nonce
  ▼
AUTHORIZE_REQUESTED
  │  GET /oauth/authorize (valid params)
  ▼
[ provider param present? ]
  ├─ yes → SOCIAL_REDIRECT → SOCIAL_CALLBACK → USER_RESOLVED
  └─ no  → LOGIN_PRESENTED → CREDENTIALS_VALIDATED
                              │
                              ▼
                         [ MFA required? ]
                              ├─ yes → MFA_CHALLENGE → MFA_VALIDATED
                              └─ no  ─────────────────────────────┐
                                                                    ▼
                                                         CONSENT_PRESENTED (if required)
                                                                    │
                                                                    ▼
                                                         CODE_ISSUED → redirect to client
                                                                    │
                                                                    ▼
                                                         TOKEN_EXCHANGED (POST /oauth/token)
                                                                    │
                                                                    ▼
                                                              AUTHENTICATED
```

### State machine (token refresh — web)

```
AUTHENTICATED
  │  access token near expiry (T-60s)
  ▼
REFRESH_PENDING
  │  POST /oauth/token (grant_type=refresh_token, cookie)
  ├─ success → AUTHENTICATED (new in-memory access token)
  └─ failure → SESSION_EXPIRED → redirect to /oauth/authorize
```

### PKCE generation rules (client)

| Field | Rule |
| --- | --- |
| `code_verifier` | 43–128 chars from `[A-Z a-z 0-9 - . _ ~]` |
| `code_challenge` | `BASE64URL(SHA256(code_verifier))` |
| `code_challenge_method` | Must be `S256` (`plain` forbidden) |

---

## 6. URL Endpoints & Query Parameters

### Core OAuth endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/oauth/authorize` | Start auth / social login |
| POST | `/oauth/token` | Exchange code or refresh tokens |
| GET | `/oauth/userinfo` | OIDC userinfo (Bearer access token) |
| POST | `/oauth/revoke` | Revoke refresh token |
| POST | `/oauth/introspect` | Token introspection (RFC 7662) |
| GET | `/oauth/logout` | End session (web) |
| GET | `/.well-known/openid-configuration` | OIDC metadata |
| GET | `/.well-known/jwks.json` | Public signing keys |

### Social callback endpoints

| Method | Path |
| --- | --- |
| GET | `/oauth/callback/google` |
| GET | `/oauth/callback/apple` (also POST for form_post mode) |
| GET | `/oauth/callback/microsoft` |
| GET | `/oauth/callback/github` |

### Account linking

| Method | Path |
| --- | --- |
| GET | `/auth/link-account` |
| POST | `/auth/link-account/confirm` |

---

### 6.1 Authorization request — `/oauth/authorize`

**Required query parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `response_type` | string | Must be `code` |
| `client_id` | string | Registered OAuth client ID |
| `redirect_uri` | string | Must exactly match a registered URI |
| `scope` | string | Space-delimited; must include `openid` for OIDC |
| `state` | string | CSRF token; min 32 bytes entropy; echoed on redirect |
| `code_challenge` | string | PKCE challenge (base64url) |
| `code_challenge_method` | string | Must be `S256` |

**Additional query parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| `nonce` | string | OIDC nonce; included in ID token |
| `provider` | string | `google` \| `apple` \| `microsoft` \| `github` |
| `prompt` | string | `login` \| `consent` \| `none` |
| `login_hint` | string | Pre-fill email |
| `ui_locales` | string | e.g. `en-AU en` |

**Example — web PKCE start**

```
GET https://auth.example.com/oauth/authorize
  ?response_type=code
  &client_id=semaauth_client_abc123
  &redirect_uri=https%3A%2F%2Fapp.example.com%2Fauth%2Fcallback
  &scope=openid%20profile%20email
  &state=8f3c2a1b9e7d4f6c0a5b8e2d1c9f7a4b
  &nonce=n_6k2m9p1q4r7s0t3v6w9x2y5z8
  &code_challenge=E9Melhoa2OwvFrGMTJguCH5K7v_6w9OmS4B695V0
  &code_challenge_method=S256
```

**Example — social login**

```
GET https://auth.example.com/oauth/authorize
  ?response_type=code
  &client_id=semaauth_client_abc123
  &redirect_uri=com.myapp.auth%3A%2F%2Fcallback
  &scope=openid%20profile%20email
  &state=8f3c2a1b9e7d4f6c0a5b8e2d1c9f7a4b
  &code_challenge=E9Melhoa2OwvFrGMTJguCH5K7v_6w9OmS4B695V0
  &code_challenge_method=S256
  &provider=google
```

**Success redirect to client**

```
{redirect_uri}?code={authorization_code}&state={state}
```

**Error redirect to client**

```
{redirect_uri}?error={error_code}&error_description={desc}&state={state}
```

| `error` value | When |
| --- | --- |
| `invalid_request` | Missing/invalid parameter |
| `unauthorized_client` | Client not allowed for this flow |
| `access_denied` | User cancelled |
| `invalid_scope` | Unknown scope requested |
| `server_error` | Internal failure |
| `social_provider_mismatch` | Email linked to different provider |
| `account_link_required` | Native account exists; linking needed |

---

### 6.2 Token exchange — `POST /oauth/token`

**Content-Type:** `application/x-www-form-urlencoded`

**Authorization code grant**

| Field | Required | Description |
| --- | --- | --- |
| `grant_type` | yes | `authorization_code` |
| `client_id` | yes | Public client ID |
| `code` | yes | Authorization code from redirect |
| `redirect_uri` | yes | Must match authorize request |
| `code_verifier` | yes | Original PKCE verifier |

**Refresh token grant (web: refresh token in HttpOnly cookie; mobile: in body)**

| Field | Required | Description |
| --- | --- | --- |
| `grant_type` | yes | `refresh_token` |
| `client_id` | yes | Client ID |
| `refresh_token` | mobile only | Omitted on web (cookie carries it) |

---

### 6.3 Mobile ↔ browser redirect handshake

Mobile apps use **custom URI schemes** or **HTTPS app links** as `redirect_uri`.

| Platform | Redirect URI pattern | Browser API |
| --- | --- | --- |
| iOS (Expo) | `com.myapp.auth://callback` | `expo-auth-session` / `AuthSession.startAsync` |
| iOS (RN) | `com.myapp.auth://callback` | `react-native-inappbrowser-reborn` |
| Android | `com.myapp.auth://callback` | Custom Tabs via same libraries |
| Flutter | `com.myapp.auth://callback` | `flutter_web_auth_2` |

**Mobile authorize URL** — same as web; opened in system browser, not WebView.

**Callback capture**

1. OS returns control to the app via deep link:
   `com.myapp.auth://callback?code=...&state=...`
2. SDK validates `state` matches session-stored value.
3. SDK POSTs to `/oauth/token` with `code_verifier` (never sent in browser URL).

**Mobile-specific validation**

| Check | Rule |
| --- | --- |
| `state` | Constant-time compare with value stored in secure storage before browser open |
| `redirect_uri` | Must match registered mobile redirect exactly |
| `code` | Single use; exchange within 5 minutes |
| WebView detection | Reject if User-Agent indicates embedded WebView |

**Expo / React Native redirect registration**

```
# app.json (Expo)
{ "expo": { "scheme": "com.myapp.auth" } }

# iOS Info.plist
CFBundleURLSchemes: ["com.myapp.auth"]

# Android intent filter
<data android:scheme="com.myapp.auth" android:host="callback" />
```

---

### 6.4 Web silent refresh (BFF pattern)

Web apps must **not** keep refresh tokens in the browser JS runtime.

```
Browser (React, in-memory access token)
    │  POST /auth/session  (after login — stash refresh token in HttpOnly cookie)
    │  POST /auth/refresh  (same-origin, credentials: include)
    │  POST /auth/logout   (clear HttpOnly cookie on sign-out)
    ▼
Express/NestJS adapter (reads/writes HttpOnly cookie)
    │  POST https://auth.example.com/oauth/token
    ▼
semaAUTH core → new access token returned to adapter → returned to client memory
```

Mount adapter routes at `app.use('/auth', …)` so paths are `/auth/session`, `/auth/refresh`, `/auth/logout`.

Cookie attributes for refresh token:

```
Set-Cookie: semaauth_refresh=<opaque>;
  HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000
```

For cross-subdomain apps: `Domain=.example.com` only when all apps share trust boundary.

---

## 7. JSON Payload Definitions

### 7.1 Token response — `POST /oauth/token` (success)

```json
{
  "access_token": "eyJhbGciOiJFZERTQSIsImtpZCI6InNlbWFhdXRoX2tleV92MSIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 900,
  "refresh_token": "rt_opaque_only_on_mobile_response",
  "id_token": "eyJhbGciOiJFZERTQSIs...",
  "scope": "openid profile email"
}
```

**Web adapter note:** Omit `refresh_token` from JSON body; set HttpOnly cookie instead.

### 7.2 Token error response

```json
{
  "error": "invalid_grant",
  "error_description": "Authorization code has expired or was already used."
}
```

| `error` | HTTP status |
| --- | --- |
| `invalid_request` | 400 |
| `invalid_client` | 401 |
| `invalid_grant` | 400 |
| `unauthorized_client` | 403 |
| `unsupported_grant_type` | 400 |

### 7.3 Access token JWT claims

```json
{
  "iss": "https://auth.example.com",
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "aud": "semaauth_client_abc123",
  "exp": 1710000000,
  "iat": 1709999100,
  "nbf": 1709999100,
  "jti": "at_01HY...",
  "tid": "tenant-uuid",
  "scope": "openid profile email",
  "client_id": "semaauth_client_abc123"
}
```

### 7.4 ID token JWT claims

```json
{
  "iss": "https://auth.example.com",
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "aud": "semaauth_client_abc123",
  "exp": 1710000000,
  "iat": 1709999100,
  "nonce": "n_6k2m9p1q4r7s0t3v6w9x2y5z8",
  "email": "user@example.com",
  "email_verified": true,
  "name": "Jane Doe",
  "picture": "https://cdn.example.com/avatars/jane.jpg"
}
```

### 7.5 OIDC UserInfo — `GET /oauth/userinfo`

**Response**

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "email_verified": true,
  "name": "Jane Doe",
  "picture": "https://cdn.example.com/avatars/jane.jpg",
  "tenant_id": "tenant-uuid"
}
```

### 7.6 MFA challenge response (login paused)

When MFA is required before token issuance:

```json
{
  "status": "MFA_REQUIRED",
  "mfa_token": "mfa_session_opaque_token",
  "methods": ["totp"],
  "expires_in": 300
}
```

**POST `/oauth/mfa/verify`**

Request:

```json
{
  "mfa_token": "mfa_session_opaque_token",
  "method": "totp",
  "code": "123456"
}
```

Success → same shape as token response (§7.1).

### 7.7 SDK session object (web — in React context memory)

```json
{
  "isAuthenticated": true,
  "accessToken": "eyJ...",
  "idToken": "eyJ...",
  "expiresAt": 1710000000,
  "user": {
    "sub": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "emailVerified": true,
    "name": "Jane Doe",
    "picture": "https://cdn.example.com/avatars/jane.jpg",
    "tenantId": "tenant-uuid"
  }
}
```

### 7.8 SDK session object (mobile — secure storage)

Persisted (Keychain / Keystore):

```json
{
  "accessToken": "eyJ...",
  "refreshToken": "rt_opaque...",
  "idToken": "eyJ...",
  "expiresAt": 1710000000,
  "state": null
}
```

In-memory only (React state / Riverpod):

```json
{
  "isAuthenticated": true,
  "user": {
    "sub": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "Jane Doe",
    "tenantId": "tenant-uuid"
  }
}
```

### 7.9 Normalized social profile (internal)

```json
{
  "provider_name": "google",
  "provider_user_id": "117...",
  "email": "user@gmail.com",
  "is_email_verified": true,
  "display_name": "Jane Doe",
  "avatar_url": "https://lh3.googleusercontent.com/..."
}
```

### 7.10 Account link required response

```json
{
  "status": "ACCOUNT_LINK_REQUIRED",
  "link_token": "link_session_opaque_token",
  "strategy": "google",
  "email": "user@example.com",
  "redirect_url": "/auth/link-account?strategy=google"
}
```

### 7.11 Adapter auth context (NestJS / Express — request extension)

```json
{
  "tenantId": "tenant-uuid",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "clientId": "semaauth_client_abc123",
  "scopes": ["openid", "profile", "email"],
  "tokenJti": "at_01HY..."
}
```

---

## 8. Backend Adapter Specifications

### Shared requirements (Express + NestJS)

| Concern | Implementation |
| --- | --- |
| Tenant resolution | Subdomain → header → path |
| RLS | `SET LOCAL semaauth.current_tenant_id` per transaction |
| JWT validation | Local JWKS verify; cache 24h |
| Refresh route | Server-side BFF for web; proxy to core `/oauth/token` |
| CORS | Allow client origins; `credentials: true` for cookie refresh |

### Express adapter (`@semaauth/adapter-express`)

| Export | Purpose |
| --- | --- |
| `createSemaAuthRouter(config)` | Mount OAuth proxy + refresh routes |
| `verifySemaAuthToken()` | Middleware: Bearer JWT → `req.semaauth` |
| `withTenantContext()` | Middleware: sets DB tenant session |

Config shape:

```json
{
  "issuerUrl": "https://auth.example.com",
  "tenantResolver": "header",
  "cookieName": "semaauth_refresh",
  "jwksCacheTtlSeconds": 86400
}
```

### NestJS adapter (`@semaauth/adapter-nestjs`)

| Export | Purpose |
| --- | --- |
| `SemaAuthModule.forRoot(config)` | Dynamic global module |
| `SemaAuthAuthGuard` | `@UseGuards()` JWT validation |
| `@AuthUser()` | Param decorator → user payload |
| `@CurrentTenant()` | Param decorator → tenant ID |
| `SemaAuthTenantInterceptor` | Sets RLS on DB pool per request |

---

## 9. Client SDK Specifications

### Web SDK (`@semaauth/sdk-web`)

| Concern | Library / pattern |
| --- | --- |
| Auth state | React Context + in-memory tokens |
| Data fetching | TanStack Query (`useSemaAuth`, `useUser`) |
| PKCE | Web Crypto API (`crypto.subtle.digest`) |
| Refresh | `POST /auth/refresh` (via `refreshUrl` on `SemaAuthProvider`) |
| Session cookie | `POST /auth/session` after login; `POST /auth/logout` on sign-out |
| Route guard | `<RequireAuth>` or `useRequireAuth()` |

**Required dependencies:** `@semaauth/shared-types`, `@tanstack/react-query`

**Forbidden:** `localStorage`, `sessionStorage` for tokens.

### Mobile SDK (`@semaauth/sdk-mobile`)

| Platform | Browser | Secure storage |
| --- | --- | --- |
| Expo | `expo-auth-session` | `expo-secure-store` |
| React Native | `react-native-inappbrowser-reborn` | `react-native-keychain` |
| Flutter | `flutter_web_auth_2` | `flutter_secure_storage` |

| Export | Purpose |
| --- | --- |
| `SemaAuthClient` | PKCE login, token exchange, refresh |
| `SecureTokenStore` | Platform abstraction |
| `createAuthInterceptor()` | Attach Bearer token to API calls |

---

## 10. Social Identity Provider Integration

### Provider matrix (canonical endpoints)

| Provider | Authorization | Token | JWKS / keys | Scopes | Unique ID |
| --- | --- | --- | --- | --- | --- |
| **Google** | `https://accounts.google.com/o/oauth2/v2/auth` | `https://oauth2.googleapis.com/token` | `https://www.googleapis.com/oauth2/v3/certs` | `openid email profile` | `sub` (ID token) |
| **Apple** | `https://appleid.apple.com/auth/authorize` | `https://appleid.apple.com/auth/token` | `https://appleid.apple.com/auth/keys` | `name email` | `sub` (ID token) |
| **Microsoft** | `https://login.microsoftonline.com/common/oauth2/v2.0/authorize` | `https://login.microsoftonline.com/common/oauth2/v2.0/token` | Via `https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration` | `openid email profile User.Read` | `sub` (ID token) |
| **GitHub** | `https://github.com/login/oauth/authorize` | `https://github.com/login/oauth/access_token` | N/A (OAuth 2.0 only) | `read:user user:email` | `id` (user API) |

### Per-provider verification rules

#### Google

1. Exchange code at token endpoint.
2. Verify `id_token` signature against Google JWKS.
3. Assert `iss` ∈ `https://accounts.google.com`, `https://accounts.google.com/`.
4. Assert `aud` equals tenant's Google client ID.
5. Require `email_verified === true` before trusting email.
6. Map `sub` → `provider_user_id`.

#### Apple

1. Generate **dynamic client secret**: JWT signed ES256 with `.p8` private key (Team ID, Key ID, Client ID claims); TTL ≤ 6 months (regenerate per request or cache ≤ 5 min).
2. Exchange code at Apple token endpoint with dynamic secret.
3. Verify `id_token` with Apple JWKS (RS256).
4. Assert `iss` = `https://appleid.apple.com`, `aud` = Apple Services ID.
5. **First-login only:** capture `user.name` from authorize POST body; persist immediately.

#### Microsoft Entra ID

1. Use `/common/` tenant for consumer + work/school accounts.
2. Verify `id_token` via OpenID discovery + JWKS.
3. Assert `aud` = tenant app registration client ID.
4. Map `sub` → `provider_user_id`, `name` → `display_name`.

#### GitHub

1. Exchange code for `access_token` (Accept: `application/json`).
2. `GET https://api.github.com/user` with Bearer token → `id`, `login`, `avatar_url`.
3. If `email` null: `GET https://api.github.com/user/emails` → find `primary: true` && `verified: true`.
4. Store stringified `id` as `provider_user_id`.

### Social login sequence

```
Client → GET /oauth/authorize?provider=google&...PKCE...
       → semaAUTH redirects to Google
       → Google → GET /oauth/callback/google?code=...&state=...
       → semaAUTH: exchange, verify, upsert user_social_identities
       → redirect client redirect_uri?code=<semaauth_code>&state=...
Client → POST /oauth/token (code + code_verifier)
       → tokens issued
```

### Account linking edge cases

| Scenario | Action |
| --- | --- |
| Social email matches native account (password set, no social link) | Return `ACCOUNT_LINK_REQUIRED`; user confirms password at `/auth/link-account` |
| Social email matches different provider link | Redirect `?error=social_provider_mismatch&provider=google` |
| Same provider + same `provider_user_id` | Normal login |
| New user | Create `users` row (no password) + `user_social_identities` row |

**Never** auto-link on email alone.

---

## 11. MFA Architecture

### Launch (zero SMS cost)

| Method | Status |
| --- | --- |
| TOTP (RFC 6238) | **Enabled at launch** |
| WebAuthn / Passkeys | **Enabled at launch** |
| SMS OTP | **Out of launch scope** — requires a real SMS gateway and is not enabled by the current runtime |

### TOTP enrollment

1. Generate base32 secret; store encrypted in `user_mfa.totp_secret`.
2. Return `otpauth://` URI for QR rendering.
3. User submits 6-digit code → set `totp_enabled = true`.

### SMS port (out of launch scope)

Interface: `SmsGatewayInterface.sendVerificationMessage(tenantId, phone, code)`

| Implementation | When |
| --- | --- |
| `NullSmsProvider` | Launch — log only, no network |
| `TwilioSmsProvider` | Production SMS |
| `AwsSnsSmsProvider` | Alternative production |

Schema hooks already present: `phone_number`, `phone_verified`, `sms_enabled`.

---

## 12. Infrastructure (Cost-Optimized)

| Component | Choice | Rationale |
| --- | --- | --- |
| JWKS / OIDC metadata | Cloudflare Workers or CDN | Free tier; zero core load |
| Core engine | Cloud Run / ECS Fargate / Railway | Scale to zero |
| Database | Neon / Supabase / RDS PostgreSQL | Managed, RLS support |
| Email (magic links, verify) | Resend / Postmark | Free tier |
| SMS | Not launch scope | TOTP + passkeys are the required first-line MFA options for launch |

### Environment variables (server-only)

| Variable | Description |
| --- | --- |
| `SEMAAUTH_DATABASE_URL` | PostgreSQL connection string |
| `SEMAAUTH_ISSUER_URL` | Public issuer URL |
| `SEMAAUTH_ENV` | `development` (default) or `production` — enforces strong keys + HTTPS issuer |
| `SEMAAUTH_SIGNING_KEY` | Ed25519 private key (required in production) |
| `SEMAAUTH_SESSION_KEY` | HMAC key for login session cookies (required in production) |
| `SEMAAUTH_ALLOWED_CORS_ORIGINS` | Comma-separated browser origins for credentialed CORS (required in production; https only) |
| `SEMAAUTH_PORT` | HTTP listen port (default `8080`) |
| `WEBAUTHN_RP_ID` / `WEBAUTHN_RP_NAME` / `WEBAUTHN_RP_ORIGINS` | Passkey relying party config |
| `SEMAAUTH_REDIS_URL` | Redis URL for cache/session scaling when required |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Per-tenant in DB preferred |
| `APPLE_TEAM_ID` / `APPLE_KEY_ID` / `APPLE_PRIVATE_KEY` | Apple dynamic secret |
| `MICROSOFT_CLIENT_ID` / `MICROSOFT_CLIENT_SECRET` | Entra app |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth app |

**Never** expose secrets with `VITE_`, `EXPO_PUBLIC_`, or `NEXT_PUBLIC_` prefixes.

---

## 13. Implementation Phases

| Phase | Deliverable | Status |
| --- | --- | --- |
| **1** | Go core: authorize + token + PKCE + JWKS | ✅ |
| **2** | PostgreSQL migrations + RLS tenant wrapper | ✅ |
| **3** | Express + NestJS adapters (JWT guard, refresh BFF) | ✅ |
| **4** | Web SDK (React + TanStack Query) | ✅ |
| **5** | Mobile SDK (Expo / RN / Flutter exports) | ✅ |
| **6** | Social login: Google, Microsoft, GitHub | ✅ |
| **7** | TOTP MFA | ✅ |
| **8** | OIDC discovery + passkeys + edge JWKS worker | ✅ |
| **9** | Demo apps + BFF session/logout routes | ✅ |
| **10** | Security hardening (refresh scope, prod config) | ✅ |

**Launch exclusions:** Apple Sign in and SMS OTP MFA remain out of scope until the required provider setup is complete.

---

## 14. Production Checklist

- [ ] All public clients use PKCE S256
- [ ] Refresh tokens rotate on every use
- [ ] Reused refresh token revokes full family
- [ ] RLS enabled on all tenant tables
- [ ] JWKS cached at edge
- [ ] Apple first-login name capture tested only when Apple Sign in is enabled; not required for launch
- [ ] GitHub primary verified email fallback tested
- [ ] Account linking requires password confirmation
- [ ] No tokens in localStorage
- [ ] Mobile auth uses system browser only
- [ ] Security headers: HSTS, CSP on login pages
- [ ] Rate limits on `/oauth/token` and login endpoints

---

*Document version: 1.0.0 — semaAUTH monorepo*
