# Kaya Backend

Production-ready Go backend powering Kaya, a secure and verified house hunting platform for the Kenyan market.

**Live API**: `https://kaya-xb37.onrender.com`

## Tech Stack
- **Language:** Go (Golang)
- **Routing:** [gorilla/mux](https://github.com/gorilla/mux)
- **Database:** PostgreSQL (with `lib/pq` driver)
- **Environment Management:** [joho/godotenv](https://github.com/joho/godotenv)
- **Authentication:** JWT (JSON Web Tokens)

## Project Structure
- `cmd/server/main.go`: The main entry point of the application. It initializes configurations, connects to the database, sets up routes, and starts the server.
- `internal/config/config.go`: Handles loading of environment variables (from a `.env` file or system environment variables).
- `internal/database/db.go`: Manages the PostgreSQL database connection and ping tests.
- `internal/auth/`: Centralized domain for OTP requests and JWT verification logic.
- `internal/houses/`: Core domain handling safe retrieval and filtering of house listings.
- `internal/admin/`: Admin-restricted domain for Creating, Updating, and Deleting houses.
- `internal/middleware/auth.go`: Contains authentication middleware for route protection.
- `internal/middleware/admin.go`: Contains role-based access middleware.
- `internal/middleware/ratelimit.go`: In-memory rate limiting implementation for preventing abuse.

## Setup Instructions

Please see [setup.md](setup.md) for detailed instructions on prerequisites, environment configuration, and running the application.
