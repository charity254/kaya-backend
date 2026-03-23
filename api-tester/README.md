# Kaya API Tester

A simple, automated endpoint testing tool for the Kaya backend.

This tool validates that API endpoints are reachable, return the correct HTTP status codes, and include all expected fields in their JSON responses.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (usually bundled with Node.js)

### Installation

1. Navigate to the `api-tester` directory:
   ```bash
   cd api-tester
   ```
2. Install dependencies (if any):
   ```bash
   npm install
   ```

## Usage

You can run tests against different environments using command-line flags.

### Run Production Tests (Default)

This will target the live backend at `https://kaya-backend-production-beb0.up.railway.app`.

```bash
node index.js
```

### Run Local Tests

This will target your local development server at `http://localhost:8080`.

```bash
node index.js --local
# OR
node index.js -l
```

## Adding New Tests

To add a new endpoint test, modify the `endpoints.js` file.

Each endpoint object should follow this structure:

```javascript
{
  name: "Human Readable Name",
  path: "/your/api/route", // Use relative paths
  method: "GET | POST | PUT | DELETE",
  headers: { "Content-Type": "application/json" }, // Optional
  body: { ... }, // Optional, for POST/PUT requests
  expectedStatus: 200,
  expectedFields: ["field1", "field2"], // List of top-level JSON fields to check
}
```

## Results

After each run, a summary is displayed in the terminal, and detailed results (including response bodies) are stored in `results.json`.
