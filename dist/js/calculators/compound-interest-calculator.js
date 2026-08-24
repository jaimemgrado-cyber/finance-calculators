/*
 * Compound Interest Calculator — compute module.
 * Assumes monthly compounding, contributions made at the end of each month:
 *   FV = P(1+r)^n + C * [ ((1+r)^n - 1) / r ]
 * where P = starting principal, C = monthly contribution,
 * r = monthly interest rate, n = number of months.
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  function compute(v) {
    var principal = v.initialAmount || 0;
    var monthlyContribution = v.monthlyContribution || 0;
    var annualRate = v.annualInterestRate;
    var years = v.years;

    var n = Math.round(years * 12);
    if (n <= 0) {
      return { error: "Time period must be greater than zero." };
    }
    var r = annualRate / 100 / 12;

    var growthOnPrincipal = principal * Math.pow(1 + r, n);
    var growthOnContributions;
    if (r === 0) {
      growthOnContributions = monthlyContribution * n;
    } else {
      growthOnContributions = monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
    }
    var futureValue = growthOnPrincipal + growthOnContributions;

    if (!lib.isSafe(futureValue)) {
      return { error: "We couldn't calculate a result with these values. Try smaller numbers." };
    }

    var totalContributed = principal + monthlyContribution * n;
    var totalInterest = futureValue - totalContributed;

    return {
      rows: [
        { label: "Starting amount", value: lib.fmtCurrency(principal), rawValue: principal },
        { label: "Total contributions", value: lib.fmtCurrency(monthlyContribution * n), rawValue: monthlyContribution * n },
        { label: "Total interest earned", value: lib.fmtCurrency(totalInterest), rawValue: totalInterest },
        { label: "Future value", value: lib.fmtCurrency(futureValue), rawValue: futureValue, isTotal: true }
      ],
      note: "Assumes interest compounds monthly and contributions are made at the end of each month. Actual returns vary and are never guaranteed."
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
