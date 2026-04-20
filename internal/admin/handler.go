package admin

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
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

type houseRequest struct { //expected request body for creating or updating a house (POST /admin/houses)
	Title           string  `json:"title"`
	Description     string  `json:"description"`
	RentPrice       int     `json:"rent_price"`
	GeneralLocation string  `json:"general_location"`
	ExactLocation   string  `json:"exact_location"`
	Latitude        float64 `json:"latitude"`
	Longitude       float64 `json:"longitude"`
	ContactNumber   string  `json:"contact_number"`
	ManagedBy       string  `json:"managed_by"`
	Landmarks       string  `json:"landmarks"`
	DistanceInfo    string  `json:"distance_info"`
}

func(h *Handler) CreateHouse(w http.ResponseWriter, r *http.Request) {  //handles POST /admin/houses
	var req houseRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return 
	}
	input := HouseInput{
		Title:           req.Title,
		Description:     req.Description,
		RentPrice:       req.RentPrice,
		GeneralLocation: req.GeneralLocation,
		ExactLocation:   req.ExactLocation,
		Latitude:        req.Latitude,
		Longitude:       req.Longitude,
		ContactNumber:   req.ContactNumber,
		ManagedBy:       req.ManagedBy,
		Landmarks:       req.Landmarks,
		DistanceInfo:    req.DistanceInfo,
	}
	result, err := h.service.CreateHouse(input)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, http.StatusCreated, result)
}

func (h *Handler) UpdateHouse(w http.ResponseWriter, r *http.Request) { //PUT /admin/houses/{id}
	vars := mux.Vars(r)
	id := vars["id"]

	if id == "" {
		writeError(w, http.StatusBadRequest, "house ID is required")
		return
	}

	var req houseRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	input := HouseInput{
		Title:           req.Title,
		Description:     req.Description,
		RentPrice:       req.RentPrice,
		GeneralLocation: req.GeneralLocation,
		ExactLocation:   req.ExactLocation,
		Latitude:        req.Latitude,
		Longitude:       req.Longitude,
		ContactNumber:   req.ContactNumber,
		ManagedBy:       req.ManagedBy,
		Landmarks:       req.Landmarks,
		DistanceInfo:    req.DistanceInfo,
	}

	result, err := h.service.UpdateHouse(id, input)
	if err != nil {
		writeError(w, http.StatusNotFound, "house not found")
		return
	}
	writeJSON(w, http.StatusOK, result)
}

func (h *Handler) DeleteHouse(w http.ResponseWriter, r *http.Request) { //DELETE /admin/houses/{id}
	vars := mux.Vars(r)
	id := vars["id"]

	if id == "" {
		writeError(w, http.StatusBadRequest, "house ID is required")
		return
	}

	deleted, err := h.service.DeleteHouse(id)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete house")
		return
	}
	if !deleted {
		writeError(w, http.StatusNotFound, "house not found")
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{
		"message":"house deleted successfully",
	})
}

// GetHouses handles GET /admin/houses
// Returns all houses with no masking - admin only
func (h *Handler) GetHouses(w http.ResponseWriter, r *http.Request) {
	// Call the service to get all houses
	houses, err := h.service.GetHouses()
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get houses")
		return
	}

	// Return empty array instead of null if no houses found
	if houses == nil {
		houses = []HouseResult{}
	}

	// Return all houses with full details - no masking
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"houses": houses,
		"count":  len(houses),
	})
}

// GetHouseByID handles GET /admin/houses/{id}
// Returns a single house with no masking - admin only
func (h *Handler) GetHouseByID(w http.ResponseWriter, r *http.Request) {
	// Extract the house ID from the URL path parameters
	vars := mux.Vars(r)
	id := vars["id"]

	// Validate that an ID was provided
	if id == "" {
		writeError(w, http.StatusBadRequest, "house ID is required")
		return
	}

	// Call the service to get the house
	house, err := h.service.GetHouseByID(id)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get house")
		return
	}

	// Return 404 if house not found
	if house == nil {
		writeError(w, http.StatusNotFound, "house not found")
		return
	}

	// Return the house with full details - no masking
	writeJSON(w, http.StatusOK, house)
}