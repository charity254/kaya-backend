package auth

import (
	"database/sql"
	"time"
)

//Repository handles all database opertations related to authentication
type Repository struct {
	db *sql.DB
}

//NewRepository creates a new auth repository with the given database connection
func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

//Creates a new user with the given phone number if they don't already exists
func(r *Repository) CreateUserIfNotExists(phone string) (string, error) {
	var id string
	//insert new user, if phone exist: return existing user'd id
	query := `
	INSERT INTO users (phone)
	VALUES ($1)
	ON CONFLICT (phone) DO UPDATE SET updated_at = now()
	RETURNING id
	`
	err := r.db.QueryRow(query, phone).Scan(&id)
	if err != nil {
		return "", err
	}
	return id, nil
}

//SaveOTP stores a new OTP code for the given phone number with a 5 minute expiry, previous unused OTPs for this phone number are deleted first
func (r *Repository) SaveOTP(phone, code string) error {
	//Delete existing OTPs for this phone number before saving a new one
	_, err := r.db.Exec(`DELETE FROM otps WHERE phone = $1`, phone)
	if err != nil {
		return err
	}
	//insert new OTP with 5 minute expiry time
	query := `
	INSERT INTO otps (phone, code, expires_at)
	VALUES ($1, $2, $3)
	`
	expiresAt := time.Now().Add(5 * time.Minute)
	_, err = r.db.Exec(query, phone, code, expiresAt)
	return err
}

//GetOTP retrieves latest valid OTP for given phone number. Returns OTP and expiry time if found
func (r *Repository) GetOTP(phone string) (string, time.Time, error) {
	var code string
	var expiresAt time.Time

	query := `
	SELECT code, expires_at FROM otps
	WHERE phone = $1 AND used = false
	ORDER BY created_at DESC
	LIMIT 1
	`
	err := r.db.QueryRow(query, phone).Scan(&code, &expiresAt)
	if err != nil {
		return "", time.Time{}, err
	}
	return code, expiresAt, nil
}

//MarkOTOUsed marks an OTP as used
func (r *Repository) MarkOTPUsed(phone string) error {
	_, err := r.db.Exec(`UPDATE otps SET used = true WHERE phone = $1`, phone)
	return err
}