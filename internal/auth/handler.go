package auth

import (
	"encoding/json"
	"net/http"
)

//Handler handles all HTTP requests related to authentication
type Handler struct {
	service *Service
}

//NewHandler creates a new auth handler with the given service
func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

//requestOTPRequest defines the expected request body for the request OTP endpoint
type requestOTPRequest struct {
	Phone string `json:"phone"`
}

//requestOTPResponse defines the response body for the request OTP endpoint
type requestOTPResponse struct {
	Message string  `json:"phone"`
}
//verifyOTPRequest defines the expected request body for the verify OTP endpoint
type verifyOTPRequest struct {
	Phone string `json:"phone"`
	OTP string `json:"otp"`
}

//verifyOTPResponse defines the response body for the verified OTP endpoint
type verifyOTPResponse struct {
	Message string `json:"message"`
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

	//Call the service to handle the OTP request
	err := h.service.RequestOTP(req.Phone)
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
	if req.Phone == "" || req.OTP == "" {
		writeError(w, http.StatusBadRequest, "phone number and OTP are required")
		return
	}

	//Call the service to handle the OTP verification
	_, err := h.service.VerifyOTP(req.Phone, req.OTP)
	if err != nil {
		//if OTP is invalid or expired return 400
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	//Return success response
	writeJSON(w, http.StatusOK, verifyOTPResponse{
		Message: "OTP verified successfully",
	})
	
}