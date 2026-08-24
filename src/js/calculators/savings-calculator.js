/*
 * Savings Goal Calculator — compute module.
 * Solves the future-value-of-an-annuity formula for the monthly payment
 * needed to close the gap between what a starting balance will grow to
 * on its own, and the target goal amount:
 *   requiredMonthly = (goal - P(1+r)^n) / [ ((1+r)^n - 1) / r ]
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  function compute(v) {
    var goal = v.goalAmount;
    var current = v.currentSavings || 0;
    var annualRate = v.annualInterestRate || 0;
    var years = v.years;

    var n = Math.round(years * 12);
    if (n <= 0) {
      return { error: "Time period must be greater than zero." };
    }
    var r = annualRate / 100 / 12;

    var growthOfCurrent = current * Math.pow(1 + r, n);
    var remaining = goal - growthOfCurrent;

    var requiredMonthly;
    if (remaining <= 0) {
      requiredMonthly = 0;
    } else if (r === 0) {
      requiredMonthly = remaining / n;
    } else {
      requiredMonthly = remaining / ((Math.pow(1 + r, n) - 1) / r);
    }

    if (!lib.isSafe(requiredMonthly)) {
      return { error: "We couldn't calculate a result with these values. Try adjusting the time period or rate." };
    }

    var totalContributed = requiredMonthly * n;

    return {
      rows: [
        { label: "Goal amount", value: lib.fmtCurrency(goal), rawValue: goal },
        { label: "Starting savings grows to", value: lib.fmtCurrency(growthOfCurrent), rawValue: growthOfCurrent },
        { label: "Total you'll contribute", value: lib.fmtCurrency(totalContributed), rawValue: totalContributed },
        { label: "Required monthly contribution", value: lib.fmtCurrency(requiredMonthly), rawValue: requiredMonthly, isTotal: true }
      ],
      note: remaining <= 0
        ? "Your current savings are on track to reach this goal from growth alone, assuming this rate holds."
        : "Assumes interest compounds monthly and the rate stays constant, which isn't guaranteed for most accounts."
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
