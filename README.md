# semaAUTH website

This app is the public marketing site and the organization-facing control plane for semaAUTH.

## Product scope

- **Public site** for product messaging, docs, pricing, and trust signals.
- **Organization section** for tenant admins to manage apps, users, billing, and security settings.
- **Brand system** centered on black and teal, with strong contrast and scalable UI primitives.

## Tech stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- TanStack Query for dashboard data fetching
- Zod + React Hook Form for runtime-safe form handling
- Framer Motion for motion polish
- next-themes for theme switching
- Radix primitives for accessible dialogs/dropdowns

## Route map

- `/` — marketing homepage
- `/pricing` — pricing and plans
- `/docs` — documentation landing page
- `/dashboard` — organization overview
- `/dashboard/apps` — application registry
- `/dashboard/users` — member management
- `/dashboard/settings` — security and tenant settings

## Developer workflow

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Quality gates

Before merging changes:

- `pnpm lint`
- `pnpm build`
