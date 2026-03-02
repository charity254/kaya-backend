--Enable pgcrypto extension to allow gen_random_uuid() fot generating UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

--Users table: stores all registered users identified by phone number
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

--Houses table: stores all house listings with both public and masked private details
CREATE TABLE houses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    rent_price INTEGER NOT NULL,
    general_location TEXT NOT NULL,
    exact_location TEXT,             --masked until user pays
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    contact_number TEXT,            --masked untill user pays
    managed_by TEXT,
    landmarks TEXT,
    distance_info TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

--House media table: stores images and videos linked to a house listing
CREATE TABLE house_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

--Payments table: tracks M-Pesa payments made  by users to unlock house details
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    house_id UUID NOT NULL REFERENCES houses(id),
    amount INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('pending', 'paid', 'failed')),
    mpesa_receipt TEXT,
    transaction_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

--Unique index: ensures a user can only have one payment record per house
CREATE UNIQUE INDEX idx_payments_user_house ON payments(user_id, house_id);

--Index on general_location: speeds up filtering houses by area
CREATE INDEX idex_houses_general_location ON houses (general_location);

--Index on rent_price: speeds up filtering houses by price
CREATE INDEX idx_houses_rent_price ON houses (rent_price);

--Index on payments status: speeds up checking if a payment is successfull
CREATE INDEX idx_payments_status ON payments (status);

--Index on house_media house_id: speeds up fetching media for a specific house
CREATE INDEX idx_house_media_house_id ON house_media (house_id);