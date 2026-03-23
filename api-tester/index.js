import fs from 'node:fs';
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
  const testResults = [];

  for (const ep of endpoints) {
    console.log(`${COLORS.bold}▶ ${ep.name}${COLORS.reset}`);
    console.log(`  ${ep.method} ${ep.url}`);

    const currentResult = {
      name: ep.name,
      url: ep.url,
      method: ep.method,
      timestamp: new Date().toISOString(),
      checks: [],
      responseBody: null,
      passed: false
    };

    try {
      const res = await fetch(ep.url, {
        method: ep.method,
        headers: ep.headers || {},
        body: ep.body ? JSON.stringify(ep.body) : undefined,
      });

      const body = await res.json().catch(() => null);
      currentResult.responseBody = body;

      // 1. Status check
      const statusRes = validateStatus(res.status, ep.expectedStatus);
      currentResult.checks.push({ type: "status", ...statusRes });

      // 2. Content-Type check
      if (res.status < 400 && res.headers.get("content-type")?.includes("application/json")) {
        const ctRes = validateContentType(res.headers);
        currentResult.checks.push({ type: "content-type", ...ctRes });
      }

      // 3. Response body structure check
      if (body && ep.expectedFields?.length > 0) {
        const fieldRes = validateFields(body, ep.expectedFields);
        currentResult.checks.push({ type: "fields", ...fieldRes });
      }

      // Report results
      const allPassed = currentResult.checks.every((r) => r.passed);
      currentResult.passed = allPassed;
      
      allPassed ? passed++ : failed++;

      for (const r of currentResult.checks) {
        const color = r.passed ? COLORS.green : COLORS.red;
        console.log(`  ${color}${r.message}${COLORS.reset}`);
      }
    } catch (err) {
      failed++;
      currentResult.passed = false;
      currentResult.error = err.message;
      console.log(`  ${COLORS.red}Error: ${err.message} ✗${COLORS.reset}`);
    }

    testResults.push(currentResult);
    console.log();
  }

  // Save to file
  fs.writeFileSync('results.json', JSON.stringify(testResults, null, 2));
  console.log(`\n${COLORS.yellow}💾 Results saved to results.json${COLORS.reset}\n`);

  // Summary
  console.log(`${COLORS.bold}── Summary ──────────────────────────────${COLORS.reset}`);
  console.log(`  ${COLORS.green}Passed: ${passed}${COLORS.reset}`);
  console.log(`  ${COLORS.red}Failed: ${failed}${COLORS.reset}`);
  console.log(`  Total:  ${passed + failed}\n`);
}

runTests();
