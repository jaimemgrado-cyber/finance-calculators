/*
 * Discount Calculator — compute module.
 * savings = price * (discountPercent / 100); finalPrice = price - savings.
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  function compute(v) {
    var price = v.originalPrice;
    var discountPercent = v.discountPercent;

    var savings = price * (discountPercent / 100);
    var finalPrice = price - savings;

    if (!lib.isSafe(savings) || !lib.isSafe(finalPrice)) {
      return { error: "We couldn't calculate a result with these values." };
    }

    return {
      rows: [
        { label: "Original price", value: lib.fmtCurrency(price), rawValue: price },
        { label: "You save", value: lib.fmtCurrency(savings), rawValue: savings },
        { label: "Final price", value: lib.fmtCurrency(finalPrice), rawValue: finalPrice, isTotal: true }
      ],
      note: "Sales tax isn't included — add it separately if it applies to your purchase."
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
