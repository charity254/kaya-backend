package auth

import (
	"encoding/json"
	"net/http"

	"github.com/charity254/kaya-backend/internal/middleware"
)

//Handler handles all HTTP requests related to authentication
type Handler struct {
	service *Service
	otpLimiter *middleware.RateLimiter
}

//NewHandler creates a new auth handler with the given service
func NewHandler(service *Service, otpLimiter *middleware.RateLimiter) *Handler {
	return &Handler{service: service, otpLimiter: otpLimiter}
}

//requestOTPRequest defines the expected request body for the request OTP endpoint
type requestOTPRequest struct {
	Phone string `json:"phone"`
	Email string `json:"email"`
}

//requestOTPResponse defines the response body for the request OTP endpoint
type requestOTPResponse struct {
	Message string  `json:"message"`
}
//verifyOTPRequest defines the expected request body for the verify OTP endpoint
type verifyOTPRequest struct {
	Phone string `json:"phone"`
	Email string `json:"email"`
	OTP string `json:"otp"`
}

//verifyOTPResponse defines the response body for the verified OTP endpoint
type verifyOTPResponse struct {
	Message string 	  `json:"message"`
	Token string 	  `json:"token"`
	User userResponse `json:"user"`
} 

//userResponse defines the user info returned after successful authentication
type userResponse struct {
	ID    string `json:"id"`
	Phone string `json:"phone"`
	Role  string `json:"role"`
	Email string `json:"email"`
}

//writeJSON is a helper function that writes a JSON response with given status codes
func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

//writeError is a helper function that writes a JSON error response with given status codes
func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}

//RequestOTP handles POST /auth/request-otp. Validates the phone number, creates a user if needed, and sens an OTP
func (h *Handler) RequestOTP(w http.ResponseWriter, r *http.Request) {
	//Decode the request body into our request struct
	var req requestOTPRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	//Check that phone number was provided
	if req.Phone == "" {
		writeError(w, http.StatusBadRequest, "phone number is required")
		return
	}

	//Check that email address was provided
	if req.Email == "" {
	writeError(w, http.StatusBadRequest, "email is required")
	return
	}

	//check rate limit for this phone number before processing (5 requets per 15min per phone number)
	if !h.otpLimiter.IsAllowed(req.Phone) {
		writeError(w, http.StatusTooManyRequests, "too many OTP requests, please try again in 15minutes")
		return
	}

	//Call the service to handle the OTP request
	err := h.service.RequestOTP(req.Phone, req.Email)
	if err != nil {
		//if the error is about invalid phone format, return 400
		writeError(w, http.StatusBadRequest, err.Error())
		return 
	}

	//Return success response with OTP (**just for development testing**)
	writeJSON(w, http.StatusOK, requestOTPResponse{
		Message: "OTP sent successfully",
	})
}

//VerifyOTP handles POST /auth/verify-otp. Verifies the OTP and returns a success message if valid
func(h *Handler) VerifyOTP(w http.ResponseWriter, r *http.Request) {
	//Decode the request body into our request struct
	var req verifyOTPRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	//Check that both phone and OTP were provided
	if req.Phone == "" || req.OTP == "" || req.Email == "" {
		writeError(w, http.StatusBadRequest, "phone number, email and OTP are required")
		return
	}

	//Call the service to handle the OTP verification and JWT token
	token, userID, userPhone, userEmail, role, err := h.service.VerifyOTP(req.Phone, req.Email, req.OTP)
	if err != nil {
		//if OTP is invalid or expired return 400
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	//Return success response
	writeJSON(w, http.StatusOK, verifyOTPResponse{
		Message: "OTP verified successfully",
		Token: token,
		User: userResponse{
			ID: userID,
			Phone: userPhone,
			Email: userEmail,
			Role: role,
		},
	})
	
}