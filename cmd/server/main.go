package main

import (
	"log"
	"net/http"
	"time"

	"github.com/charity254/kaya-backend/internal/auth"
	"github.com/charity254/kaya-backend/internal/config"     //custom config package
	"github.com/charity254/kaya-backend/internal/database"   //database package
	"github.com/charity254/kaya-backend/internal/houses"
	"github.com/charity254/kaya-backend/internal/middleware" //authentication
	"github.com/gorilla/mux"                                 //handles HTTP routing
	"github.com/rs/cors"
)

func main() {

	cfg := config.Load()
	port := cfg.Port
	if port == "" {
		port = "8080"
	}

	db := database.Connect(cfg.DBUrl)
	defer db.Close()

	otpLimiter := middleware.NewRateLimiter(5, 15*time.Minute)

	authRepo := auth.NewRepository(db)
	authService := auth.NewService(authRepo, cfg.JWTSecret)
	authHandler := auth.NewHandler(authService, otpLimiter)

	housesRepo := houses.NewRepository(db)
	housesService := houses.NewService(housesRepo)
	housesHandler := houses.NewHandler(housesService)

	router := mux.NewRouter()

	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Kaya backend running"))
	}).Methods("GET")

	router.HandleFunc("/auth/request-otp", authHandler.RequestOTP).Methods("POST")
	router.HandleFunc("/auth/verify-otp", authHandler.VerifyOTP).Methods("POST")

	router.HandleFunc("/houses", housesHandler.GetHouses).Methods("GET")
	router.HandleFunc("/houses/{id}", housesHandler.GetHouseByID).Methods("GET")

	//protected routes (JWT authentication required). Every request to this routes must have a valid JWT  token
	protected := router.PathPrefix("").Subrouter()
	protected.Use(middleware.AuthMiddleware(cfg.JWTSecret))


	c := cors.New(cors.Options{
    AllowedOrigins: []string{"*"}, // Replace with frontend URL before launch
    AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
    AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
    ExposedHeaders: []string{"Link"},
    AllowCredentials: false, // Must be false when AllowedOrigins is "*"
    MaxAge:           300,
})

	handler := c.Handler(router)

	log.Println("Server starting on port:", port)
	err := http.ListenAndServe(":"+port, handler)
	if err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
