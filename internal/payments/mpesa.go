package payments

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

type MpesaClient struct {  //handles all communication with Daraja API
	consumerKey		string  //Daraja API consumer key
	consumerSecret	string  //Daraja API consumer secret
	shortcode		string  //Payill or Till number
	passkey			string  //Daraja API pass key for STK push
	callbackURL		string  // URL Safaricom will call after payment
	baseURL			string  //Daraja API base URL(sandbox)
}

type accesTokenResponse struct {  //Daraja OAuth endpoint
	AccessToken	string	`json:"access_token"`
	ExpiresIn	string	`json:"expires_in"`
}

type stkPushRequest struct {   //request body for STK push
	BusinessShortCode string 	`json:"BusinessShortCode"` //paybill
	Password		  string	`json:"Password"`  	// base64 encoded password
	Timestamp		  string	`json:"Timestamp"`  //current timestamp
	TransactionType	  string	`json:"TransactionType"`  //type of transaction
	Amount			  int		`json:"Amount"`  //amount in KES
	PartyA            string	`json:"PartyA"` //customer phone  number
	PartyB			  string	`json:"PartyB"` //paybill number
	PhoneNumber		  string	`json:"PhoneNumber"` //customer phone number
	CallBackURL		  string	`json:"CallBackURL"` //callback URL
	AccountReference  string	`json:"AccountReferene"` //account reference
	TransactionDesc	  string	`json:"TransactionDesc"` //transaction description
}

type stkPushResponse struct {   ///response from Daraja STK Push endpoint
	MerchantRequestID	string	`json:"MerchantRequestID"`  // unique request ID
	CheckoutRequestID	string	`json:"CheckoutRequestID"`  // unique checkout ID
	ResponseCode		string	`json:"ResponseCode"` //0 means success
	ResponseDescription	string	`json:"ResponseDescription"`  //description
	CustomerMessage		string	`json:"CustomerMessage"` //Message to customer
}

func NewMpesaClient(consumerKey, consumerSecret, shortcode, passkey, callbackURL string) *MpesaClient {
	return &MpesaClient{
		consumerKey:    consumerKey,
		consumerSecret: consumerSecret,
		shortcode:      shortcode,
		passkey:        passkey,
		callbackURL:    callbackURL,
		baseURL: 		"https://sandbox.safaricom.co.ke",
	}
}

func (m *MpesaClient) getAccessToken() (string, error) {
	//build the OAuth URL
	url := fmt.Sprintf("%s/oauth/v1/generate?grant_type=client_credentials", m.baseURL)

	//create http request
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", fmt.Errorf("payments.mpesa.getAccessToken: failed to create request: %w", err)
	}

	//consumer key and secret encoded as base64 for basic auth
	credentials := base64.StdEncoding.EncodeToString(
		[]byte(m.consumerKey + ":" + m.consumerSecret),
	)
	req.Header.Set("Authorization", "Basic " + credentials)

	//send request
	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("payments.mpesa.getAccessToken: failedto send request: %w", err)
	}
	defer resp.Body.Close()

	//read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("payments.mpesa.getAccessToken: failed to read response: %w", err)
	}

	//parse response
	var tokenResp accesTokenResponse
	if err := json.Unmarshal(body, &tokenResp); err != nil {
		return "", fmt.Errorf("payments.mpesa.getAccessToken: failed to parse response: %w", err)
	}
	if tokenResp.AccessToken == "" {
		return "", fmt.Errorf("payments.mpesa.getAccessToken: empty access token received")
	}
	return tokenResp.AccessToken, nil
}

func (m *MpesaClient) generatePassword(timestamp string) string {   //generates STK push password (base64(shortcode + passkey + timestamp))
	rawPassword := m.shortcode + m.passkey + timestamp
	return base64.StdEncoding.EncodeToString([]byte(rawPassword))
}

func generateTimestamp() string {  //Format: YYYYMMDDHHmmss
	return time.Now().Format("20060102150405")
}

func (m *MpesaClient) InitiateSTKPush(phone string, amount int, houseID string) (string, error) {   //sends an STK Push request to the customer's phone. Returns the CheckoutRequestID used to track the payment
	//get new access token
	accessToken, err := m.getAccessToken() //cache upto 1 hour in production
	if err != nil {
		return "", fmt.Errorf("payment.mpesa.InitiateSTKPush: failed to get access token: %w", err)
	}

	timestamp := generateTimestamp()
	password := m.generatePassword(timestamp)

	//the STK Push request build
	payload := stkPushRequest{
		BusinessShortCode:	m.shortcode,
		Password: 			password,
		Timestamp: 			timestamp,	
		TransactionType: 	"CustomerPayBillOnline",
		Amount: 			amount,
		PartyA: 			phone,
		PartyB: 			m.shortcode,
		PhoneNumber: 		phone,
		CallBackURL: 		m.callbackURL + "/payments/callback",
		AccountReference: 	"Kaya-" + houseID,
		TransactionDesc: 	"Kaya house unlock payment",
	}
	//payload convert to JSON
	payloadsBytes, err := json.Marshal(payload)
	if err != nil {
		return "", fmt.Errorf("payments.mpesa.InitiateSTKPush: failedto marshal payload: %w", err)
	}
	//STK Push url build
	url := fmt.Sprintf("%s/mpesa/stkpush/v1/processrequest", m.baseURL)

	//http request
	req, err := http.NewRequest("POST", url, strings.NewReader(string(payloadsBytes)))
	if err != nil {
		return "", fmt.Errorf("payments.mpesa.InitiateSTKPush: failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("Content-Type", "application/json")

	//send request
	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return  "", fmt.Errorf("payments.mpesa.InitiateSTKPush: failed to send request: %w", err)
	}
	defer resp.Body.Close()

	//read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("payments.mpesa.InitiateSTKPush: failed to read response: %w", err)
	}

	//parse response
	var stkResp stkPushResponse
	if err := json.Unmarshal(body, &stkResp); err != nil {
		return "", fmt.Errorf("payments.mpesa.InitiateSTKPush: failed to parse response: %w", err)
	}

	if stkResp.ResponseCode != "0" {
		return "", fmt.Errorf("payments.mpesa.InitiateSTKPush: STK push failed: %s", stkResp.ResponseDescription)
	}
	return stkResp.CheckoutRequestID, nil
}
