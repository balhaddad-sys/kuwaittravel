# Rahal (رحال) — Consumer-Readiness Audit Report

**Date:** 2026-02-21
**Scope:** Full-stack audit — design, layout, frontend, backend, security
**App:** Kuwait Travel / Rahal — Pilgrimage trip booking platform
**Stack:** Next.js 16 · React 19 · Firebase (Auth, Firestore, Storage) · Tailwind CSS 4 · TypeScript

---

## Executive Summary

Rahal is a well-structured bilingual (Arabic/English) pilgrimage travel booking platform with three portals: consumer (B2C), campaign operator (B2B), and admin. The design system is polished with a consistent Sacred Horizon theme. However, several **critical issues** must be resolved before consumer launch, including fake rating data, security gaps, and missing input validation.

### Score Card

| Area | Grade | Notes |
|------|-------|-------|
| **Design System** | A- | Consistent theme, good dark mode, strong RTL support |
| **Frontend UX** | B+ | Professional layout, good loading states, some gaps |
| **Accessibility** | C+ | Basic keyboard nav present, missing ARIA attributes |
| **Backend Security** | C | Several critical vulnerabilities identified |
| **API Design** | B | Clean Firestore abstraction, missing validation |
| **Performance** | B | Good image optimization, missing pagination |
| **Consumer Readiness** | B- | Needs critical fixes before launch |

---

## CRITICAL Issues (Must Fix Before Launch)

### 1. FIXED — Fake Rating Calculation in TripCard
- **File:** `src/components/shared/TripCard.tsx:188`
- **Was:** Rating fabricated from booking count: `(4.3 + (booked % 10) * 0.06).toFixed(1)`
- **Risk:** Misleads consumers, potential regulatory/legal issue
- **Fix Applied:** Removed fake rating display; should only show when backed by real review data

### 2. FIXED — Console Errors Leaked to Production
- **Files:** `src/app/(auth)/onboarding/page.tsx:79`, `src/app/(b2c)/app/my-trips/[id]/page.tsx:75`, `src/app/(b2c)/app/campaigns/[id]/trips/[tripId]/page.tsx:110`, `src/app/(b2c)/app/campaigns/[id]/page.tsx:54`, `src/lib/firebase/firestore.ts:48`
- **Risk:** Internal error details exposed to browser console in production
- **Fix Applied:** Guarded all client-side console statements with `process.env.NODE_ENV !== "production"`

### 3. No Overbooking Prevention (Race Condition)
- **Area:** Booking flow (Firestore writes)
- **Issue:** No server-side transaction to atomically check capacity and decrement remaining seats. Two users can book the last seat simultaneously.
- **Recommendation:** Use Firestore transactions to read `remainingCapacity`, validate > 0, then decrement atomically

### 4. Missing Rate Limiting on Admin APIs
- **Files:** `src/app/api/admin/promote-privileged/route.ts`, `src/app/api/admin/sync-claims/route.ts`
- **Issue:** No rate limiting; admin endpoints vulnerable to brute-force attacks
- **Recommendation:** Add rate limiting middleware (e.g., via Vercel edge config or a simple in-memory limiter)

### 5. Admin Setup Endpoint Double-Guard
- **File:** `src/app/api/admin/setup/route.ts:11`
- **Issue:** Endpoint checks `NODE_ENV === "production"` to self-disable, but this only works if the environment variable is correctly set on the deployment platform. It should also be removed or gated by feature flag.
- **Note:** Currently the check exists at line 11 — verify it's always accurate in your deployment

### 6. Platform Fees Not Verified Server-Side
- **File:** `src/lib/utils/constants.ts`
- **Issue:** Commission rates (e.g., `PLATFORM_COMMISSION_RATE`) defined client-side. Payment calculations can be manipulated.
- **Recommendation:** All fee calculations must happen server-side only

### 7. Missing CSRF Protection on State-Changing APIs
- **Files:** All POST API routes
- **Issue:** No CSRF token verification on admin endpoints
- **Recommendation:** Implement CSRF token validation or use SameSite cookie policy

---

## HIGH Issues

### 8. FIXED — Storage Upload Missing File Type/Size Validation
- **File:** `src/lib/firebase/storage.ts`
- **Was:** No MIME type or size validation on file uploads
- **Fix Applied:** Added allowlist of MIME types (JPEG, PNG, WebP, AVIF, PDF) and 10 MB size limit

