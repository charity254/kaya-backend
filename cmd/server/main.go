package main

import (
	"log"
	"net/http"
	
	"github.com/gorilla/mux"   //handles HTTP routing
	"github.com/charity254/kaya-backend/internal/config" //custom config package
	"github.com/charity254/kaya-backend/internal/database"//database package
)

func main() {

	cfg := config.Load()
	port := cfg.Port
	if port == ""{
		port = "8080"
	}

	db := database.Connect(cfg.DBUrl)

	defer db.Close()

	router := mux.NewRouter()

	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Kaya backend running"))
	}).Methods("GET")

	log.Println("Server  starting on port:", port)

		err := http.ListenAndServe(":"+port, router)
	
			if err != nil{
				log.Fatal("Server failed to start:", err)
	}
}