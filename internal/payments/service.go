package payments

import "fmt"

type Service struct {
	repo 		*Repository
	mpesaClient	*MpesaClient
}

func NewService(repo *Repository, mpesaClient *MpesaClient) *Service {
	return &Service{repo: repo, mpesaClient: mpesaClient}
}

func (s *Service) InitiatePayment(userID, houseID, phone string) (*Payment, error) {
	existingPayment, err := s.repo.GetPaymentByUserAndHouse(userID, houseID)
	if err != nil {
		return nil, fmt.Errorf("payments.service.InitiatePayment: failed to check existing payment: %w", err)
	}
	if existingPayment != nil && existingPayment.Status == "paid" {
		return existingPayment, nil
	}
	amount := 400

	checkoutRequestID, err := s.mpesaClient.InitiateSTKPush(phone, amount, houseID)
	if err != nil {
		return nil, fmt.Errorf("payments.service.InitiatePayment: failed to initiate STK push: %w", err)
	}

	payment, err := s.repo.CreatePayment(userID, houseID, checkoutRequestID, amount)
	if err != nil {
		return nil, fmt.Errorf("payments.servive.InitiatePayment: failed to create payment: %w", err)
	}
	return payment, nil
}

func (s *Service) HandleCallback(checkoutRequestID string, resultCode int, mpesaReceipt string) error {
	payment, err := s.repo.GetPaymentByCheckoutRequestID(checkoutRequestID)
	if err != nil {
		return fmt.Errorf("payments.service.HandleCallBack: failed to get payment: %w", err )
	}
	if payment == nil {
		return nil
	}
	if payment.Status == "paid" {
		return nil
	}
	status := "failed"
	if resultCode == 0{
		status = "paid"
	}

	err = s.repo.UpdatePaymentStatus(checkoutRequestID, status, mpesaReceipt)
	if err != nil {
		return fmt.Errorf("payments.service.HandleCallBack: failed to update payment: %w", err)
	}
	return nil
}