package database

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

func Connect(dbURL string) *sql.DB {
	//open a connection using the db URL
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("Failed to open database connection")
	}

	err = db.Ping() //tests connection through sending a message to db
	if err != nil {
		log.Fatal("Failed to reach database:", err)
	}
	log.Println("Database connected successfully")
	return db
}