# DexaHub Frontend

Next.js 16 frontend for the DexaHub HR & attendance platform.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** components
- **Sonner** for toasts, **next-themes** for dark/light mode
- Auth tokens in `localStorage` with automatic silent refresh on 401

## Prerequisites

The `dexahub-api` backend must be fully running before starting the frontend. See [dexahub-api/README.md](../dexahub-api/README.md) for setup instructions.

Quick recap — from `dexahub-api/`:

```bash
docker compose up mysql -d
nest start auth-service --watch
nest start user-service --watch
nest start attendance-service --watch
nest start api-gateway --watch
npm run seed
```

## Quick Start

```bash
cd dexahub-frontend
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3004](http://localhost:3004).

## Test Accounts

| Role | Email | Password |
|---|---|---|
| HRD Admin | `admin@dexahub.com` | `Test@123!` |
| Employee | `employee.one@dexahub.com` | `Test@123!` |

- **Employees** land on `/check-in` — daily photo check-in and their own attendance history.
- **HRD Admins** land on `/admin/employees` — employee management and full attendance logs.

## Environment Variables

Copy `.env.example` to `.env.local` and adjust if needed:

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Backend REST gateway base URL | `http://localhost:3000/api/v1` |
| `NEXT_PUBLIC_UPLOADS_BASE_URL` | Where check-in photos are served | `http://localhost:3000` |

## Scripts

```bash
npm run dev      # dev server on :3004 (Turbopack)
npm run build    # production build
npm run lint     # ESLint
```

## Project Structure

```
src/
  app/
    layout.tsx                  # root layout (AuthProvider + ThemeProvider)
    page.tsx                    # auth-aware redirect → /login or /check-in
    login/page.tsx
    (employee)/
      check-in/page.tsx         # employee daily check-in + own history
    admin/
      layout.tsx                # admin shell with sidebar
      employees/page.tsx        # HRD: employee CRUD
      attendance/page.tsx       # HRD: attendance log with filters
  components/
    auth/
      LoginForm.tsx
      ProtectedRoute.tsx        # redirects unauthenticated → /login
    admin/
      AdminRoute.tsx            # redirects non-HRD_ADMIN → /check-in
      AdminSidebar.tsx
      attendance/               # AttendanceFilters, AttendanceTable
      employees/                # EmployeeModal, EmployeesTable
    attendance/
      CameraCapture.tsx         # webcam → File
      CheckInCard.tsx
      AttendanceHistory.tsx
    ui/                         # shadcn/ui primitives
  hooks/
    useAuth.tsx                 # AuthProvider + useAuth hook
  lib/
    api.ts                      # all API calls + silent refresh logic
    auth-storage.ts             # localStorage token helpers
    jwt.ts                      # client-side JWT decode (no verification)
    attendance.ts               # photo URL + date formatting helpers
    utils.ts                    # cn() Tailwind helper
  types/
    api.ts                      # types mirrored from the backend
```

## Auth Flow

1. `useAuth()` reads the access token from `localStorage` via `useSyncExternalStore` — no effects, re-renders instantly on token change.
2. `apiFetch` in `lib/api.ts` attaches the Bearer token to every request. On a 401 it transparently calls `/auth/refresh` once (concurrent requests share the same in-flight promise) and retries.
3. If refresh fails, tokens are cleared and the user is redirected to `/login`.
4. `ProtectedRoute` and `AdminRoute` guard pages at the component level — no middleware needed.

## Adding shadcn/ui Components

```bash
npx shadcn add <component-name>
```

Components are generated into `src/components/ui/`.

## Notes

- Tailwind v4 config lives in `postcss.config.mjs` and `src/app/globals.css` — there is no `tailwind.config.js`.
- All API calls go through `lib/api.ts`. Never call `fetch` directly from components.
- Shared backend types live in `src/types/api.ts` and are kept in sync with the API manually.
