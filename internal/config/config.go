package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port 				string
	DBUrl 				string
	JWTSecret 			string
	MpesaConsumerKey    string // Daraja API consumer key
	MpesaConsumerSecret string // Daraja API consumer secret
	MpesaShortcode      string // M-Pesa paybill or till number
	MpesaPasskey        string // Daraja API passkey for STK push
	MpesaCallbackURL    string // base URL for M-Pesa callbacks
	SupabaseURL			string
	ResendAPIKey		string //API Key for sending OTP emails via Resend
}

func Load() *Config{
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, reading from environment")
	}
	return &Config{
		Port: 				 os.Getenv("PORT"),
		DBUrl: 				 os.Getenv("DB_URL"),
		JWTSecret: 			 os.Getenv("JWT_SECRET"),
		MpesaConsumerKey:    os.Getenv("MPESA_CONSUMER_KEY"),
		MpesaConsumerSecret: os.Getenv("MPESA_CONSUMER_SECRET"),
		MpesaShortcode:      os.Getenv("MPESA_SHORTCODE"),
		MpesaPasskey:        os.Getenv("MPESA_PASSKEY"),
		MpesaCallbackURL:    os.Getenv("MPESA_CALLBACK_BASE_URL"),
		SupabaseURL: 		 os.Getenv("SUPABASE_URL"),	
		ResendAPIKey:        os.Getenv("RESEND_API_KEY"),	
	}
}