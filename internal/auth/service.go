package auth

import (
	"errors"
	"fmt"
	"math/rand"
	"regexp"
	"time"
)

// Service handles all business logic related to authentication
type Service struct {
	repo *Repository
}

// NewService creates a new auth service with the given repository
func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

// normalizePhone normalizes a Kenyan phone number to the 254xxxxxxx format. It can accept formats: 07xxxxxx, 7xxxxxx, 2547xxxxxx, +2547xxxxx
func normalizePhone(phone string) (string, error) {
	//remove any spaces or hyphens from the phone number
	re := regexp.MustCompile(`[\s-]`)
	phone = re.ReplaceAllString(phone, "")

	//Match and normalize the different Kenyan phone number formats
	switch {
	case regexp.MustCompile(`^0[7][0-9]{8}$`).MatchString(phone):
		//Format: 07xxxxxxxx -> 2547xxxxxxxx
		return "254" + phone[1:], nil
	case regexp.MustCompile(`^[7][0-9]{8}$`).MatchString(phone):
		//Format: 7xxxxxxxx -> 2547xxxxxxxx
		return "254" + phone, nil
	case regexp.MustCompile(`^254[7][0-9]{8}$`).MatchString(phone):
		//Format: 2547xxxxxxxx -> Already correct format
		return phone, nil
	case regexp.MustCompile(`^\+254[7][0-9]{8}$`).MatchString(phone):
		//Format: +2547xxxxxxxx -> 2547xxxxxxxx
		return phone[1:], nil
	default:
		return "", errors.New("invalid phone number format")

	}
}

// generateOTP generates a random 6 digit OTP code
func generateOTP() string {
	//Seed the random number generator with current time
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	//Generate a number between 100000 and 999999
	return fmt.Sprintf("%06d", r.Intn(900000)+100000)
}

// RequestOTP validates the phone number, creates a user if needed, generates OTP and stores it. Returns the OTP (**mocked sms**)
func (s *Service) RequestOTP(phone string) error {
	//Normalize phone number
	normalizedPhone, err := normalizePhone(phone)
	if err != nil {
		return err
	}
	//Create user if they don't exist already
	_, err = s.repo.CreateUserIfNotExists(normalizedPhone)
	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}

	//Generate a new 6 digit OTP
	otp := generateOTP()

	//Save OTP to the database with 5 minute expiry
	err = s.repo.SaveOTP(normalizedPhone, otp)
	if err != nil {
		return fmt.Errorf("failed to save OTP: %w", err)
	}

	//TO DO: REPLACE THIS WITH ACTUAL SMS SENDING. CHECK(Africa's Talking / Twilio)
	//returning OTP directly for testing
	fmt.Printf("OTP for %s: %s\n", normalizedPhone, otp)
	return nil
}

// VerifyOTP checks if provided OTP is valid for the given phone number
// returns normalized phone number if valid
func (s *Service) VerifyOTP(phone, code string) (string, error) {
	//Normalize phone number first
	normalizedPhone, err := normalizePhone(phone)
	if err != nil {
		return "", err
	}

	//Retrieve stored OTP for this phone number
	storedCode, expiresAt, err := s.repo.GetOTP(normalizedPhone)
	if err != nil {
		return "", errors.New("OTP not found or already used")
	}

	//Check if the OTP has expired
	if time.Now().After(expiresAt) {
		return "", errors.New("OTP has expired")
	}

	//Check if provided OTP matches the stored one
	if code != storedCode {
		return "", errors.New("invalid OTP")
	}

	//Mark the OTP as used so it cannot be reused
	err = s.repo.MarkOTPUsed(normalizedPhone)
	if err != nil {
		return "", fmt.Errorf("failed to mark OTP as used: %w", err)
	}
	return normalizedPhone, nil
}