### 9. Missing Input Validation on Onboarding
- **File:** `src/app/(auth)/onboarding/page.tsx`
- **Issue:** `displayName` field lacks character validation. Users can input HTML/script tags.
- **Recommendation:** Sanitize and validate all text inputs before Firestore writes

### 10. XSS Risk via User Display Names
- **Area:** Any component rendering `userData.displayName`
- **Issue:** If display names contain HTML, they could execute in contexts where React's escaping doesn't apply (e.g., dangerouslySetInnerHTML, meta tags)
- **Recommendation:** Sanitize display names at write time

### 11. CSP Policy Includes `unsafe-eval`
- **File:** `next.config.ts:53`
- **Issue:** `script-src` includes `'unsafe-eval'` which weakens Content Security Policy
- **Recommendation:** Remove `'unsafe-eval'` if not required by Firebase SDK; test and whitelist specific scripts

### 12. No Duplicate Booking Prevention
- **Area:** Booking creation flow
- **Issue:** No check prevents a user from booking the same trip twice
- **Recommendation:** Query existing bookings for user+trip before creating new one

### 13. Admin Dashboard Loads Entire Collections
- **File:** `src/app/(admin)/admin/dashboard/page.tsx`
- **Issue:** Fetches all users, bookings, etc. without pagination; will fail at scale
- **Recommendation:** Use aggregation queries or paginated fetches

---

## MEDIUM Issues

### 14. FIXED — Duplicate CSS Classes on Plane Icon
- **File:** `src/app/(b2c)/app/my-trips/page.tsx:176`
- **Was:** `className="h-5.5 w-5.5 h-[1.375rem] w-[1.375rem] text-white"` — conflicting size values
- **Fix Applied:** Cleaned to single size specification: `h-[1.375rem] w-[1.375rem]`

### 15. FIXED — Image Error Handling Missing in TripCard
- **File:** `src/components/shared/TripCard.tsx`
- **Was:** No `onError` fallback on Image components
- **Fix Applied:** Added error state tracking and graceful fallback to MapPin placeholder

### 16. FIXED — Modal Missing `aria-describedby`
- **File:** `src/components/ui/Modal.tsx`
- **Fix Applied:** Added `aria-describedby` linking to description element, plus `aria-label` on close button

### 17. FIXED — SearchInput Decorative Icon Not Hidden from Screen Readers
- **File:** `src/components/forms/SearchInput.tsx`
- **Fix Applied:** Added `aria-hidden="true"` to decorative Search icon, `aria-label` to clear button

### 18. Search/Filter State Not in URL
- **File:** `src/app/(b2c)/app/discover/page.tsx`
- **Issue:** Filters stored in React state only; lost on refresh, not shareable
- **Recommendation:** Sync filter state to URL search params via `useSearchParams()`

### 19. Tab State Not URL-Persisted
- **File:** `src/app/(b2c)/app/my-trips/page.tsx:95`
- **Issue:** Active tab ("upcoming"/"past") lost on page refresh
- **Recommendation:** Store tab in URL query parameter

### 20. Missing Pagination on Trip Grid
- **File:** `src/app/(b2c)/app/discover/page.tsx:500`
- **Issue:** Only shows first 12 of potentially 36+ fetched trips, no "Load More" button
- **Recommendation:** Add pagination or infinite scroll

### 21. Missing Error Boundaries
- **Area:** All route groups
- **Issue:** No `error.tsx` files for graceful error recovery
- **Recommendation:** Add error boundaries to `(b2c)`, `(b2b)`, and `(admin)` route groups

### 22. Login Page Phone Placeholder Inconsistency
- **File:** `src/app/(auth)/login/page.tsx:135`
- **Issue:** Arabic placeholder shows "9XXXXXXX" but English shows "5XXXXXXX"; validation regex accepts `[569]XXXXXXX`
- **Recommendation:** Make placeholder match validation: e.g., "5XXXXXXX / 6XXXXXXX / 9XXXXXXX"

### 23. Inconsistent Dark Mode Text Opacities
- **Area:** Multiple components
- **Issue:** Mix of `dark:text-indigo-300/60`, `/55`, `/50`, `/45` with no system
- **Recommendation:** Standardize to 2-3 opacity tiers in the design tokens

### 24. Missing Firestore Composite Indexes
- **File:** `firebase/firestore.indexes.json`
- **Issue:** Discover page queries on `status + adminApproved` need composite indexes
- **Recommendation:** Deploy required indexes or queries will fail silently

---

