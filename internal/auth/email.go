package auth

import (
	//"fmt"
	"github.com/resend/resend-go/v2"
)

type EmailSender struct {
	client *resend.Client
	from string //email address to send from
}

// NewEmailSender creates a new EmailSender with the given Resend API key
func NewEmailSender(apiKey string) *EmailSender {
	client := resend.NewClient(apiKey)
	return &EmailSender{
		client: client,
		from:   "onboarding@resend.dev", //replace with actual domain in production
	}
}