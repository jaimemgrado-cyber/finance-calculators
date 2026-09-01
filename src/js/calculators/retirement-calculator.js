/*
 * Retirement Calculator — compute module.
 * Same future-value formula as the compound interest calculator, framed
 * around current age / retirement age instead of a raw year count:
 *   FV = P(1+r)^n + C * [ ((1+r)^n - 1) / r ]
 * Also shows what that balance could support annually under the widely
 * cited "4% rule" (Bengen, 1994) — presented as a commonly referenced
 * starting point, not a recommendation or a guarantee.
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  function compute(v) {
    var currentAge = v.currentAge;
    var retirementAge = v.retirementAge;
    var currentSavings = v.currentSavings || 0;
    var monthlyContribution = v.monthlyContribution || 0;
    var annualReturn = v.expectedAnnualReturn;

    var yearsToRetirement = retirementAge - currentAge;
    if (yearsToRetirement <= 0) {
      return { error: "Retirement age must be greater than your current age." };
    }

    var n = Math.round(yearsToRetirement * 12);
    var r = annualReturn / 100 / 12;

    var growthOnCurrent = currentSavings * Math.pow(1 + r, n);
    var growthOnContributions = r === 0
      ? monthlyContribution * n
      : monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
    var projectedBalance = growthOnCurrent + growthOnContributions;

    if (!lib.isSafe(projectedBalance)) {
      return { error: "We couldn't calculate a result with these values." };
    }

    var estimatedAnnualIncome = projectedBalance * 0.04;

    var yearPoints = buildYearPoints(yearsToRetirement);
    var balanceLine = yearPoints.map(function (yr) {
      var m = Math.round(yr * 12);
      var g = currentSavings * Math.pow(1 + r, m);
      var gc = r === 0 ? monthlyContribution * m : monthlyContribution * ((Math.pow(1 + r, m) - 1) / r);
      return g + gc;
    });

    return {
      rows: [
        { label: "Years until retirement", value: lib.fmtNumber(yearsToRetirement), rawValue: yearsToRetirement },
        { label: "Total contributions", value: lib.fmtCurrency(monthlyContribution * n), rawValue: monthlyContribution * n },
        { label: "Projected balance at retirement", value: lib.fmtCurrency(projectedBalance), rawValue: projectedBalance, isTotal: true },
        { label: "Est. annual income (4% rule)", value: lib.fmtCurrency(estimatedAnnualIncome), rawValue: estimatedAnnualIncome }
      ],
      note: "Assumes a constant return, which real markets don't provide. The 4% figure is a commonly referenced starting point for retirement withdrawals, not personalized advice — how long any balance lasts depends on your actual spending, returns, and lifespan.",
      chart: {
        title: "Projected balance from now to retirement",
        labels: yearPoints.map(function (yr) { return "Age " + (currentAge + yr); }),
        series: [{ name: "Projected balance", data: balanceLine, color: "#6E5DC6" }]
      }
    };
  }

  function buildYearPoints(years) {
    var maxPoints = 12;
    var step = Math.max(1, Math.ceil(years / maxPoints));
    var pts = [];
    for (var yr = 0; yr < years; yr += step) pts.push(yr);
    pts.push(years);
    return pts;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
