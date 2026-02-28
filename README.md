# Kaya Backend

Production-ready Go backend powering Kaya, a secure and verified house hunting platform for the Kenyan market.

## Tech Stack
- **Language:** Go (Golang)
- **Routing:** [gorilla/mux](https://github.com/gorilla/mux)
- **Database:** PostgreSQL (with `lib/pq` driver)
- **Environment Management:** [joho/godotenv](https://github.com/joho/godotenv)

## Project Structure
- `cmd/server/main.go`: The main entry point of the application. It initializes configurations, connects to the database, sets up routes, and starts the server.
- `internal/config/config.go`: Handles loading of environment variables (from a `.env` file or system environment variables).
- `internal/database/db.go`: Manages the PostgreSQL database connection and ping tests.

## Setup Instructions

Please see [setup.md](setup.md) for detailed instructions on prerequisites, environment configuration, and running the application.
