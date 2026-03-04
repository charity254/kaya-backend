# Kaya API Documentation

Base URL:
- Production: `https://kaya-backend-production-beb0.up.railway.app`
- Development: `http://localhost:8080`

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
        "phone": "254745678901"
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

## Notes for Frontend
- OTP expires after **5 minutes** — show a countdown and allow resend
- JWT expires after **24 hours** — redirect to login on `401` response
- Phone numbers always returned in `254XXXXXXXXX` format
- No separate signup — user is created automatically on first OTP request
- More endpoints coming as backend is built