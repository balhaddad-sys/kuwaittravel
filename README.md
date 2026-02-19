# Rahal Kuwait Travel

Production-ready bilingual (Arabic/English) travel platform built with Next.js + Firebase.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create local env file:

```bash
cp .env.example .env.local
```

3. Fill required Firebase values in `.env.local`.

4. Start development server:

```bash
npm run dev
```

## Required Environment Variables

From `.env.example`:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (optional)
- `NEXT_PUBLIC_ADMIN_EMAILS` (comma-separated emails that should see admin shortcut)
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `ADMIN_SETUP_KEY` (optional)
- `ADMIN_SETUP_ENABLED` (`false` in production)
- `ADMIN_EMAILS` (optional server-side allowlist; falls back to `NEXT_PUBLIC_ADMIN_EMAILS`)

## Production Readiness Commands

Run before every deployment:

```bash
npm run check
```

## Admin Bootstrap

Use the script below once to promote an existing user to admin:

```bash
npm run grant-admin -- --service-account "C:/path/to/service-account.json" --uid FIREBASE_UID --role super_admin
```

You can also use `--email` or `--phone` instead of `--uid`.

If an email is listed in `NEXT_PUBLIC_ADMIN_EMAILS`, signing in from `/admin-login` will auto-promote that account to `admin` (user doc + custom claims) on first admin login.

## Security Notes

- `/api/admin/setup` is disabled unless:
  - `ADMIN_SETUP_ENABLED=true`
  - and `NODE_ENV` is not `production`
- Keep `ADMIN_SETUP_ENABLED=false` for consumer deployment.

## Deployment (Firebase Hosting)

1. Build and verify:

```bash
npm run check
```

2. Deploy:

```bash
firebase deploy
```

## Mobile QA Checklist

Validate these on iOS Safari and Android Chrome:

- Login and OTP flow
- Discover page scrolling and card taps
- Booking flow (`/app/campaigns/[id]/trips/[tripId]`)
- Portal and Admin navigation chips (mobile top nav)
- Language switch (`AR/EN`) with correct `dir` changes
- Bottom navigation and sticky action buttons with safe-area insets
