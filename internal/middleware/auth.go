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

// AuthMiddleware validates the JWT token on protected routes.Extracts user id from the token and adds it to the request context
func AuthMiddleware(jwtSecret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			//Extract the token from the Authorization header
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				writeError(w, http.StatusUnauthorized, "Authorization header is required")
				return
			}
			//Check the header has the format "Bearer<token>"
			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				writeError(w, http.StatusUnauthorized, "authorization header format must be: Bearer <token>")
				return
			}
			//Extract token string from header
			tokenString := parts[1]

			//Parse and validate the JWT token
			token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
				//Ensure token was signed with HMAC and not another method
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, jwt.ErrSignatureInvalid
				}
				return []byte(jwtSecret), nil
			})
			if err != nil || !token.Valid {
				writeError(w, http.StatusUnauthorized, "invalid or expired token-x")
				return
			}
			//Extract the claims(data) from token
			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				writeError(w, http.StatusUnauthorized, "invalid token claims")
				return
			}
			//Get user id from claims
			userID, ok := claims["sub"].(string)
			if !ok {
				writeError(w, http.StatusUnauthorized, "invalid token: user_id not found")
				return
			}
			role, ok := claims["role"].(string)
			if !ok {
				role = "user"
			}
			//add user id and role to request context so handler can access it
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
