package houses

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/charity254/kaya-backend/internal/middleware"
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

func (h *Handler) GetHouses(w http.ResponseWriter, r *http.Request) {
	generalLocation := r.URL.Query().Get("general_location")

	minRent := 0
	if minRentStr := r.URL.Query().Get("min_rent"); minRentStr != "" {
		parsed, err := strconv.Atoi(minRentStr)
		if err != nil {
			writeError(w, http.StatusBadRequest, "min_rent must be a valid number")
			return
		}
		minRent = parsed
	}

	// Parse max_rent query param - default to 0 if not provided or invalid
	maxRent := 0
	if maxRentStr := r.URL.Query().Get("max_rent"); maxRentStr != "" {
		parsed, err := strconv.Atoi(maxRentStr)
		if err != nil {
			writeError(w, http.StatusBadRequest, "max_rent must be a valid number")
			return
		}
		maxRent = parsed
	}

	// Parse limit query param - default to 0 (service will set default of 20)
	limit := 0
	if limitStr := r.URL.Query().Get("limit"); limitStr != "" {
		parsed, err := strconv.Atoi(limitStr)
		if err != nil {
			writeError(w, http.StatusBadRequest, "limit must be a valid number")
			return
		}
		limit = parsed
	}

	// Parse offset query param - default to 0
	offset := 0
	if offsetStr := r.URL.Query().Get("offset"); offsetStr != "" {
		parsed, err := strconv.Atoi(offsetStr)
		if err != nil {
			writeError(w, http.StatusBadRequest, "offset must be a valid number")
			return
		}
		offset = parsed
	}

	// Build the filters struct from the query params
	filters := HouseFilters{
		GeneralLocation: generalLocation,
		MinRent:         minRent,
		MaxRent:         maxRent,
		Limit:           limit,
		Offset:          offset,
	}


	// Get the user ID from the request context if the user is logged in
	// Empty string if the user is not logged in
	userID, _ := middleware.GetUserID(r)

	// Call the service to get the houses
	houses, err := h.service.GetHouses(filters, userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get houses")
		return
	}

	// Return empty array instead of null if no houses found
	if houses == nil {
		houses = []HouseResponse{}
	}

	// Return the list of houses with a count
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"houses": houses,
		"count":  len(houses),
	})
}

// GetHouseByID handles GET /houses/{id}
// Returns a single house by ID with masking applied based on payment status
func (h *Handler) GetHouseByID(w http.ResponseWriter, r *http.Request) {
	// Extract the house ID from the URL path parameters
	vars := mux.Vars(r)
	id := vars["id"]

	// Validate that an ID was provided
	if id == "" {
		writeError(w, http.StatusBadRequest, "house ID is required")
		return
	}

	// Get the user ID from the request context if the user is logged in
	userID, _ := middleware.GetUserID(r)

	// Call the service to get the house
	house, err := h.service.GetHouseByID(id, userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get house")
		return
	}

	// Return 404 if house not found
	if house == nil {
		writeError(w, http.StatusNotFound, "house not found")
		return
	}

	// Return the house
	writeJSON(w, http.StatusOK, house)
}