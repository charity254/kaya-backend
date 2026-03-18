package houses

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

type House struct {
	ID          	string
	Title       	string
	Description 	string
	RentPrice       int
	GeneralLocation string
	ExactLocation 	string
	Latitude 		float64
	Longitude 		float64
	ContactNumber 	string
	ManagedBy 		string
	Landmarks 		string
	DistanceInfo 	string
	CreatedAt 		time.Time
	UpdatedAt 		time.Time
}
type HouseMedia struct {
	ID 			string
	HouseID		string
	MediaURL	string
	MediaType	string
	CreatedAt	string
}
type HouseFilters struct {
	GeneralLocation	string
	MinRent			int
	MaxRent			int
	Limit			int
	Offset			int
}

func(r *Repository) GetHouses(filters HouseFilters) ([]House, error) {
	query := `
		SELECT id, title, description, rent_price, general_location, exact_location, latitude, longitude, contact_number, managed_by, landmarks, distance_info, created_at, updated_at
		FROM houses
		WHERE 1=1
	`
	args := []interface{}{}
	argCount := 1

	if filters.GeneralLocation != "" {
		query += fmt.Sprintf(" AND general_location ILIKE $%d", argCount)
		args = append(args, "%"+filters.GeneralLocation+"%")
		argCount++
	}
	if filters.MinRent > 0 {
    query += fmt.Sprintf(" AND rent_price >= $%d", argCount)
    args = append(args, filters.MinRent)
    argCount++
	}
	if filters.MaxRent > 0 {
    query += fmt.Sprintf(" AND rent_price <= $%d", argCount)
    args = append(args, filters.MaxRent)
    argCount++
	}

	query += " ORDER BY created_at DESC"

	query += fmt.Sprintf(" LIMIT $%d OFFSET $%d", argCount, argCount+1)
	args = append(args, filters.Limit, filters.Offset)

	rows, err := r.db.Query(query, args...)
	if err != nil {
		return nil, fmt.Errorf("houses.repository.GetHouses: failed to query houses: %w", err)
	}
	defer rows.Close()

	var houses []House
	for rows.Next() {
		var h House
		var exactLocation, contactNumber, description, managedBy, landmarks, distanceInfo sql.NullString
		var latitude, longitude sql.NullFloat64

		err := rows.Scan(
			&h.ID, &h.Title, &description, &h.RentPrice, &h.GeneralLocation, &exactLocation, &latitude, &longitude, &contactNumber, &managedBy, &landmarks, &distanceInfo, &h.CreatedAt, &h.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("houses.repository.GetHouses: failed to scan house: %w", err)
		}
		h.Description = description.String
		h.ExactLocation = exactLocation.String
		h.Latitude = latitude.Float64
		h.Longitude = longitude.Float64
		h.ContactNumber = contactNumber.String
		h.ManagedBy = managedBy.String
		h.Landmarks = landmarks.String
		h.DistanceInfo = distanceInfo.String

		houses = append(houses, h)
	}
	return houses, nil
}

func (r *Repository) GetHouseByID(id string) (*House, error) {
	query := `
		SELECT id, title, description, rent_price, general_location, exact_location, latitude, longitude, contact_number, managed_by, landmarks,distance_info, created_at, updated_at
		FROM houses
		WHERE id = $1
	`
	var h House
	var exactLocation, contactNumber, description, managedBy, landmarks, distanceInfo sql.NullString
	var latitude, longitude sql.NullFloat64

	err := r.db.QueryRow(query, id).Scan(
		&h.ID, &h.Title, &description, &h.RentPrice, &h.GeneralLocation,
		&exactLocation, &latitude, &longitude, &contactNumber,
		&managedBy, &landmarks, &distanceInfo, &h.CreatedAt, &h.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("houses.repository.GetHouseByID: failed to query house: %w", err)
	}

	h.Description = description.String
	h.ExactLocation = exactLocation.String
	h.Latitude = latitude.Float64
	h.Longitude = longitude.Float64
	h.ContactNumber = contactNumber.String
	h.ManagedBy = managedBy.String
	h.Landmarks = landmarks.String
	h.DistanceInfo = distanceInfo.String

	return &h, nil
}

func (r *Repository) GetHouseMedia(houseID string) ([]HouseMedia, error) {
	query := `
		SELECT id, house_id, media_url, media_type, created_at
		FROM house_media
		WHERE house_id = $1
		ORDER BY created_at ASC
	`
	rows, err := r.db.Query(query, houseID)
	if err != nil {
		return nil, fmt.Errorf("houses.repository.GetHouseMedia: failed to query media: %w", err)
	}
	defer rows.Close()

	var media []HouseMedia
	for rows.Next() {
		var m HouseMedia
		err := rows.Scan(&m.ID, &m.HouseID, &m.MediaURL, &m.MediaType, &m.CreatedAt)
		if err != nil {
			return nil, fmt.Errorf("houses.repository.GetHouseMedia: failed to scan media: %w", err)
		}
		media = append(media, m)
	}
	return media, nil
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
		return false, nil // no payment found
	}
	if err != nil {
		return false, fmt.Errorf("houses.repository.HasUserPaidForHouse: failed to check payment: %w", err)
	}
	return true, nil
}