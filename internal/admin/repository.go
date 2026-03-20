package admin

import (
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

type HouseInput struct { //contains data to create or update a house listing
	Title	    	string
	Description		string
	RentPrice		int
	GeneralLocation	string
	ExactLocation	string
	Latitude		float64
	Longitude		float64
	ContactNumber	string
	ManagedBy		string
	Landmarks		string
	DistanceInfo	string
}

type HouseResult struct { //contains the data returned after creating or updating a house
	ID 				string		`json:"id"`
	Title			string		`json:"title"`
	Description		string		`json:"description"`
	RentPrice		int			`json:"rent_price"`
	GeneralLocation	string		`json:"general_location"`
	ExactLocation	string		`json:"exact_location"`
	Latitude		float64		`json:"latitude"`
	Longitude		float64		`json:"longitude"`
	ContactNumber	string		`json:"contact_number"`
	ManagedBy		string		`json:"managed_by"`
	Landmarks		string		`json:"landmarks"`
	DistanceInfo	string		`json:"distance_info"`
	CreatedAt		time.Time	`json:"created_at"`
	UpdatedAt		time.Time	`json:"updated_at"`
}

func (r *Repository) CreateHouse(input HouseInput) (*HouseResult, error) {
	query := `
		INSERT INTO houses (
			title, description, rent_price, general_location, exact_location, latitude, longitude, contact_number, managed_by, landmarks, distance_info
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 
		)
		RETURNING id, title, description, rent_price, general_location, exact_location, latitude, longitude, contact_number, managed_by, landmarks, distance_info, created_at, updated_at
	`

	var result HouseResult
	var exactLocation, contactNumber, description, managedBy, landmarks, distanceInfo sql.NullString
	var latitude, longitude sql.NullFloat64

	err := r.db.QueryRow(query,
		input.Title, input.Description, input.RentPrice, input.GeneralLocation, input.ExactLocation, input.Latitude, input.Longitude, input.ContactNumber, input.ManagedBy, input.Landmarks, input.DistanceInfo,
	).Scan(
		&result.ID, &result.Title, &description, &result.RentPrice, &result.GeneralLocation, &exactLocation, &latitude, &longitude, &contactNumber, &managedBy, &landmarks, &distanceInfo, &result.CreatedAt, &result.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("admin.repository.CreateHouse: failed to create house: %w", err)
	}
	result.Description = description.String
	result.ExactLocation = exactLocation.String
	result.Latitude = latitude.Float64
	result.Longitude = longitude.Float64
	result.ContactNumber = contactNumber.String
	result.ManagedBy = managedBy.String
	result.Landmarks = landmarks.String
	result.DistanceInfo = distanceInfo.String

	return &result, nil
}

func (r *Repository) UpdateHouse(id string, input HouseInput) (*HouseResult, error) {
	query := `
		UPDATE houses SET 
		title = $1, description = $2, rent_price = $3, general_location = $4, exact_location = $5, latitude = $6, longitude = $7, contact_number = $8, managed_by = $9, landmarks = $10, distance_info = $11, updated_at = now()
		WHERE id = $12
		RETURNING id, title, description, rent_price, general_location, exact_location, latitude, longitude, contact_number, managed_by, landmarks, distance_info, created_at, updated_at
	`
	var result HouseResult
	var exactLocation, contactNumber, description, managedBy, landmarks, distanceInfo sql.NullString
	var latitude, longitude sql.NullFloat64

	err := r.db.QueryRow(query,
		input.Title, input.Description, input.RentPrice, input.GeneralLocation, input.ExactLocation, input.Latitude, input.Longitude, input.ContactNumber, input.ManagedBy, input.Landmarks, input.DistanceInfo, id,
	). Scan(
		&result.ID, &result.Title, &description, &result.RentPrice, &result.GeneralLocation, &exactLocation, &latitude, &longitude, &contactNumber, &managedBy, &landmarks, &distanceInfo, &result.CreatedAt, &result.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil //houses not found
	}
	if err != nil {
		return nil, fmt.Errorf("admin.repository.UpdateHouse: failed to update house %w", err)
	}
	//Handle nullable fields
	result.Description = description.String
	result.ExactLocation = exactLocation.String
	result.Latitude = latitude.Float64
	result.Longitude = longitude.Float64
	result.ContactNumber = contactNumber.String
	result.ManagedBy = managedBy.String
	result.Landmarks = landmarks.String
	result.DistanceInfo = distanceInfo.String

	return &result, nil
}

func (r *Repository) DeleteHouse(id string) (bool, error) {
	query := `DELETE FROM houses WHERE id = $1`

	result, err := r.db.Exec(query, id)
	if err != nil {
		return false, fmt.Errorf("admin.Repository.DeleteHouse: failed to delete house: %w", err)
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return false, fmt.Errorf("admin.Repository.DeleteHouse: failed to get rows affectedL %w", err)
	}
	return rowsAffected > 0, nil
}