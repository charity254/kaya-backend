// Validates status code
export function validateStatus(actual, expected) {
  return {
    passed: actual === expected,
    message:
      actual === expected
        ? `Status ${actual} ✓`
        : `Expected status ${expected}, got ${actual} ✗`,
  };
}

// Validates that all expected fields exist in the response body
export function validateFields(body, expectedFields) {
  if (!expectedFields || expectedFields.length === 0 || !body)
    return { passed: true, message: "No fields to validate" };

  const target = Array.isArray(body) ? body[0] : body; // handle array responses
  const missing = expectedFields.filter((f) => !(f in target));

  return {
    passed: missing.length === 0,
    message:
      missing.length === 0
        ? `All fields present ✓`
        : `Missing fields: ${missing.join(", ")} ✗`,
  };
}

// Validates Content-Type header
export function validateContentType(headers, expected = "application/json") {
  const actual = headers.get("content-type") || "";
  const passed = actual.includes(expected);
  return {
    passed,
    message: passed
      ? `Content-Type OK ✓`
      : `Expected content-type "${expected}", got "${actual}" ✗`,
  };
}
