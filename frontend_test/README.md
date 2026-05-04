# PR: Frontend–Backend Integration (api-tester → master)

## Summary

- Wires the Kaya housing frontend to the live backend at `https://kaya-xb37.onrender.com`
- Replaces all mock data and mock auth with real API calls
- Adds M-Pesa STK push payment flow with automatic polling for unlock confirmation
- Adds session persistence so page refreshes don't log the user out
- Adds Render static-site deployment config

---

## Background

The frontend (`src/app/`) and the Go backend were completely disconnected — login was mocked, house listings came from a hardcoded array in Explore, house detail showed static placeholder data, and the payment modal used a fake OTP (`1234`). This PR closes that gap end-to-end.

---

## Changes

### `src/app/lib/api.ts` _(new file)_
Central fetch client. All requests target `https://kaya-xb37.onrender.com`, automatically attach the stored JWT as `Authorization: Bearer <token>`, and throw a typed error on any non-2xx response. Exports `apiGet`, `apiPost`, `setToken`, and `clearAuth` — the rest of the app imports from here instead of calling `fetch` directly.

### `src/app/components/kaya-login.tsx`
Replaced the email/name/mock-credentials form with a real 2-step phone OTP flow:
- **Step 1** — user enters phone number → `POST /auth/request-otp`
- **Step 2** — user enters the 6-digit code → `POST /auth/verify-otp` → JWT stored in `localStorage`

Loading spinners and error messages are surfaced at each step.

### `src/app/App.tsx`
`UserData` is now `{ id, phone, token }` (backend returns no name or email — auth is phone-only). On mount, the app reads `localStorage` and restores an existing session so users stay logged in across refreshes. `clearAuth()` is called on logout to wipe both the token and the user record.

### `src/app/components/kaya-dashboard.tsx`
- Switched from raw `fetch()` to `apiGet()` so the JWT is included in every request — the backend now returns the correct `is_unlocked` flag per house for the authenticated user.
- Fixed the `media` field type from `string | null` to `MediaItem[]`; the first image is now resolved via `media_url` instead of treating the array as a URL string.
- Unlocked houses display a green "Unlocked" badge in the listing card.

### `src/app/components/kaya-explore.tsx`
Removed the 8-item static `allHouses` array. The Explore page now fetches from `GET /houses?limit=100` on mount. The search box, price range slider, property type buttons, and bedroom filter all work against live data. Loading and error states added.

### `src/app/components/kaya-house-detail.tsx`
Full rewrite of the data layer:
- Fetches real house data from `GET /houses/{id}` (JWT attached automatically).
- `is_unlocked` from the API response determines whether contact info is shown or blurred — no local `isPaid` state.
- Real media: images cycle through `media` items where `media_type === "image"`; a `<video>` element is rendered for `media_type === "video"`. Falls back to Unsplash placeholders if no media exists.
- **Payment flow:**
  1. User enters their M-Pesa phone → `POST /payments/initiate` sends an STK push to their phone.
  2. If the house is already paid, contact info is revealed immediately.
  3. Otherwise the modal switches to a waiting screen and polls `GET /houses/{id}` every 3 seconds for up to 90 seconds.
  4. When the M-Pesa callback marks the payment as `paid`, `is_unlocked` flips to `true`, the modal closes, and the contact details appear automatically.
  5. Polling is cancelled on modal close or component unmount to avoid memory leaks.

### `src/app/components/kaya-profile-sidebar.tsx`
Updated `userData` type from `{ name, email, phone }` to `{ id, phone, token }`. The sidebar now displays the phone number as the user's identifier and removes the email row (the backend stores neither name nor email).

### `.gitignore`
Added `dist` — build output should not be tracked.

### `render.yaml`
Render static-site deployment config: builds with `npm run build`, publishes from `./dist`.

### `public/_headers`
Forces correct MIME types (`text/css`, `application/javascript`) for Render's static asset serving, which defaults to `application/octet-stream` and breaks stylesheet and script loading.

---

## How the payment unlock flow works end-to-end

```
User clicks "Unlock"
  → enters M-Pesa number
  → POST /payments/initiate { house_id, phone }
      → backend initiates Daraja STK push
      → payment record created (status: pending)
  → STK push arrives on user's phone
  → user enters M-Pesa PIN
      → Daraja calls POST /payments/callback
      → backend updates payment to status: paid
  → frontend polling GET /houses/{id} detects is_unlocked: true
  → modal closes, contact details revealed
```

---

## Test plan

- [ ] Login with a valid Kenyan phone number, receive OTP, verify — lands on dashboard
- [ ] Refresh page — session restored, no re-login required
- [ ] Logout — clears session, returns to login screen
- [ ] Dashboard loads real listings with correct images and prices
- [ ] Explore search, price filter, type filter, bedroom filter all narrow results correctly
- [ ] Clicking a listing opens the house detail with real title, description, and images
- [ ] Contact section shows blurred/locked state for unpaid listings
- [ ] Initiating payment sends STK push (verify on phone), contact details reveal after PIN entry
- [ ] Already-unlocked listings show contact info immediately on open

---
