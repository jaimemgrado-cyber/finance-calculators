/* Tiny shared helpers for calculator compute modules (Node + browser). */
function fmtCurrency(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
}
function fmtPercent(n) {
  return new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 2 }).format(n / 100);
}
function fmtNumber(n) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);
}
function isSafe(n) {
  return typeof n === "number" && isFinite(n) && !isNaN(n);
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };
}
