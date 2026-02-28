# KAYA Backend — Development Guide

Step-by-step guide and deliverables for the backend team. Use with [KAYA_REQUIREMENTS_AND_DESCRIPTION.md](../KAYA_REQUIREMENTS_AND_DESCRIPTION.md) as the source of truth.

---

## Backend Deliverables (Summary)

| # | Deliverable | Owner | Phase |
|---|-------------|--------|-------|
| 1 | Repo structure, config, DB connection, health endpoint | Backend | 0–1 |
| 2 | Database migrations (users, houses, house_media, payments) | Backend | 1 |
| 3 | Auth: request-OTP, verify-OTP, JWT issuance | Backend | 1 |
| 4 | JWT middleware and protected routes | Backend | 1 |
| 5 | Houses: GET list (with filters), GET by ID, unlock masking | Backend | 1 |
| 6 | Admin: CRUD houses, media upload (Supabase Storage) | Backend | 1 |
| 7 | Payments: initiate STK Push, callback handler, unlock logic | Backend | 3 |
| 8 | Input validation, rate limiting, error handling | Backend | 4 |
| 9 | API documentation (OpenAPI/Swagger or markdown) | Backend | 1–4 |
| 10 | Logging, testing, production config | Backend | 4–5 |

---

## Phase 0: Planning & Setup

### Step 0.1 — Repository and project structure

- [x] Ensure Go module is initialized (`go mod init` if new).
- [x] Create and maintain this structure:

```
cmd/
  server/
    main.go
internal/
  config/
    config.go
  database/
    db.go
  auth/
    handler.go
    service.go
    repository.go
  users/
    (as needed)
  houses/
    handler.go
    service.go
    repository.go
  payments/
    handler.go
    service.go
    repository.go
  middleware/
    auth.go
    ratelimit.go
    recovery.go
  admin/
    houses.go
migrations/
  001_initial_schema.up.sql
  001_initial_schema.down.sql
pkg/
  utils/
    (helpers, validators)
.env.example
```

- [x] Add `.env` to `.gitignore`; commit `.env.example` only.
- [x] Document in README: prerequisites (Go 1.20+, PostgreSQL), how to run, env vars.

**Deliverable:** Repo structure, `.env.example`, README updates.

---

### Step 0.2 — Configuration and environment

