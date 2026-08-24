/*
 * Sales Tax Calculator — compute module.
 * taxAmount = price * (rate / 100); total = price + taxAmount.
 * The tax rate is always supplied by the user — this calculator does not
 * hardcode state or local rates, which vary by jurisdiction and change
 * over time.
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  function compute(v) {
    var price = v.price;
    var rate = v.taxRate;

    var taxAmount = price * (rate / 100);
    var total = price + taxAmount;

    if (!lib.isSafe(taxAmount) || !lib.isSafe(total)) {
      return { error: "We couldn't calculate a result with these values." };
    }

    return {
      rows: [
        { label: "Price before tax", value: lib.fmtCurrency(price), rawValue: price },
        { label: "Sales tax amount", value: lib.fmtCurrency(taxAmount), rawValue: taxAmount },
        { label: "Total price", value: lib.fmtCurrency(total), rawValue: total, isTotal: true }
      ],
      note: "Enter the combined state and local rate for your area — rates vary widely across the U.S. and change over time."
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
