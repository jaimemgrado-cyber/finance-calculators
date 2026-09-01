/*
 * run-all.js — runs every calculator test suite in this folder.
 * Usage: node tests/run-all.js  (or: npm test)
 */
const { execFileSync } = require("child_process");
const path = require("path");

const suites = ["test-core-calculators.js", "test-extended-calculators.js", "test-new-calculators.js"];

let failed = false;

suites.forEach((file) => {
  console.log(`\n--- ${file} ---`);
  try {
    const output = execFileSync("node", [path.join(__dirname, file)], { encoding: "utf8" });
    process.stdout.write(output);
  } catch (err) {
    failed = true;
    process.stdout.write(err.stdout || "");
    process.stderr.write(err.stderr || String(err));
  }
});

if (failed) {
  console.error("\nOne or more test suites failed.");
  process.exit(1);
} else {
  console.log("\nAll test suites passed.");
}