- [x] Implement `internal/config/config.go` to load:
  - `PORT` (default `8080`)
  - `DB_URL` (PostgreSQL connection string)
  - `JWT_SECRET`
  - Later: `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_PASSKEY`, `MPESA_SHORTCODE`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` (or similar for storage).
- [x] Use `godotenv` to load `.env` in non-production or as fallback.
- [x] Validate required vars at startup; fail fast with clear error if missing.

**Deliverable:** Config package and `.env.example` with all variables documented.

---

### Step 0.3 — Database connection

- [x] Implement `internal/database/db.go`:
  - Open connection using `DB_URL`.
  - Expose a way to ping the DB (for health check).
  - Consider connection pool settings (max open, max idle).
- [x] In `main.go`, load config, connect to DB, defer close, and pass DB (or repository interface) to handlers/services.

**Deliverable:** DB connection and ping used by server startup and health check.

---

### Step 0.4 — Health endpoint and server bootstrap

- [x] Register `GET /health` that:
  - Returns 200 and a simple payload (e.g. `{"status":"ok"}`).
  - Optionally checks DB ping and returns 503 if DB is down.
- [x] Start HTTP server on `PORT` with gorilla/mux (or chosen router).
- [x] Run `go run cmd/server/main.go` and confirm `GET /health` succeeds.

**Deliverable:** Running server with health check.

---

## Phase 1: Backend Core (DB, Auth, Houses)

### Step 1.1 — Database migrations

- [x] Add migration tool (e.g. golang-migrate, goose, or plain SQL in `migrations/`).
- [x] Create **up** migration with:

**users**

- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `phone` TEXT UNIQUE NOT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now()

**houses**

- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `title` TEXT NOT NULL
- `description` TEXT
- `rent_price` INTEGER NOT NULL
- `general_location` TEXT NOT NULL
- `exact_location` TEXT
- `latitude` DOUBLE PRECISION
- `longitude` DOUBLE PRECISION
- `contact_number` TEXT
- `managed_by` TEXT
- `landmarks` TEXT
- `distance_info` TEXT
- `created_at`, `updated_at` TIMESTAMPTZ

**house_media**

- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `house_id` UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE
- `media_url` TEXT NOT NULL
- `media_type` TEXT NOT NULL CHECK (media_type IN ('image','video'))
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()

**payments**

- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `user_id` UUID NOT NULL REFERENCES users(id)
- `house_id` UUID NOT NULL REFERENCES houses(id)
- `amount` INTEGER NOT NULL
- `status` TEXT NOT NULL CHECK (status IN ('pending','paid','failed'))
- `mpesa_receipt` TEXT
- `transaction_id` TEXT
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now()

**Indexes**

- `CREATE UNIQUE INDEX idx_payments_user_house ON payments(user_id, house_id);`
- `CREATE INDEX idx_houses_general_location ON houses(general_location);`
- `CREATE INDEX idx_houses_rent_price ON houses(rent_price);`
- Optional: index on `payments(status)`, `house_media(house_id)`.

- [x] Create **down** migration to drop tables in reverse order.
- [x] Document how to run migrations (e.g. `migrate -path migrations -database $DB_URL up`).

**Deliverable:** Migrations that create full schema and indexes; runnable up/down.

---

### Step 1.2 — Auth: request OTP

- [ ] Implement `POST /auth/request-otp`.
- [ ] Request body: e.g. `{"phone": "254712345678"}`.
- [ ] Validate phone format ( Kenyan format; normalize to 254… ).
- [ ] Generate OTP (e.g. 6 digits), store in DB or cache with 5-minute expiry.
  - If no `users` row for phone, create one (id, phone, created_at, updated_at).
- [ ] Send OTP via chosen provider (e.g. Africa’s Talking, Twilio, or mock for dev).
- [ ] Response: e.g. `{"message": "OTP sent"}`. Do not return OTP in response.
- [ ] Add rate limiting for this endpoint (e.g. 5 requests per phone per 15 minutes).

**Deliverable:** `POST /auth/request-otp` with validation, storage, send, and rate limit.

---

### Step 1.3 — Auth: verify OTP and issue JWT

- [ ] Implement `POST /auth/verify-otp`.
- [ ] Request body: e.g. `{"phone": "254712345678", "otp": "123456"}`.
- [ ] Validate input; verify OTP against stored value and expiry.
- [ ] On success: find or create user by phone; issue JWT with user id (and optional role).
- [ ] JWT expiry: 24 hours; sign with `JWT_SECRET`.
- [ ] Response: e.g. `{"token": "<jwt>", "user": {"id": "<uuid>", "phone": "..."}}`.
- [ ] Invalidate or delete used OTP so it cannot be reused.

**Deliverable:** `POST /auth/verify-otp` returning JWT and user info.

---

### Step 1.4 — JWT middleware and protected routes

- [ ] Implement middleware that:
  - Reads `Authorization: Bearer <token>`.
  - Parses and validates JWT; extracts user id (and role).
  - Sets user context on request (e.g. `context.WithValue` or request-scoped struct).
  - Returns 401 if missing or invalid token.
- [ ] Apply this middleware to all routes that require authentication (houses list/detail can be public; initiate payment, admin, profile require auth).
- [ ] Document which routes are public vs protected.

**Deliverable:** JWT middleware and route protection for authenticated endpoints.

---

### Step 1.5 — Houses: list and filters

- [ ] Implement `GET /houses`.
- [ ] Support query params: e.g. `general_location`, `min_rent`, `max_rent`, `limit`, `offset`.
- [ ] Return list of houses with:
  - For unauthenticated or non-paying users: exclude or null `exact_location`, `contact_number`; set `is_unlocked: false`.
  - For authenticated users who have paid for this house: include `exact_location`, `contact_number`; set `is_unlocked: true`.
- [ ] Include `house_media` (media_url, media_type) in response or via nested object.
- [ ] Use indexes on `general_location` and `rent_price` in queries.

**Deliverable:** `GET /houses` with filters and correct unlock masking.

---

### Step 1.6 — Houses: get by ID and unlock logic

- [ ] Implement `GET /houses/:id`.
- [ ] If house not found, return 404.
- [ ] If request is unauthenticated: return house with `exact_location`, `contact_number` null and `is_unlocked: false`.
- [ ] If authenticated: check if there is a successful payment (`status = 'paid'`) for this user_id and house_id. If yes, return full details and `is_unlocked: true`; otherwise masked and `is_unlocked: false`.
- [ ] Include media array in response.

**Deliverable:** `GET /houses/:id` with correct unlock behavior per user.

---

### Step 1.7 — Admin: create and update houses

- [ ] Implement `POST /admin/houses` (admin-only).
  - Ensure route is protected and caller has admin role (or use separate admin auth).
- [ ] Request body: title, description, rent_price, general_location, exact_location, latitude, longitude, contact_number, managed_by, landmarks, distance_info.
- [ ] Validate required fields and types; insert into `houses`; return created house (with id, timestamps).
- [ ] Implement `PUT /admin/houses/:id` to update existing house; return updated house.
- [ ] Implement `DELETE /admin/houses/:id` if required (soft delete or hard delete per product decision).

**Deliverable:** Admin CRUD for houses (at least POST and PUT).

---

### Step 1.8 — Admin: house media (Supabase Storage)

- [ ] Integrate with Supabase Storage (or chosen storage): generate signed upload URL or upload from backend using service key.
- [ ] Implement endpoint to add media to a house, e.g. `POST /admin/houses/:id/media`:
  - Accept multipart file upload or URL; store file in Supabase; get `media_url`.
  - Insert row into `house_media` (house_id, media_url, media_type).
- [ ] Optionally: `DELETE /admin/houses/:id/media/:media_id` to remove media.
- [ ] Ensure house detail and list responses include media from `house_media`.

**Deliverable:** Admin can add (and optionally remove) images/videos for a house; media URLs in API responses.

---

### Step 1.9 — API documentation

- [ ] Document every endpoint: method, path, request body/query, response body, auth required (yes/no), and errors.
- [ ] Option 1: OpenAPI/Swagger spec (e.g. `docs/openapi.yaml`) and serve Swagger UI at `/docs`.
- [ ] Option 2: Markdown file (e.g. `docs/API.md`) with the same information.
- [ ] Keep docs in sync with implementation; update when adding or changing endpoints.

**Deliverable:** API documentation (OpenAPI or API.md) covering auth, houses, admin, and later payments.

---

## Phase 2: Frontend core (backend support only)

- [ ] Backend: ensure all endpoints needed by frontend auth and house list/detail are implemented and documented (done in Phase 1).
- [ ] Backend: no new deliverables in Phase 2 except fixes and small tweaks requested by frontend (e.g. extra fields, CORS if needed for web).

**Deliverable:** Stable auth and house APIs for frontend integration.

---

## Phase 3: Payment integration

### Step 3.1 — M-Pesa Daraja API setup

- [ ] Obtain sandbox (and later production) credentials: Consumer Key, Consumer Secret, Passkey, Shortcode.
- [ ] Add env vars: `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_PASSKEY`, `MPESA_SHORTCODE`, and optionally `MPESA_CALLBACK_BASE_URL`.
- [ ] Implement Daraja OAuth token retrieval (cache token until expiry).
- [ ] Implement STK Push request builder (amount, phone, reference, callback URL, etc.).

**Deliverable:** Config and helper to call Daraja STK Push.

---

### Step 3.2 — Initiate payment endpoint

- [ ] Implement `POST /payments/initiate`.
- [ ] Request body: e.g. `{"house_id": "<uuid>", "phone": "254712345678"}`. Phone may be taken from JWT user if same.
- [ ] Validate house exists and user is authenticated (user_id from JWT).
- [ ] Check if user already has a successful payment for this house; if yes, return 200 with message "already unlocked" (idempotent).
- [ ] Create payment row: user_id, house_id, amount (40000 = Ksh 400 in cents if API uses cents, or 400 in KES — align with Daraja), status `pending`.
- [ ] Call Daraja STK Push with callback URL pointing to your `POST /payments/callback`.
- [ ] Store Daraja request metadata (e.g. CheckoutRequestID) in payment or separate table if needed for callback matching.
- [ ] Response: e.g. `{"message": "STK push sent", "payment_id": "<uuid>"}`.
- [ ] Rate limit: e.g. 10 initiate requests per user per minute.

**Deliverable:** `POST /payments/initiate` that creates pending payment and triggers STK Push.

---

### Step 3.3 — Payment callback (Daraja webhook)

- [ ] Implement `POST /payments/callback` (public URL reachable by Safaricom).
- [ ] Parse Daraja callback payload; extract CheckoutRequestID, ResultCode, MpesaReceiptNumber, etc.
- [ ] Find payment by CheckoutRequestID (or equivalent); if not found, return 200 anyway to avoid retries (idempotent).
- [ ] If ResultCode indicates success: update payment to `status = 'paid'`, set `mpesa_receipt`, `transaction_id`; if failure, set `status = 'failed'`.
- [ ] Make callback idempotent: if payment already `paid`, return 200 without re-applying.
- [ ] Return 200 with Daraja-expected response body so Safaricom does not retry unnecessarily.
- [ ] Use HTTPS in production; validate callback authenticity if Daraja supports signature verification.

**Deliverable:** `POST /payments/callback` that updates payment and unlocks house for user.

---

### Step 3.4 — Unlock logic consistency

- [ ] Ensure `GET /houses` and `GET /houses/:id` use payment table: for authenticated user, if exists payment with user_id, house_id and status `paid`, then return `is_unlocked: true` and include `exact_location`, `contact_number`.
- [ ] No client-only unlock: frontend must rely on backend response; backend must only unlock after verified payment.

**Deliverable:** Unlock behavior driven solely by backend payment verification.

---

## Phase 4: Hardening

### Step 4.1 — Input validation

- [ ] Validate all request bodies and query params: type, format, length, allowed values.
- [ ] Return 400 with clear error message for invalid input (e.g. invalid UUID, missing required field, invalid phone).
- [ ] Sanitize or reject dangerous input (e.g. SQL injection is mitigated by parameterized queries; still validate lengths and types).

**Deliverable:** Consistent validation and 400 responses for bad input.

---

### Step 4.2 — Rate limiting

- [ ] Apply rate limiting to:
  - `POST /auth/request-otp` (per phone or per IP).
  - `POST /auth/verify-otp` (per phone or per IP).
  - `POST /payments/initiate` (per user or per IP).
- [ ] Use middleware (e.g. in-memory or Redis) with sensible limits (e.g. 5 OTP requests per 15 min, 10 payment initiates per minute per user).
- [ ] Return 429 when limit exceeded.

**Deliverable:** Rate limiting on OTP and payment endpoints; 429 responses.

---

### Step 4.3 — Error handling and logging

- [ ] Centralized error handling: map errors to HTTP status (404, 400, 401, 403, 500); avoid leaking internal details in 500 responses.
- [ ] Structured logging (e.g. request id, method, path, user_id, status, duration, error message); no sensitive data (no OTP, no full JWT) in logs.
- [ ] Log payment callbacks and payment state changes for debugging and auditing.

**Deliverable:** Consistent error responses and structured logging.

---

### Step 4.4 — Testing

- [ ] Unit tests for: validation, unlock logic, payment state transitions.
- [ ] Integration tests for: auth flow (request OTP → verify OTP → JWT), house list/detail with and without payment, payment initiate + mock callback.
- [ ] Document how to run tests (`go test ./...`).

**Deliverable:** Test suite covering critical paths; CI runnable.

---

## Phase 5: Production preparation

### Step 5.1 — Production config

- [ ] Switch to production M-Pesa credentials and Paybill; use production callback URL (HTTPS).
- [ ] Ensure all secrets are in environment variables; no default or dev secrets in production.
- [ ] CORS: restrict origins to frontend domains if applicable.
- [ ] HTTPS only in production (handled by Render/Railway/Fly.io or reverse proxy).

**Deliverable:** Production env template and CORS/HTTPS checklist.

---

### Step 5.2 — Deployment and monitoring

- [ ] Deploy backend to Render / Railway / Fly.io; connect to Supabase (PostgreSQL + Storage).
- [ ] Run migrations as part of deploy or via separate step.
- [ ] Expose health endpoint for load balancer or orchestrator.
- [ ] Set up basic monitoring: uptime, error rate, latency; alert on 5xx or health check failure.
- [ ] Optional: request/response logging to external service (without logging sensitive body).

**Deliverable:** Deployed backend and monitoring in place.

---

## Handoff and dependencies

- **Frontend depends on:** Auth endpoints, house list/detail with `is_unlocked` and media, payment initiate endpoint, and API docs. Callback is backend-only.
- **Backend depends on:** Supabase (DB + Storage), M-Pesa Daraja (sandbox then production), and OTP delivery provider.
- Keep API contract in sync with [KAYA_REQUIREMENTS_AND_DESCRIPTION.md](../KAYA_REQUIREMENTS_AND_DESCRIPTION.md); document any divergence in API docs.

---

*Backend development guide for Kaya. Update this doc as the API or phases change.*
