--Drop indexes first before dropping the table
DROP INDEX IF EXISTS idx_otps_expires_at;
DROP INDEX IF EXISTS idx_otps_phone;

--Drop the otps table
DROP TABLE IF EXISTS otps;