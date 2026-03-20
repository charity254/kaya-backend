# Kaya API Documentation

Base URL: `https://kaya-backend-production-beb0.up.railway.app`

---

## Authentication

Kaya uses phone number + OTP authentication. There are no passwords.

### How it works
1. User enters their phone number
2. OTP is sent to their phone via SMS
3. User enters the OTP
4. Backend returns a JWT token
5. Frontend sends the JWT token with every protected request

### Sending the JWT token
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Endpoints

### 1. Request OTP
**POST** `/auth/request-otp` — No auth required

**Request Body:**
```json
{"phone": "0712345678"}
```

**Accepted phone formats:** `0712345678`, `712345678`, `254712345678`, `+254712345678`

**Success `200`:**
```json
{"message": "OTP sent successfully"}
```

**Errors:**
| Status | Message | Reason |
|--------|---------|--------|
| `400` | `"invalid request body"` | Body missing or not valid JSON |
| `400` | `"phone number is required"` | Phone field is empty |
| `400` | `"invalid Kenyan phone number format"` | Not a valid Kenyan number |
| `429` | `"too many OTP requests, please try again in 15minutes"` | Rate limit exceeded (5 requests per 15min) |

---

### 2. Verify OTP
**POST** `/auth/verify-otp` — No auth required

**Request Body:**
```json
{"phone": "0712345678", "otp": "484553"}
```

**Success `200`:**
```json
{
    "message": "OTP verified successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": "752239d0-1409-449e-a1f5-1f444b47165b",
        "phone": "254745678901",
        "role": "user"
    }
}
```

**Errors:**
| Status | Message | Reason |
|--------|---------|--------|
| `400` | `"invalid request body"` | Body missing or not valid JSON |
| `400` | `"phone number and OTP are required"` | Phone or OTP field empty |
| `400` | `"OTP not found or already used"` | OTP doesn't exist or was already used |
| `400` | `"OTP has expired"` | OTP is older than 5 minutes |
| `400` | `"invalid OTP"` | OTP doesn't match |

---

### 3. Health Check
**GET** `/health` — No auth required

**Success `200`:** `Kaya backend running`

---

## Houses

### 1. Get Houses
**GET** `/houses` — Auth optional

**Query Parameters:**
- `limit` (int): Items per page (default 20, max 100)
- `offset` (int): Pagination offset

**Success `200`:**
```json
[
  {
    "id": "uuid",
    "title": "Beautiful Villa",
    "description": "A spacious house...",
    "rent_price": 40000,
    "general_location": "Nairobi",
    "exact_location": null,
    "latitude": null,
    "longitude": null,
    "contact_number": null,
    "managed_by": "Agent Name",
    "landmarks": "Near mall",
    "distance_info": "5km from CBD",
    "is_unlocked": false,
    "media": [],
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
]
```
*Note: `exact_location`, `latitude`, `longitude`, and `contact_number` are only populated if the user is authenticated and has paid to unlock the house (`is_unlocked: true`). Otherwise, they are `null`.*

---

### 2. Get House by ID
**GET** `/houses/{id}` — Auth optional

**Success `200`:**
Returns a single house object identical to the list items above.

**Errors:**
- `404` — `"house not found"`
- `500` — Server errors

## Note
- `exact_location`, `latitude`, `longitude`, `contact_number` are `null` until user pays
- `is_unlocked: true` means user has paid and sensitive fields are visible
- Use `limit` and `offset` for pagination

---

## Protected Routes

All routes registered under the protected subrouter require a valid JWT token in the `Authorization` header.

**Format:**
```
Authorization: Bearer <token>
```

---

## Admin Routes (Protected)

These routes require both a valid JWT token and that the user's role is `admin`.

### 1. Create a House
**POST** `/admin/houses`

**Request Body:**
```json
{
  "title": "Stunning Villa",
  "description": "A very nice 4 br property.",
  "rent_price": 40000,
  "general_location": "Westlands",
  "exact_location": "Plot 42, Off Waiyaki Way",
  "latitude": -1.261,
  "longitude": 36.801,
  "contact_number": "0700111222",
  "managed_by": "Property Co.",
  "landmarks": "Near Safaricom HQ",
  "distance_info": "5km from CBD"
}
```

**Success `201`:**
Returns the complete created house object, including unmasked fields.

**Errors:**
- `400` — Invalid request body or validation failure
- `403` — Access denied: admin only

---

### 2. Update a House
**PUT** `/admin/houses/{id}`

**Request Body:**
Same as `POST /admin/houses`. Every field must be provided.

**Success `200`:**
Returns the updated house object.

**Errors:**
- `404` — House not found
- `400` — Invalid request body or house ID
- `403` — Access denied: admin only

---

### 3. Delete a House
**DELETE** `/admin/houses/{id}`

**Success `200`:**
```json
{"message": "house deleted successfully"}
```

**Errors:**
- `404` — House not found
- `403` — Access denied: admin only

Currently, the server is configured to protect routes added to the subrouter in `main.go`.

---

---

## Notes for Frontend
- OTP expires after **5 minutes** — show a countdown and allow resend
- JWT expires after **24 hours** — redirect to login on `401` response
- Phone numbers always returned in `254XXXXXXXXX` format
- No separate signup — user is created automatically on first OTP request
- More endpoints coming as backend is built