const fs = require("fs");
const assert = require("assert");
const site = require("../build/site-data.js");

assert.strictEqual(site.legal.legalEntityName, "Jaime Muñoz de Morales");
assert.strictEqual(site.legal.taxId, "06644150W");
assert.strictEqual(site.legal.mailingAddress, "Calle Real 20, 2D, El Molar, Madrid, España");
assert.strictEqual(site.legal.contactEmail, "support.digitaltools@gmail.com");

for (const file of [
  "privacy-policy/index.html",
  "terms-of-service/index.html",
  "disclaimer/index.html",
  "about/index.html",
  "contact/index.html"
]) {
  const html = fs.readFileSync(`dist/${file}`, "utf8");
  for (const value of [site.legal.legalEntityName, site.legal.taxId, site.legal.mailingAddress, site.legal.contactEmail]) {
    assert.ok(html.includes(value), `${file} missing legal identity value: ${value}`);
  }
}

console.log("Final audit legal identity checks passed");
