/*
 * Down Payment Calculator — compute module.
 * Computes the down payment amount and resulting loan amount for a given
 * home price and down payment percentage, flags whether the down payment
 * is likely to trigger private mortgage insurance (PMI) — conventional
 * loans commonly require PMI below 20% down, though this varies by
 * lender and loan type — and, if the user provides current savings and a
 * monthly savings amount, estimates how long it would take to reach the
 * down payment goal.
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  function compute(v) {
    var homePrice = v.homePrice;
    var downPaymentPercent = v.downPaymentPercent;
    var currentSavings = v.currentSavings || 0;
    var monthlySavings = v.monthlySavings || 0;

    if (homePrice <= 0) {
      return { error: "Home price must be greater than zero." };
    }

    var downPaymentAmount = homePrice * (downPaymentPercent / 100);
    var loanAmount = homePrice - downPaymentAmount;

    var rows = [
      { label: "Down payment amount", value: lib.fmtCurrency(downPaymentAmount), rawValue: downPaymentAmount, isTotal: true },
      { label: "Resulting loan amount", value: lib.fmtCurrency(loanAmount), rawValue: loanAmount }
    ];

    var remaining = Math.max(0, downPaymentAmount - currentSavings);
    var note;
    if (remaining <= 0) {
      note = "Your current savings already cover this down payment.";
    } else if (monthlySavings > 0) {
      var months = Math.ceil(remaining / monthlySavings);
      rows.push({ label: "Still needed", value: lib.fmtCurrency(remaining), rawValue: remaining });
      rows.push({ label: "Time to save the rest", value: lib.fmtNumber(months) + " months", rawValue: months });
      note = "Assumes you save the same amount every month with no investment growth on those savings.";
    } else {
      rows.push({ label: "Still needed", value: lib.fmtCurrency(remaining), rawValue: remaining });
      note = "Add a monthly savings amount to see how long it would take to reach this down payment.";
    }

    return {
      rows: rows,
      note: note,
      scale: {
        label: "Down payment vs. the 20% PMI-avoidance guideline",
        min: 0,
        max: 30,
        value: downPaymentPercent,
        valueDisplay: lib.fmtNumber(downPaymentPercent) + "%",
        lowLabel: "0%",
        highLabel: "30%+",
        kind: "guideline",
        interpretation: downPaymentPercent < 20
          ? "At " + lib.fmtNumber(downPaymentPercent) + "% down, many conventional lenders would require private mortgage insurance (PMI) until you reach 20% equity — this adds to your monthly payment and isn't included in this calculator."
          : "At " + lib.fmtNumber(downPaymentPercent) + "% down, you're at or above the 20% mark many conventional lenders use as the threshold to avoid PMI.",
        source: "20% is a common (not universal) conventional-loan threshold for avoiding PMI. Government-backed loans (FHA, VA, USDA) use different rules."
      }
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
