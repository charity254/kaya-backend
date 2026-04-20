package admin

import "fmt"

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func(s *Service) CreateHouse(input HouseInput) (*HouseResult, error) {
	if input.Title == "" {
		return nil, fmt.Errorf("title is required")
	}
	if input.RentPrice <= 0 {
		return nil, fmt.Errorf("rent price must be greater than 0")
	}
	if input.GeneralLocation == "" {
		return nil, fmt.Errorf("general location is required")
	}

	result, err := s.repo.CreateHouse(input)
	if err != nil {
		return nil, fmt.Errorf("admin.service.CreateHouse: failed to create house: %w", err)
	}
	return result, nil
}

func (s *Service) UpdateHouse(id string, input HouseInput) (*HouseResult, error) {
	if id == "" {
		return nil, fmt.Errorf("house ID is required")
	}
	if input.Title == "" {
		return  nil, fmt.Errorf("tittle is required")
	}
	if input.RentPrice <= 0 {
		return nil, fmt.Errorf("rent proce must be greater than 0")
	}
	if input.GeneralLocation == "" {
		return nil, fmt.Errorf("general location is required")
	}

	result, err := s.repo.UpdateHouse(id, input)
	if err != nil {
		return nil, fmt.Errorf("admin.service.UpdateHouse: failed to update house: %w", err)
	}
	return result, nil
}

func (s *Service) DeleteHouse(id string) (bool, error) {
	if id == "" {
		return false, fmt.Errorf("house ID is required")
	}
	deleted, err := s.repo.DeleteHouse(id)
	if err != nil {
		return false, fmt.Errorf("admin.service.DeleteHouse: failed to delete house: %w", err)
	}
	return deleted, nil
}
// GetHouses retrieves all house listings for admin view
// No masking applied - admin sees all details
func (s *Service) GetHouses() ([]HouseResult, error) {
	houses, err := s.repo.GetHouses()
	if err != nil {
		return nil, fmt.Errorf("admin.service.GetHouses: failed to get houses: %w", err)
	}
	return houses, nil
}

// GetHouseByID retrieves a single house by ID for admin view
// No masking applied - admin sees all details
// Returns nil if house not found
func (s *Service) GetHouseByID(id string) (*HouseResult, error) {
	if id == "" {
		return nil, fmt.Errorf("house ID is required")
	}

	house, err := s.repo.GetHouseByID(id)
	if err != nil {
		return nil, fmt.Errorf("admin.service.GetHouseByID: failed to get house: %w", err)
	}
	return house, nil
}