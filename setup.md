# Setup Instructions

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

## Database Migrations
Migrations are written in standard SQL inside the `migrations/` folder. Use the Go `migrate` tool to run them.

To run migrations up (apply new changes):
```bash
migrate -path migrations -database "${DB_URL}" up
```

To run migrations down (revert the latest change):
```bash
migrate -path migrations -database "${DB_URL}" down 1
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
