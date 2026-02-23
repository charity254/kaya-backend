# Kaya Backend

Kaya Backend is a RESTful API service built in Go. This repository contains the server code, routing, configurations, and database connection settings necessary to run the backend service.

## Tech Stack
- **Language:** Go (Golang)
- **Routing:** [gorilla/mux](https://github.com/gorilla/mux)
- **Database:** PostgreSQL (with `lib/pq` driver)
- **Environment Management:** [joho/godotenv](https://github.com/joho/godotenv)

## Project Structure
- `cmd/server/main.go`: The main entry point of the application. It initializes configurations, connects to the database, sets up routes, and starts the server.
- `internal/config/config.go`: Handles loading of environment variables (from a `.env` file or system environment variables).
- `internal/database/db.go`: Manages the PostgreSQL database connection and ping tests.

## Prerequisites
- Go 1.20+
- PostgreSQL database
- A `.env` file in the root directory 

## Environment Variables
The application relies on the following environment variables:
- `PORT`: The port on which the server will run (default is `8080`).
- `DB_URL`: The PostgreSQL connection string.
- `JWT_SECRET`: The secret key used for signing JSON Web Tokens.

Create a `.env` file in the root of the project to set these values for local development:
```env
PORT=8080
DB_URL=postgres://user:password@localhost/dbname?sslmode=disable
JWT_SECRET=your_super_secret_key
```

## Running the Application

1. **Install dependencies:**
   ```bash
   go mod tidy
   ```

2. **Run the server:**
   ```bash
   go run cmd/server/main.go
   ```
   The server will start at `http://localhost:8080` (or your configured `PORT`).

3. **Health Check:**
   You can verify the backend is running by navigating to the health endpoint:
   ```
   GET /health
   ```

## Development
This is an ongoing project. Features such as user management APIs and database interactions are currently under active development. Ensure you configure your database connection via `DB_URL` correctly before running the application to avoid connection failures.
