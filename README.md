# Flight Management PWA

![Next.js](https://img.shields.io/badge/Next.js-13.4-blue?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-2ecc71?style=flat-square&logo=supabase)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3.4-blue?style=flat-square&logo=tailwindcss)
![Zustand](https://img.shields.io/badge/Zustand-state-yellow?style=flat-square)
![PWA](https://img.shields.io/badge/PWA-ready-007ACC?style=flat-square)
![Vercel](https://img.shields.io/badge/Vercel-deploy-black?style=flat-square&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)

Professional, production-ready Progressive Web App for realtime flight seat booking and management. Built with Next.js (App Router), TypeScript, Supabase (Postgres + Realtime), TailwindCSS, and Zustand for lightweight client state.

TL;DR: Realtime seat reservations with synchronization, offline PWA support, secure booking flows, and a modern responsive UX suitable for portfolio and internship evaluation.

## Project Overview

This application provides an airline-style booking experience: users can search flights, select seats on a realtime synchronized seat map, complete secure bookings, and manage/reschedule existing reservations. It demonstrates production-ready patterns for realtime collaboration, transactional seat-locking, and progressive web app features (offline-first, installable).

Why it matters: realtime seat management prevents double-booking and provides a smooth UX for concurrent users; the PWA layer preserves functionality on flaky networks, making the app robust for mobile-first users.

## Features

Core features grouped by category:

- Flight Search
  - Fast search with filters (origin, destination, date).
  - Server-side search via Supabase SQL functions to support pagination.

- Realtime Seat Selection
  - Live seat state propagation using Supabase Realtime subscriptions.
  - Seat locking / optimistic UI to avoid race conditions.

- Authentication
  - Email/password via Supabase Auth with secure RLS policies.
  - Protected routes using server-side session checks and client stores.

- Booking System
  - Transactional booking creation (atomic insert bookings + seat updates).
  - Passenger forms with Zod validation and React Hook Form.

- Rescheduling & Cancellation
  - Reschedule flow that re-locks seats and updates booking records.
  - Cancellation with seat release and audit trail.

- State Management (Zustand)
  - `useFlightStore` and `useUserStore` with persistence and partialize.
  - Optimistic updates for immediate UX while server confirms.

- PWA & Offline
  - Installable manifest, service worker, and offline caching strategies.
  - Offline access to `My Bookings` and cached seat maps.

- Security & Reliability
  - Postgres + Supabase RLS, RPC functions for atomic operations, and DB triggers for consistency.

## Tech Stack

Key technologies used:

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router, Server Components) |
| Language | TypeScript |
| Database | PostgreSQL (Supabase) |
| Realtime | Supabase Realtime (WAL-based) |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand (persist middleware) |
| PWA | next-pwa / service worker |
| Forms & Validation | React Hook Form + Zod |
| Animations | Framer Motion |

## System Architecture

Frontend
- App Router with a mix of Server Components for data fetching and Client Components for interactive UIs (seat map, forms).
- Server Actions used for secure mutations where appropriate (authenticated server-side calls).

Backend (Supabase)
- Postgres as single source of truth. Realtime uses WAL replication for subscription events.
- RPC functions handle complex operations (seat lock, commit booking, reschedule) inside DB transactions to guarantee atomicity.

Realtime flow
- Client subscribes to `seats` and `bookings` channels for a flight. Seat changes are broadcast by Postgres triggers via Supabase.
- When a user selects a seat, the UI performs an optimistic update and calls an RPC to attempt to lock the seat; server confirms or rejects, and the client reconciles.

Scalability & production patterns
- Use Server Components for non-interactive pages to lower client bundle size.
- Keep secrets server-side and use signed server actions when necessary.
- Indexes on flight/date/seat columns, connection pooling, and pagination for large result sets.

## Database Design

Primary tables (summary):

- `flights` — flight metadata (id, airline_code, origin, destination, departure_ts, arrival_ts, aircraft_type, seat_config_json)
- `seats` — per-flight seat instances (id, flight_id -> flights.id, seat_label, row, col, status ENUM('available','locked','booked'), locked_by, locked_until)
- `bookings` — booking records (id, user_id, flight_id, status, created_at, total_price)
- `passengers` — passenger details per booking (id, booking_id -> bookings.id, name, dob, passport)
- `reschedules` — audit trail for changes (id, booking_id, from_flight, to_flight, created_at, reason)

Relationships
- `flights` 1:N `seats`
- `bookings` N:1 `flights`
- `bookings` 1:N `passengers`

Seat locking & concurrency
- Seat lock implemented via an RPC `lock_seat(seat_id, user_id)` that checks `status='available'` and updates to `locked` with `locked_by` and `locked_until` inside a transaction.
- Commit booking RPC verifies locks and then atomically flips seat rows to `booked` and inserts booking + passengers. If a lock expired, operation fails cleanly.
- Use Postgres advisory locks or explicit `FOR UPDATE` in critical sections for high-contention flights.

RLS, triggers & RPCs
- Row-Level Security: policies restrict writes to `bookings` to authenticated users and allow reads based on ownership or public indexes.
- Triggers publish changes to Realtime and maintain derived fields (e.g., available_count).

## Zustand Store Structure

Stores implemented in `src/stores`:

- `useFlightStore`
  - Purpose: hold current flight search results, selected flight, seat map cache, realtime subscription state, and UI flags.
  - Persisted keys: lastSearch, recentFlights, cachedSeatMaps (partialized). Sensitive runtime locks and ephemeral subscription IDs are NOT persisted.
  - Optimistic updates: selecting a seat updates `cachedSeatMaps` immediately; after server RPC resolves, the store reconciles final state.

- `useUserStore`
  - Purpose: current authenticated user profile (id, email, name minimal), JWT/session metadata for client-side display only.
  - Persist middleware is used but the persisted state explicitly omits tokens and sensitive fields (use partialize to include safe fields only).

Implementation notes
- `persist` middleware + `partialize` to avoid storing secrets in localStorage.
- `reset` actions clear store on logout to avoid leakage.
- Zustand chosen for minimal boilerplate, straightforward partial persistence, and easy support for optimistic UI patterns.

## PWA Features

- Installable app via `manifest.json` (icons, display standalone, theme_color).
- Service worker and caching strategies (static assets precached, runtime caching for API and seat map JSON).
- Offline support: cached `My Bookings` and last-viewed seat maps; UI shows clear offline indicators and queues actions where appropriate (e.g., booking attempts while offline will prompt user to retry).
- Lighthouse: configured for high PWA score — prioritized mobile-first performance and accessible install prompt via a small `InstallPrompt` component.

## Screenshots

Placeholders (add actual screenshots in `public/screenshots` before final submission):

![Homepage](public/screenshots/homepage.png)
![Flight Search](public/screenshots/search.png)
![Seat Map](public/screenshots/seatmap.png)
![Booking Page](public/screenshots/booking.png)
![My Bookings](public/screenshots/my-bookings.png)
![Mobile UI](public/screenshots/mobile.png)
![Lighthouse PWA Score](public/screenshots/lighthouse.png)

## Local Setup Instructions

Prerequisites
- Node.js 18+ and npm or pnpm
- Supabase CLI (optional for local dev of the DB) — https://supabase.com/docs/guides/cli

Clone and install

```bash
git clone https://github.com/<your-org>/flight-management-pwa.git
cd flight-management-pwa
npm install
# or: pnpm install
```

Create env

```bash
cp .env.example .env.local
# Fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Run supabase migrations

```bash
# Using Supabase CLI (recommended)
supabase login
supabase projects create --name flight-management-local   # optional if you want a cloud project
supabase db connect # or configure connection in .env.local
supabase db push --schema supabase/migrations

# Alternatively run SQL files against your Postgres DB:
# psql $DATABASE_URL -f supabase/migrations/20260522112216_initial_schema.sql
```

Run app (development)

```bash
npm run dev
# Visit http://localhost:3000
```

## Environment Variables

Minimum variables (store in `.env.local` and include `.env.example` in repo):

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key for client
- `SUPABASE_SERVICE_ROLE_KEY` — (server-only) used only in server environment or CI for migrations/RPCs; do NOT expose in client
- `NEXT_PUBLIC_APP_URL` — optional, used for absolute links

Ensure `.env.example` contains placeholders and is committed.

## Supabase Setup

1. Create a Supabase project at https://app.supabase.com
2. Enable Email Auth (or configure providers you need).
3. Run the SQL migrations located in `/supabase/migrations` to create tables, triggers, and RPCs.
4. Configure RLS policies to allow authenticated users to manage their own bookings and to allow public read access where appropriate.
5. Enable Realtime on the tables you want to subscribe to (`seats`, `bookings`).

Notes: RPCs such as `lock_seat`, `commit_booking`, and `reschedule_booking` are authored to run inside transactions. Triggers publish seat changes to realtime channels.

## Deployment

Recommended: Vercel (automatic Next.js support)

Steps:

1. Push repository to GitHub.
2. Create a Vercel project and link the GitHub repo.
3. Add environment variables in Vercel (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` for server uses).
4. Set the build command: `npm run build` and the output directory as default (Next.js App Router auto-detected).
5. Deploy. The app will be available at `https://<your-vercel-project>.vercel.app` (replace with your URL).

Tip: Keep service-role key only in Vercel's Environment for Server scope.

## Project Structure

Key folders (top-level `src/`):

```txt
src/
 ├── app/                # Next.js App Router pages & layouts
 ├── actions/            # Server actions and client bridge functions
 ├── components/         # Reusable UI components (seat-map, booking-card)
 ├── stores/             # Zustand stores: flight-store.ts, user-store.ts
 ├── lib/                # Supabase client and utilities
 ├── types/              # shared TypeScript types
 └── providers/          # Theme & auth providers
```

See `src/app` for protected route layout patterns (`(protected)/layout.tsx`) and `src/components/seat-map` for seat rendering logic.

## Performance & Security

- Server Components reduce client JS bundles and speed up initial render.
- Keep Supabase service keys server-side; client only receives anon key and URL.
- RLS policies enforce per-row access and reduce backend surface area.
- Use DB transactions and `FOR UPDATE` / advisory locks for concurrency on hot rows (seat booking).
- Optimistic UI patterns improve UX while server confirms operations.

## Evaluation Criteria Coverage

This project maps directly to common assignment evaluation points:

- Schema & RLS: migrations include table schemas and example RLS policies that restrict booking operations to owners.
- Seat Map UX: interactive seat map with keyboard accessible controls and responsive layout.
- Realtime Sync: Supabase Realtime subscriptions ensure seat status is synchronized across clients.
- Reschedule & Cancel Logic: RPCs and reschedule audit trail ensure safe seat transfers.
- Zustand Design: `useFlightStore` and `useUserStore` demonstrate partial persistence and optimistic updates.
- Responsive Design: mobile-first Tailwind layout and PWA install flow.
- Code Quality: TypeScript types, Zod validations, and unit-friendly RPC boundary patterns.

## Submission Checklist

- [ ] Public GitHub repository
- [ ] Meaningful commit history
- [ ] `.env.example` in repo
- [ ] Supabase SQL migrations in `/supabase/migrations`
- [ ] Seed script for demo flights (`supabase/migrations/20260522142954_seed_flights.sql`)
- [ ] Comprehensive `README.md` (this file)
- [ ] Clear Zustand store documentation in `src/stores`
- [ ] Deployment on Vercel or similar (production URL)
- [ ] Lighthouse PWA screenshot in `public/screenshots/lighthouse.png`
- [ ] Responsive UI + mobile screenshots
- [ ] PWA install prompt & offline behavior validated

## Future Improvements

- Multi-passenger booking flow with shared/cart UX
- Payment gateway integration (Stripe) and secure payment flow
- Admin dashboard for flight management and analytics
- AI-assisted dynamic pricing recommendations
- Email / SMS notifications and boarding pass generation

## Contributing

Contributions are welcome. Please open an issue for feature requests or bugs and submit PRs with clear descriptions. Follow the existing code style and include tests for new logic when appropriate.

Recommended workflow:

1. Fork the repo
2. Create a feature branch
3. Open a PR against `main` with a concise description and tests

## Maintainer

- Maintainer: Your Name (replace)
- GitHub: https://github.com/your-username
- Portfolio: https://your-portfolio.example.com
- Contact: your.email@example.com

---

If you'd like, I can also:

- add `README` screenshots into `public/screenshots` with generated placeholders,
- create a minimal `.env.example` file, or
- prepare a short Vercel deployment guide with exact environment variable names for CI.

Would you like me to add any of those now?
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
