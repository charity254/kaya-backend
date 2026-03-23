import { endpoints } from "./endpoints.js";
import { validateStatus, validateFields, validateContentType } from "./validator.js";

const COLORS = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

async function runTests() {
  console.log(`\n${COLORS.bold}🚀 Starting Kaya API Endpoint Tests...${COLORS.reset}\n`);

  let passed = 0;
  let failed = 0;

  for (const ep of endpoints) {
    console.log(`${COLORS.bold}▶ ${ep.name}${COLORS.reset}`);
    console.log(`  ${ep.method} ${ep.url}`);

    try {
      const res = await fetch(ep.url, {
        method: ep.method,
        headers: ep.headers || {},
        body: ep.body ? JSON.stringify(ep.body) : undefined,
      });

      // Handle non-JSON responses by catching errors on .json()
      const body = await res.json().catch(() => null);
      const results = [];

      // 1. Status check
      results.push(validateStatus(res.status, ep.expectedStatus));

      // 2. Content-Type check (only for successful JSON responses)
      if (res.status < 400 && res.headers.get("content-type")?.includes("application/json")) {
        results.push(validateContentType(res.headers));
      }

      // 3. Response body structure check
      if (body && ep.expectedFields?.length > 0) {
        results.push(validateFields(body, ep.expectedFields));
      }

      // Report results
      const allPassed = results.every((r) => r.passed);
      allPassed ? passed++ : failed++;

      for (const r of results) {
        const color = r.passed ? COLORS.green : COLORS.red;
        console.log(`  ${color}${r.message}${COLORS.reset}`);
      }
    } catch (err) {
      failed++;
      console.log(`  ${COLORS.red}Error: ${err.message} ✗${COLORS.reset}`);
      console.log(`  ${COLORS.yellow}Make sure your Kaya backend server is running on localhost:8080!${COLORS.reset}`);
    }

    console.log();
  }

  // Summary
  console.log(`${COLORS.bold}── Summary ──────────────────────────────${COLORS.reset}`);
  console.log(`  ${COLORS.green}Passed: ${passed}${COLORS.reset}`);
  console.log(`  ${COLORS.red}Failed: ${failed}${COLORS.reset}`);
  console.log(`  Total:  ${passed + failed}\n`);
}

runTests();
