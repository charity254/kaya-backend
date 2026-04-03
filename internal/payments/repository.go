package payments

import (
	"context"
	"database/sql"
	"fmt"
	"time"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

type Payment struct {
	ID					string  //unique identifier
	UserID				string //user making payment
	HouseID				string //house to be unlocked
	Amount				int    //amount in KES
	Status				string //pending, paid, failed
	MpesaReceipt		string //Mpesa receipt no.(after payment)
	TransactionID		string //internal transaction id
	CheckoutRequestID	string //Daraja checkout id
	CreatedAt			time.Time
}

func (r *Repository) CreatePayment(userID, houseID, checkoutRequestID string, amount int) (*Payment, error) {  //Returns the created payment with its generated ID
	query := `
		INSERT INTO payments (user_id, house_id, amount, status, transaction_id)
		VALUES ($1, $2, $3, 'pending', $4)
		RETURNING id, user_id, house_id, amount, status, created_at
		`
	//use checkoutRequestID as transaction ID
	var p Payment
	 err := r.db.QueryRow(query, userID, houseID, amount, checkoutRequestID).Scan(
		&p.ID, &p.UserID, &p.HouseID, &p.Amount, &p.Status, &p.CreatedAt,
	 )
	 if err != nil {
		return nil, fmt.Errorf("payments.repository.CreatePayment: failed to create payment: %w", err)
	 }

	 p.CheckoutRequestID = checkoutRequestID
	 return &p, nil
}

func (r *Repository) GetPaymentByCheckoutRequestID(checkoutRequestID string) (*Payment, error) { //retrieves a payment by its Daraja checkout request ID
	query := `
		SELECT id, user_id, house_id, amount, status,
			COALESCE(mpesa_receipt, ''),
			COALESCE(transaction_id, ''),
			created_at
		FROM payments
		WHERE transaction_id = $1
		LIMIT 1
	`

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var p Payment
	err := r.db.QueryRowContext(ctx, query, checkoutRequestID).Scan(
		&p.ID, &p.UserID, &p.HouseID, &p.Amount, &p.Status,
		&p.MpesaReceipt, &p.TransactionID, &p.CreatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil ///no payment found
	}
	if err != nil {
		return nil, fmt.Errorf("payments.repository.GetPaymentByCheckoutRequestID: failed to get payment: %w", err)
	}

	p.CheckoutRequestID = checkoutRequestID
	return &p, nil
}

func (r *Repository) UpdatePaymentStatus(checkoutRequestID, status, mpesaReceipt string) error {  //updates the status of a payment after M-Pesa callback. For successful payments it also stores the M-Pesa receipt number
	query := `
		UPDATE payments
		SET status =$1, mpesa_receipt = $2
		WHERE transaction_id = $3
	`

	_, err := r.db.Exec(query, status, mpesaReceipt, checkoutRequestID)
	if err != nil {
		return fmt.Errorf("paymants.repository.UpdatePaymentStatus: failed to update payment: %w", err)
	}
	return nil
}
func (r *Repository) HasUserPaidForHouse(userID, houseID string) (bool, error) {
	query := `
		SELECT id FROM payments
		WHERE user_id = $1
		AND house_id = $2
		AND status = 'paid'
		LIMIT 1
		`
	var id string
	err := r.db.QueryRow(query, userID, houseID).Scan(&id)
	if err == sql.ErrNoRows {
		return false, nil  //no paymnets found
	}
	if err != nil {
		return false, fmt.Errorf("payments.repository.HasUserPaidForHouse: failed to check payment: %w", err)
	}
	return true, nil
}

func (r *Repository) GetPaymentByUserAndHouse(userID, houseID string) (*Payment, error) {
	query := `
	SELECT id, user_id, house_id, amount, status,
		COALESCE(mpesa_receipt, ''), 
		COALESCE(transaction_id, ''),
		created_at
	FROM payments
	WHERE user_id = $1
	AND house_id = $2
	ORDER BY created_at DESC
	LIMIT 1
	`

	var p Payment
	err := r.db.QueryRow(query, userID, houseID).Scan(
		&p.ID, &p.UserID, &p.HouseID, &p.Amount, &p.Status,
		&p.MpesaReceipt, &p.TransactionID, &p.CreatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil //no paymnet found
	}
	if err != nil {
		return nil, fmt.Errorf("payments.repository.GetPaymentByUserAndHouse: failed to get payment: %w", err)
	}
	return &p, nil
}