## LOW Issues

### 25. No Custom Loading States for Some Sections
- Featured trips and destinations show nothing during initial load
- Recommendation: Add skeleton loaders for all sections

### 26. BottomNav Notification Badge Hidden on Active Tab
- **File:** `src/components/layout/BottomNav.tsx:50-51`
- Notification dot only shows when tab is NOT active

### 27. ReviewForm Has No Character Limits
- **File:** `src/components/shared/ReviewForm.tsx`
- Title and body fields accept unlimited text
- Recommendation: Add `maxLength` props

### 28. FormField Required Indicator Not Explained
- **File:** `src/components/forms/FormField.tsx:18`
- Red asterisk lacks screen reader context
- Recommendation: Add `<span className="sr-only">(required)</span>`

### 29. ProfilePage Menu Not Scrollable on Short Screens
- **File:** `src/app/(b2c)/app/profile/page.tsx`
- Menu card may overflow on very short viewports
- Recommendation: Add `overflow-y-auto max-h-[calc(100vh-...)]`

### 30. `register-campaign` Console Warnings in Production
- **File:** `src/app/(auth)/register-campaign/page.tsx:77,155`
- `console.warn` and `console.error` not gated
- Recommendation: Guard with NODE_ENV check

### 31. Portal Settings/Documents/Notifications Console Errors
- **Files:** `src/app/(b2b)/portal/settings/page.tsx`, `documents/page.tsx`, `notifications/page.tsx`
- Same console.error pattern — should guard in production

---

## Architecture Strengths

1. **Clean Route Structure** — Proper Next.js App Router route groups `(b2c)`, `(b2b)`, `(admin)`, `(auth)`
2. **Type Safety** — Comprehensive TypeScript types for all domain models
3. **Bilingual Support** — RTL/LTR with DirectionProvider, consistent `t()` helper
4. **Lazy Firebase Init** — Proxy-based lazy initialization avoids client-side SDK loading issues
5. **Real-time Data** — Firestore `onSnapshot` listeners for auth state and user data
6. **Security Headers** — Good CSP, X-Frame-Options, Referrer-Policy in Next.js config
7. **Design System** — Cohesive "Sacred Horizon" theme with proper CSS custom properties
8. **Role-Based Access** — RoleGuard component with admin bootstrapping flow
9. **Dark Mode** — Full dark mode support with proper color tokens
10. **PWA Ready** — Manifest, viewport meta, safe-area insets, Apple Web App config

---

## Recommendations by Priority

### Before Consumer Launch
1. Fix overbooking race condition (use Firestore transactions)
2. Add rate limiting to admin API endpoints
3. Validate all user inputs server-side (display names, form data)
4. Remove `unsafe-eval` from CSP if possible
5. Add error boundaries (`error.tsx`) to all route groups
6. Deploy required Firestore composite indexes
7. Add duplicate booking prevention

### Post-Launch High Priority
8. Implement URL-based filter/tab state for shareability
9. Add pagination / infinite scroll to trip grid
10. Standardize dark mode opacity tokens
11. Guard remaining console.error/warn statements in B2B portal
12. Add real rating system backed by review data

### Future Improvements
13. Implement focus trapping in Modal component
14. Add keyboard navigation to image galleries
15. Create aggregation endpoints for admin dashboard
16. Add CSRF protection to all mutation endpoints
17. Implement proper error tracking (Sentry or similar)

---

## Files Modified in This Audit

| File | Change |
|------|--------|
| `src/components/shared/TripCard.tsx` | Removed fake ratings, added image error handling |
| `src/app/(auth)/onboarding/page.tsx` | Guarded console.error for production |
| `src/app/(b2c)/app/my-trips/[id]/page.tsx` | Guarded console.error for production |
| `src/app/(b2c)/app/campaigns/[id]/trips/[tripId]/page.tsx` | Guarded console.error for production |
| `src/app/(b2c)/app/campaigns/[id]/page.tsx` | Guarded console.error for production |
| `src/lib/firebase/firestore.ts` | Guarded console.error for production |
| `src/app/(b2c)/app/my-trips/page.tsx` | Fixed duplicate CSS classes on Plane icon |
| `src/components/ui/Modal.tsx` | Added aria-describedby, aria-label on close button |
| `src/components/forms/SearchInput.tsx` | Added aria-hidden on icon, aria-label on clear button |
| `src/lib/firebase/storage.ts` | Added MIME type allowlist and 10 MB size limit |
