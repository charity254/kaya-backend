--Drop indexes first before dropping tables
DROP INDEX IF EXISTS idx_house_media_house_id;
DROP INDEX IF EXISTS idx_payments_status;
DROP INDEX IF EXISTS idx_houses_rent_price;
DROP INDEX IF EXISTS idx_houses_general_location;
DROP INDEX IF EXISTS idx_payments_user_house;

--Drop tables in reverse order to respect foreign key dependencies
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS house_media;
DROP TABLE IF EXISTS houses;
DROP TABLE IF EXISTS users;