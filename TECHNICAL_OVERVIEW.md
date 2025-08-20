# GarageHub  Technical Overview

## Why this project
  Solves a clear, real world problem: monetizing unused garage space with Airbnb like UX.
  Great surface to showcase mobile first marketplace patterns: search, filters, listing details, auth, and booking flows.
  Fits a 3day scope with meaningful core functionality and thoughtful architecture to extend later.

## Stack and tools
  Runtime: Expo SDK 53, React Native 0.79, React 19
  Routing: Expo Router 5 (`app/` directory based navigation)
  Language: TypeScript (strict where helpful)
  UI: React Native core components, `expo linear gradient`, `@expo/vector icons`/`lucide react native`
  Data: Local mock/seeded listings for UI flows; ready to swap to API
  Networking: `axios`
  Backend (demo): Xano REST endpoints, configured in `services/xano.ts`
  Auth/session: token persisted via `expo secure store` with safe fallbacks to `localStorage` or in memory (`services/storage.ts`)
  DevX: Expo CLI, hot reload, web preview

## Current architecture
  Feature first organization, keeping concerns separate and testable:
    `app/` screens (e.g., `home`, `search`, `listingimagedetails`, `auth/*`) and navigation
    `services/`  API clients and auth helpers (`xano.ts`, `auth.ts`, `storage.ts`)
    `components/` reusable UI (branding, effects)
    `assets/`  images and icons for listings and chrome
    `hooks/`  cross cutting hooks (framework readiness)
  API clients: centralized axios instances with token injection via `setAuthTokenHeader`.
  State: local component state and memoization for filters/sorts; easy to scale to global store if needed.

## Implemented core flows (demo)
  Home discovery experience with categories, search, sorting, and carousels.
  Listing details navigation from grids/carousels.
  Auth service scaffolding with login/signup/ME and OTP verification helpers (Xano ready).

## Path to completion

### Product features
  Authentication: email/password, magic links/OTP, social login; profile & settings.
  Host onboarding: KYC, address, photos, amenities, access rules, pricing, availability calendar.
  Listings: CRUD for hosts, moderation pipeline, versioned edits.
  Search & discovery: full text + geo search, advanced filters (size, access, amenities, price), saved searches.
  Booking & payments: availability, holds, cancellations, refunds; Stripe Connect for split payouts; service fees & taxes.
  Messaging: hostguest chat, templated replies, attachments, rate limits.
  Reviews & ratings: per stay reviews, report/appeal flow.
  Notifications: push, email, and in app inbox.
  Maps: geocoding, map clusters, distance filters; address validation.

### Architecture & scaling
  Backend: start with Xano; graduate to Node/NestJS or Rails with PostgreSQL + PostGIS for geo; Prisma or TypeORM.
  Storage: S3/Cloudflare R2 for images; signed URLs; background image processing (thumbs, blurhash).
  Caching & queues: Redis for caching and rate limits; worker queue for webhooks, emails, and image jobs.
  Search: Postgres trigram + PostGIS initially; upgrade to OpenSearch/Meilisearch for advanced ranking.
  Payments: Stripe Connect (managed accounts), payout schedules, KYC, dispute webhooks.
  Observability: structured logging, metrics, tracing; Sentry for client and server errors.
  Security: JWT rotation, refresh tokens, device binding, 2FA for hosts; content moderation; PII handling.
  Performance: React Native screens with virtualization; image CDN; prefetching; incremental loading.
  Offline: cached search results, draft listing edits, resilient retries.
  CI/CD: GitHub Actions, Expo EAS builds and OTA updates; feature flagging for staged rollouts.
  Testing: unit (Jest), component (React Native Testing Library), E2E (Maestro/Detox), contract tests for APIs.

## Notes and tradeoffs
  Timeboxed to highlight UX, navigation, and a serviceable data/auth layer.
  Seeded local data keeps UI responsive and deterministic; swapping to live listings would require hooking up endpoints and normalizing responses.
  The API layer already supports token propagation and secure storage which minimizes future integration risk.
