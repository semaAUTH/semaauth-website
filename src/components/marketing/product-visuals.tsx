/** Static product UI illustrations for marketing product blocks */

export function AuthRuntimeVisual() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background shadow-lg">
      <div className="border-b border-border bg-muted/50 px-4 py-2.5">
        <p className="text-xs font-medium text-muted-foreground">OAuth 2.1 / OIDC — Token endpoint</p>
      </div>
      <pre className="overflow-x-auto bg-sidebar p-5 text-xs leading-relaxed text-sidebar-foreground">
        <code>{`POST /oauth/token HTTP/1.1
Host: auth.acme.semaauth.com
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=SplxlOBeZQQYbYS6WxSbIA
&redirect_uri=https://app.acme.io/callback
&client_id=app_7k2m9x
&code_verifier=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk`}</code>
      </pre>
      <div className="border-t border-border px-4 py-3">
        <p className="text-xs text-emerald-600 font-medium">200 OK — access_token issued (Ed25519 signed)</p>
      </div>
    </div>
  );
}

export function AdminConsoleVisual() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background shadow-lg">
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        {[
          { label: "Tenants", value: "12" },
          { label: "OAuth clients", value: "48" },
          { label: "Active sessions", value: "3,241" },
        ].map((s) => (
          <div key={s.label} className="px-4 py-4 text-center">
            <p className="text-2xl font-semibold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase">Security policies</p>
        {[
          { name: "MFA enforcement", status: "Required for admins" },
          { name: "Session rotation", status: "Enabled" },
          { name: "PKCE requirement", status: "All public clients" },
        ].map((p) => (
          <div
            key={p.name}
            className="mt-3 flex items-center justify-between rounded-lg border border-border px-3 py-2.5"
          >
            <span className="text-sm font-medium">{p.name}</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              {p.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DeveloperSdkVisual() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background shadow-lg">
      <div className="flex border-b border-border">
        {["React", "Express", "NestJS"].map((tab, i) => (
          <div
            key={tab}
            className={`px-4 py-2.5 text-xs font-medium ${
              i === 0 ? "border-b-2 border-primary text-foreground" : "text-muted-foreground"
            }`}
          >
            {tab}
          </div>
        ))}
      </div>
      <pre className="overflow-x-auto bg-sidebar p-5 text-xs leading-relaxed text-sidebar-foreground">
        <code>{`import { SemaAuthProvider, useAuth } from '@semaauth/sdk-web';

export function App() {
  return (
    <SemaAuthProvider
      issuer="https://auth.acme.semaauth.com"
      clientId="app_7k2m9x"
      redirectUri="/callback"
    >
      <Dashboard />
    </SemaAuthProvider>
  );
}`}</code>
      </pre>
    </div>
  );
}

export function CiamVisual() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background shadow-lg">
      <div className="bg-muted/40 px-6 py-8 text-center">
        <p className="text-xs font-medium text-muted-foreground">Sign in to Acme</p>
        <div className="mx-auto mt-6 max-w-xs space-y-3">
          <div className="rounded-md border border-border bg-background px-3 py-2.5 text-left text-sm text-muted-foreground">
            Email address
          </div>
          <div className="rounded-md bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground">
            Continue with email
          </div>
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <p className="relative bg-muted/40 px-2 text-xs text-muted-foreground">or</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {["Google", "GitHub"].map((p) => (
              <div
                key={p}
                className="rounded-md border border-border bg-background py-2 text-xs font-medium"
              >
                {p}
              </div>
            ))}
          </div>
          <div className="rounded-md border border-dashed border-primary/40 py-2 text-xs font-medium text-primary">
            Sign in with passkey
          </div>
        </div>
      </div>
    </div>
  );
}

export function IdentityFabricVisual() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background shadow-lg p-6">
      <p className="text-sm font-semibold">Identity security fabric</p>
      <div className="mt-6 space-y-4">
        {[
          { label: "End-to-end visibility", pct: 92 },
          { label: "Policy compliance", pct: 88 },
          { label: "Audit log coverage", pct: 100 },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium">{item.pct}%</span>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${item.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {["Token introspection", "Session revoke", "Audit export", "Risk alerts"].map((f) => (
          <div key={f} className="rounded-md border border-border px-3 py-2 text-xs font-medium">
            {f}
          </div>
        ))}
      </div>
    </div>
  );
}
