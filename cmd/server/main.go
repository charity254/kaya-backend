package main

import (
	"log"
	"net/http"

	"github.com/charity254/kaya-backend/internal/auth"
	"github.com/charity254/kaya-backend/internal/config"   //custom config package
	"github.com/charity254/kaya-backend/internal/database" //database package
	"github.com/gorilla/mux"                               //handles HTTP routing
)

func main() {

	cfg := config.Load()
	port := cfg.Port
	if port == ""{
		port = "8080"
	}

	db := database.Connect(cfg.DBUrl)
	defer db.Close()

	authRepo := auth.NewRepository(db)
	authService := auth.NewService(authRepo, cfg.JWTSecret)
	authHandler := auth.NewHandler(authService)

	router := mux.NewRouter()

	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Kaya backend running"))
	}).Methods("GET")

	router.HandleFunc("/auth/request-otp", authHandler.RequestOTP).Methods("POST")
	router.HandleFunc("/auth/verify-otp", authHandler.VerifyOTP).Methods("POST")

	log.Println("Server starting on port:", port)
	err := http.ListenAndServe(":"+port, router)
	if err != nil{
		log.Fatal("Server failed to start:", err)
	}
}