export const endpoints = [
  {
    name: "Health Check",
    path: "/health",
    method: "GET",
    expectedStatus: 200,
    expectedFields: [], // Returns plain text "Kaya backend running"
  },
  {
    name: "Get all houses",
    path: "/houses",
    method: "GET",
    expectedStatus: 200,
    expectedFields: ["houses", "count"],
  },
  {
    name: "Request OTP",
    path: "/auth/request-otp",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { phone: "+254700000000" },
    expectedStatus: 200,
    expectedFields: ["message"],
  },
  {
    name: "Admin Houses (Unauthorized check)",
    path: "/admin/houses",
    method: "POST",
    expectedStatus: 401,
    expectedFields: ["error"],
  },
  {
    name: "Non-existent route",
    path: "/api/missing",
    method: "GET",
    expectedStatus: 404,
    expectedFields: [],
  },
];
