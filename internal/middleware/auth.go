package middleware

import (
	"crypto/tls"
	"context"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/MicahParks/jwkset"
	"github.com/MicahParks/keyfunc/v3"
	"github.com/golang-jwt/jwt/v5"
)

// contextKey is a custom type for context keys to avoid collisions with other packages
type contextKey string

// UserIDKey is the key used to store the user id in the request context
const UserIDKey contextKey = "user_id"

// RoleKey is the key used to store the user role in the request context
const RoleKey contextKey = "role"

var jwks keyfunc.Keyfunc

func InitJWKS(supabaseURL string) error {
    jwksURL := supabaseURL + "/auth/v1/.well-known/jwks.json"

    httpClient := &http.Client{
        Transport: &http.Transport{
            TLSClientConfig: &tls.Config{
                InsecureSkipVerify: true,
            },
        },
    }

	// Configure the JWK Set storage with the custom HTTP client
	storage, err := jwkset.NewStorageFromHTTP(jwksURL, jwkset.HTTPClientStorageOptions{
		Client:          httpClient,
		RefreshInterval: time.Hour,
	})
	if err != nil {
		return fmt.Errorf("failed to create JWKS storage: %w", err)
	}

	// Create the Keyfunc using the storage
	k, err := keyfunc.New(keyfunc.Options{
		Ctx:     context.Background(),
		Storage: storage,
	})
	if err != nil {
		return fmt.Errorf("failed to load JWKS: %w", err)
	}
	jwks = k
	return nil
}

// AuthMiddleware validates the JWT token on protected routes.Extracts user id from the token and adds it to the request context
func AuthMiddleware() func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            // Extract the token from the Authorization header
            authHeader := r.Header.Get("Authorization")
            if authHeader == "" {
                writeError(w, http.StatusUnauthorized, "Authorization header is required")
                return
            }

            // Check the header has the format "Bearer <token>"
            parts := strings.Split(authHeader, " ")
            if len(parts) != 2 || parts[0] != "Bearer" {
                writeError(w, http.StatusUnauthorized, "authorization header format must be: Bearer <token>")
                return
            }

            tokenString := parts[1]

            // Parse and validate using Supabase's public JWKS (handles ES256)
            token, err := jwt.Parse(tokenString, jwks.Keyfunc)
            if err != nil || !token.Valid {
                writeError(w, http.StatusUnauthorized, "invalid or expired token")
                return
            }

            claims, ok := token.Claims.(jwt.MapClaims)
            if !ok {
                writeError(w, http.StatusUnauthorized, "invalid token claims")
                return
            }

            // Supabase uses "sub" for user ID
            userID, ok := claims["sub"].(string)
            if !ok {
                writeError(w, http.StatusUnauthorized, "invalid token: sub not found")
                return
            }

            role, ok := claims["role"].(string)
            if !ok {
                role = "user"
            }

            ctx := context.WithValue(r.Context(), UserIDKey, userID)
            ctx = context.WithValue(ctx, RoleKey, role)
            next.ServeHTTP(w, r.WithContext(ctx))
        })
    }
}

func writeError(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write([]byte(`{"error":"` + message + `"}`))
}

// GetUserId extracts  user id from the request context
func GetUserID(r *http.Request) (string, bool) {
	userID, ok := r.Context().Value(UserIDKey).(string)
	return userID, ok
}

func GetRole(r *http.Request) (string, bool) {
	role, ok := r.Context().Value(RoleKey).(string)
	return role, ok
}
