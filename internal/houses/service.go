package houses

import "time"

// HouseResponse represents a house listing returned to the client
// Sensitive fields are masked based on whether the user has paid
type HouseResponse struct {
	ID              string          `json:"id"`
	Title           string          `json:"title"`
	Description     string          `json:"description"`
	RentPrice       int             `json:"rent_price"`
	GeneralLocation string          `json:"general_location"`
	ExactLocation   *string         `json:"exact_location"` // null if not unlocked
	Latitude        *float64        `json:"latitude"`       // null if not unlocked
	Longitude       *float64        `json:"longitude"`      // null if not unlocked
	ContactNumber   *string         `json:"contact_number"` // null if not unlocked
	ManagedBy       string          `json:"managed_by"`
	Landmarks       string          `json:"landmarks"`
	DistanceInfo    string          `json:"distance_info"`
	IsUnlocked      bool            `json:"is_unlocked"` // true if user has paid
	Media           []MediaResponse `json:"media"`       // images and videos
	CreatedAt       time.Time       `json:"created_at"`
	UpdatedAt       time.Time       `json:"updated_at"`
}

// MediaResponse represents a media item returned to the client
type MediaResponse struct {
	ID        string `json:"id"`
	MediaURL  string `json:"media_url"`
	MediaType string `json:"media_type"`
}

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetHouses(filters HouseFilters, userID string) ([]HouseResponse, error) {
	// Set default limit if not provided to avoid returning all houses at once
	if filters.Limit <= 0 {
		filters.Limit = 20
	}

	// Cap the limit at 100 to prevent abuse
	if filters.Limit > 100 {
		filters.Limit = 100
	}

	// Get houses from the database
	houses, err := s.repo.GetHouses(filters)
	if err != nil {
		return nil, err
	}

	// Build the response for each house
	var response []HouseResponse
	for _, house := range houses {
		// Get media for this house
		media, err := s.repo.GetHouseMedia(house.ID)
		if err != nil {
			return nil, err
		}

		// Check if the user has paid for this house
		// If no userID (unauthenticated), isUnlocked is always false
		isUnlocked := false
		if userID != "" {
			isUnlocked, err = s.repo.HasUserPaidForHouse(userID, house.ID)
			if err != nil {
				return nil, err
			}
		}

		// Build the house response with masking applied
		houseResponse := buildHouseResponse(house, media, isUnlocked)
		response = append(response, houseResponse)
	}

	return response, nil
}

// GetHouseByID retrieves a single house by its ID
// userID is empty if the request is from an unauthenticated user
func (s *Service) GetHouseByID(id string, userID string) (*HouseResponse, error) {
	// Get the house from the database
	house, err := s.repo.GetHouseByID(id)
	if err != nil {
		return nil, err
	}

	// Return nil if house not found
	if house == nil {
		return nil, nil
	}

	// Get media for this house
	media, err := s.repo.GetHouseMedia(house.ID)
	if err != nil {
		return nil, err
	}

	// Check if the user has paid for this house
	isUnlocked := false
	if userID != "" {
		isUnlocked, err = s.repo.HasUserPaidForHouse(userID, house.ID)
		if err != nil {
			return nil, err
		}
	}

	// Build the house response with masking applied
	houseResponse := buildHouseResponse(*house, media, isUnlocked)
	return &houseResponse, nil
}

// buildHouseResponse builds a HouseResponse from a House and its media
// It applies masking logic based on whether the user has paid
func buildHouseResponse(house House, media []HouseMedia, isUnlocked bool) HouseResponse {
	// Build the media response
	var mediaResponse []MediaResponse
	for _, m := range media {
		mediaResponse = append(mediaResponse, MediaResponse{
			ID:        m.ID,
			MediaURL:  m.MediaURL,
			MediaType: m.MediaType,
		})
	}

	// Start building the house response
	response := HouseResponse{
		ID:              house.ID,
		Title:           house.Title,
		Description:     house.Description,
		RentPrice:       house.RentPrice,
		GeneralLocation: house.GeneralLocation,
		ManagedBy:       house.ManagedBy,
		Landmarks:       house.Landmarks,
		DistanceInfo:    house.DistanceInfo,
		IsUnlocked:      isUnlocked,
		Media:           mediaResponse,
		CreatedAt:       house.CreatedAt,
		UpdatedAt:       house.UpdatedAt,
	}

	// Only include sensitive fields if the user has paid
	if isUnlocked {
		response.ExactLocation = &house.ExactLocation
		response.Latitude = &house.Latitude
		response.Longitude = &house.Longitude
		response.ContactNumber = &house.ContactNumber
	}

	return response
}
