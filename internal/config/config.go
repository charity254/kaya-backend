package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port string
	DBUrl string
	JWTSecret string
}

func Load() *Config{
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, reading from environment")
	}
	return &Config{
		Port: os.Getenv("PORT"),
		DBUrl: os.Getenv("DB_URL"),
		JWTSecret: os.Getenv("JWT_SECRET"),
	}
}