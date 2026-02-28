-- OTP table: stores one time passwords for phone number authentication
CREATE TABLE otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index on phone: speeds up looking up OTPs by phone number
CREATE INDEX idx_otps_phone ON otps(phone);

-- Index on expires_at: speeds up cleaning up expired OTPs
CREATE INDEX idx_otps_expires_at ON otps(expires_at);