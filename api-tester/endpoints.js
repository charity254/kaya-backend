export const endpoints = [
  {
    name: "Health Check",
    url: "https://kaya-backend-production-beb0.up.railway.app/health",
    method: "GET",
    expectedStatus: 200,
    expectedFields: [], // Returns plain text "Kaya backend running"
  },
  {
    name: "Get all houses",
    url: "https://kaya-backend-production-beb0.up.railway.app/houses",
    method: "GET",
    expectedStatus: 200,
    expectedFields: ["houses", "count"],
  },
  {
    name: "Request OTP",
    url: "https://kaya-backend-production-beb0.up.railway.app/auth/request-otp",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { phone: "+254700000000" },
    expectedStatus: 200,
    expectedFields: ["message"],
  },
  {
    name: "Admin Houses (Unauthorized check)",
    url: "https://kaya-backend-production-beb0.up.railway.app/admin/houses",
    method: "POST",
    expectedStatus: 401,
    expectedFields: ["error"],
  },
  {
    name: "Non-existent route",
    url: "https://kaya-backend-production-beb0.up.railway.app/api/missing",
    method: "GET",
    expectedStatus: 404,
    expectedFields: [],
  },
];
