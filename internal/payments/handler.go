package payments

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/charity254/kaya-backend/internal/middleware"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}

type initiatePaymentRequest struct {
	HouseID	string	`json:"house_id"`
	Phone	string	`json:"phone"`
}

type initiatePaymentResponse struct {
	Message		string	`json:"message"`
	PaymentID	string	`json:"payment_id"`
	Status		string	`json:"status"`
}

type callbackRequest struct {
	Body struct {
		StkCallback struct {
			MerchantRequestID	string	`json:"MerchantRequestID"`
			CheckoutRequestID	string	`json:"CheckoutRequestID"`
			ResultCode			int		`json:"ResultCode"`
			ResultDesc			string	`json:"ResultDesc"`  //description
			CallbackMetadata	struct{
				Item []struct {
					Name	string		`json:"Name"`
					Value	interface{}	`json:"Value"`
				}	`json:"Item"`
			}	`json:"CallbackMetadata"`
		}	`json:"stkCallback"`
	}	`json:"Body"`
}

func (h *Handler) InitiatePayment(w http.ResponseWriter, r *http.Request) {		// InitiatePayment handles POST /payments/initiate. Requires authentication - user must be logged in
	userID, ok := middleware.GetUserID(r)
	if !ok {
		writeError(w, http.StatusUnauthorized, "unauthorized")
		return 
	}

	var req initiatePaymentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	if req.HouseID == "" {
		writeError(w, http.StatusBadRequest, "house_id is required")
		return
	}

	if req.Phone == "" {
		writeError(w, http.StatusBadRequest, "phone is required")
		return
	}

	payment, err := h.service.InitiatePayment(userID, req.HouseID, req.Phone)
	if err != nil {
		log.Printf("InitiatePayment error: %v", err)
		writeError(w, http.StatusInternalServerError, "failed to initiate payment")
		return
	}

	if payment.Status == "paid" {
		writeJSON(w, http.StatusOK, initiatePaymentResponse{
			Message: 	"house already unlocked",
			PaymentID: 	payment.ID,
			Status: 	payment.Status,
		})
		return
	}

	writeJSON(w, http.StatusOK, initiatePaymentResponse{
		Message: 	"STK push sent. Enter your M-PESA PIN to complete payment",
		PaymentID: 	payment.ID,
		Status: 	payment.Status,	
	})
}

func (h *Handler) HandleCallback(w http.ResponseWriter, r *http.Request) {  //HandleCallback handles POST /payments/callback
	var req callbackRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusOK, map[string]string{"ResultCode": "0", "ResultDesc": "Accepted"})
		return
	}

	checkoutRequestID 	:= req.Body.StkCallback.CheckoutRequestID
	resultCode 			:= req.Body.StkCallback.ResultCode

	mpesaReceipt := ""
	for _, item := range req.Body.StkCallback.CallbackMetadata.Item{
		if item.Name == "MpesaReceiptNumber" {
			if receipt, ok := item.Value.(string); ok {
				mpesaReceipt = receipt
			}
		}
	}

	err := h.service.HandleCallback(checkoutRequestID, resultCode, mpesaReceipt)
	if err != nil {
		//log error but return 20 to daraka to avoid retrying
		writeJSON(w, http.StatusOK, map[string]string{"ResultCode": "0", "ResultDesc": "Accepted"})
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"ResultCode": "0", "ResultDesc": "Accepted"})
}