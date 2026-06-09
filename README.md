# DexaHub Frontend

Next.js (App Router) frontend for the DexaHub HR/attendance product. This first
slice covers **employee login** and the **daily photo check-in**.

The HRD admin UI is not built yet.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Auth tokens in `localStorage` with a fetch wrapper that auto-refreshes on 401

## Prerequisites

The [`dexahub-api`](../dexahub-api) gateway must be running on
`http://localhost:3000` with seeded employees:

```bash
cd ../dexahub-api
docker compose up mysql -d
nest start auth-service --watch        # :3001 (TCP)
nest start user-service --watch        # :3002 (TCP)
nest start attendance-service --watch  # :3003 (TCP)
nest start api-gateway --watch         # :3000 (HTTP, the entry point)
npm run seed                           # creates demo employees
```

## Run

```bash
npm install
cp .env.example .env.local   # already present in dev
npm run dev -- -p 3001       # 3000 is taken by the API gateway
```

Open <http://localhost:3001> and sign in with a seeded account, e.g.
`employee.one@dexahub.com` / `Test@123!`.

## Environment

| Variable                       | Purpose                                  |
| ------------------------------ | ---------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`     | REST gateway base, e.g. `…/api/v1`       |
| `NEXT_PUBLIC_UPLOADS_BASE_URL` | Where check-in photos are served from    |

## Structure

```
src/
  app/
    page.tsx                  # auth-aware redirect → /login or /check-in
    login/page.tsx
    (employee)/check-in/page.tsx
  components/
    auth/        LoginForm, ProtectedRoute
    attendance/  CameraCapture, CheckInCard, AttendanceHistory
    ui/          shadcn/ui primitives
  hooks/useAuth.tsx           # AuthProvider + useAuth (useSyncExternalStore)
  lib/
    api.ts                    # fetch wrapper, login/logout/checkIn helpers
    auth-storage.ts           # token persistence + change subscription
    jwt.ts                    # decode access-token claims (role/sub)
    attendance.ts             # photo URL + date/time formatting
  types/api.ts                # backend-mirrored types
```

## Scripts

```bash
npm run dev     # dev server (pass -p 3001 to avoid the API's port)
npm run build   # production build
npm run lint    # eslint
```
