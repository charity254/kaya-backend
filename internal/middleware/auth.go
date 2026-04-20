package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

// contextKey is a custom type for context keys to avoid collisions with other packages
type contextKey string

// UserIDKey is the key used to store the user id in the request context
const UserIDKey contextKey = "user_id"

// RoleKey is the key used to store the user role in the request context
const RoleKey contextKey = "role"

// AuthMiddleware validates the JWT token on protected routes
// It extracts the user id and role from the token and adds them to the request context
func AuthMiddleware(jwtSecret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Get the Authorization header from the request
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				writeError(w, http.StatusUnauthorized, "authorization header is required")
				return
			}

			// Check that the header has the format "Bearer <token>"
			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				writeError(w, http.StatusUnauthorized, "authorization header format must be: Bearer <token>")
				return
			}

			// Extract the token string from the header
			tokenString := parts[1]

			// Parse and validate the JWT token using our secret
			token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
				// Make sure the token was signed with HMAC and not another method
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, jwt.ErrSignatureInvalid
				}
				return []byte(jwtSecret), nil
			})

			if err != nil || !token.Valid {
				writeError(w, http.StatusUnauthorized, "invalid or expired token")
				return
			}

			// Extract the claims (data) from the token
			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				writeError(w, http.StatusUnauthorized, "invalid token claims")
				return
			}

			// Get the user id from the claims
			userID, ok := claims["user_id"].(string)
			if !ok {
				writeError(w, http.StatusUnauthorized, "invalid token: user_id not found")
				return
			}

			// Extract the role from the claims
			role, ok := claims["role"].(string)
			if !ok {
				role = "user" // default to user role if not found
			}

			// Add the user id and role to the request context
			ctx := context.WithValue(r.Context(), UserIDKey, userID)
			ctx = context.WithValue(ctx, RoleKey, role)

			// Pass the request to the next handler with the updated context
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// writeError writes a JSON error response with the given status code
func writeError(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write([]byte(`{"error":"` + message + `"}`))
}

// GetUserID extracts the user id from the request context
func GetUserID(r *http.Request) (string, bool) {
	userID, ok := r.Context().Value(UserIDKey).(string)
	return userID, ok
}

// GetRole extracts the user role from the request context
func GetRole(r *http.Request) (string, bool) {
	role, ok := r.Context().Value(RoleKey).(string)
	return role, ok
}