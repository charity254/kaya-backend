package middleware

import "net/http"

// AdminMiddleware is a middleware that checks if the logged in user has the admin role. Returns 403 Forbidden is user is not admin
func AdminMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		role, ok := GetRole(r)
		if !ok {
			writeError(w, http.StatusForbidden, "access denied")
			return
		}
		if role != "admin" {
			writeError(w, http.StatusForbidden, "access denied: admin only")
			return
		}
		next.ServeHTTP(w, r)
	})
}
