# Kaya API Documentation

Base URL: `https://kaya-xb37.onrender.com` [Backend]

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
Authorization: Bearer JWT_TOKEN
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
| Parameter | Type | Description |
|-----------|------|-------------|
| `general_location` | string | Filter by area e.g. Westlands |
| `min_rent` | number | Minimum rent in KES |
| `max_rent` | number | Maximum rent in KES |
| `limit` | number | Results per page (default: 20, max: 100) |
| `offset` | number | Results to skip (for pagination) |

**Success `200`:**
```json
{
  "count": 1,
  "houses": [
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
}
```
*Note: `exact_location`, `latitude`, `longitude`, and `contact_number` are only populated if the user is authenticated and has paid to unlock the house (`is_unlocked: true`). Otherwise, they are `null`.*

---

### 2. Get House by ID
**GET** `/houses/{id}` — Auth optional

**Success `200`:**
Returns a single house object identical to the list items above.

**Errors:**
| Status | Message | Reason |
|--------|---------|--------|
| `404` | `"house not found"` | No house with that ID |
| `500` | `"failed to get house"` | Server error |

---

## Notes for Houses
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

## Admin Routes (JWT + admin role required)

These routes require both a valid JWT token and that the user's role is `admin`.

### 1. Get All Houses (Admin View)
**GET** `/admin/houses` — Auth required (admin only)

Returns all houses with **no masking** — admin can see all fields including `exact_location`, `contact_number`, `latitude` and `longitude` for every house regardless of payment status.

**Success `200`:**
```json
{
  "count": 2,
  "houses": [
    {
      "id": "uuid",
      "title": "2 Bedroom Apartment in Westlands",
      "description": "Modern apartment",
      "rent_price": 25000,
      "general_location": "Westlands",
      "exact_location": "Apartment 4B, Westlands Road, Nairobi",
      "latitude": -1.2673,
      "longitude": 36.8026,
      "contact_number": "0712345678",
      "managed_by": "John Properties",
      "landmarks": "Near Sarit Centre",
      "distance_info": "2km from roundabout",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

**Errors:**
| Status | Message | Reason |
|--------|---------|--------|
| `401` | `"authorization header is required"` | No token provided |
| `403` | `"access denied: admin only"` | User is not an admin |
| `500` | `"failed to get houses"` | Server error |

---

### 2. Get House by ID (Admin View)
**GET** `/admin/houses/{id}` — Auth required (admin only)

Returns a single house with **no masking** — all fields visible.

**Success `200`:**
Returns a single house object identical to the admin list items above.

**Errors:**
| Status | Message | Reason |
|--------|---------|--------|
| `400` | `"house ID is required"` | No ID provided |
| `401` | `"authorization header is required"` | No token provided |
| `403` | `"access denied: admin only"` | User is not an admin |
| `404` | `"house not found"` | No house with that ID |
| `500` | `"failed to get house"` | Server error |

---

### 3. Create a House
**POST** `/admin/houses` — Auth required (admin only)

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

**Required fields:** `title`, `rent_price`, `general_location`

**Success `201`:**
Returns the complete created house object with all fields unmasked.

**Errors:**
| Status | Message | Reason |
|--------|---------|--------|
| `400` | `"invalid request body"` | Body missing or not valid JSON |
| `400` | `"title is required"` | Title field is empty |
| `400` | `"rent price must be greater than 0"` | Invalid rent price |
| `400` | `"general location is required"` | Location field is empty |
| `403` | `"access denied: admin only"` | User is not an admin |

---

### 4. Update a House
**PUT** `/admin/houses/{id}` — Auth required (admin only)

**Request Body:**
Same as `POST /admin/houses`. All fields must be provided.

**Success `200`:**
Returns the updated house object with all fields.

**Errors:**
| Status | Message | Reason |
|--------|---------|--------|
| `400` | `"invalid request body"` | Body missing or not valid JSON |
| `400` | `"house ID is required"` | No ID in URL |
| `403` | `"access denied: admin only"` | User is not an admin |
| `404` | `"house not found"` | No house with that ID |

---

### 5. Delete a House
**DELETE** `/admin/houses/{id}` — Auth required (admin only)

**Success `200`:**
```json
{"message": "house deleted successfully"}
```

**Errors:**
| Status | Message | Reason |
|--------|---------|--------|
| `403` | `"access denied: admin only"` | User is not an admin |
| `404` | `"house not found"` | No house with that ID |
| `500` | `"failed to delete house"` | Server error |

---

## Payments

### 1. Initiate Payment (STK Push)
**POST** `/payments/initiate` — Auth required

Initiates an M-PESA STK Push to the user's phone to unlock a specific house.

**Request Body:**
```json
{
  "house_id": "uuid-here",
  "phone": "254712345678"
}
```

**Success `200`:**
```json
{
  "message": "STK push sent. Enter your M-PESA PIN to complete payment",
  "payment_id": "uuid-here",
  "status": "pending"
}
```
*Note: If the house is already unlocked, it returns `status: paid` and a different message.*

**Errors:**
| Status | Message | Reason |
|--------|---------|--------|
| `400` | `"house_id is required"` | Missing house ID |
| `400` | `"phone is required"` | Missing phone number |
| `401` | `"unauthorized"` | No valid JWT token |
| `500` | `"failed to initiate payment"` | Server error |

---

### 2. M-PESA Callback Webhook
**POST** `/payments/callback` — No auth required (Called directly by Safaricom Daraja)

Handles the asynchronous payment result from Safaricom and unlocks the house automatically on success.

**Success `200`:**
```json
{
  "ResultCode": "0",
  "ResultDesc": "Accepted"
}
```

---

## General Notes
- OTP expires after **5 minutes** — show a countdown and allow resend
- JWT expires after **24 hours** — redirect to login on `401` response
- Phone numbers always returned in `254XXXXXXXXX` format
- No separate signup — user is created automatically on first OTP request
- Admin role must be assigned manually in the database by the backend team
