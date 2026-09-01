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
    var interestShare = futureValue > 0 ? (totalInterest / futureValue) * 100 : 0;

    // Yearly series for the chart — capped at ~40 points for readability.
    var pointYears = buildYearPoints(years);
    var contribLine = [];
    var totalLine = [];
    pointYears.forEach(function (yr) {
      var m = Math.round(yr * 12);
      var g = principal * Math.pow(1 + r, m);
      var gc = r === 0 ? monthlyContribution * m : monthlyContribution * ((Math.pow(1 + r, m) - 1) / r);
      contribLine.push(principal + monthlyContribution * m);
      totalLine.push(g + gc);
    });

    return {
      rows: [
        { label: "Starting amount", value: lib.fmtCurrency(principal), rawValue: principal },
        { label: "Total contributions", value: lib.fmtCurrency(monthlyContribution * n), rawValue: monthlyContribution * n },
        { label: "Total interest earned", value: lib.fmtCurrency(totalInterest), rawValue: totalInterest },
        { label: "Future value", value: lib.fmtCurrency(futureValue), rawValue: futureValue, isTotal: true }
      ],
      note: "Assumes interest compounds monthly and contributions are made at the end of each month. Actual returns vary and are never guaranteed.",
      scale: {
        label: "Interest as a share of future value",
        min: 0,
        max: 100,
        value: interestShare,
        valueDisplay: lib.fmtNumber(interestShare) + "%",
        lowLabel: "Mostly your money",
        highLabel: "Mostly growth",
        kind: "computed",
        interpretation: "Of the " + lib.fmtCurrency(futureValue) + " projected, " + lib.fmtNumber(interestShare) + "% (" + lib.fmtCurrency(totalInterest) + ") comes from interest rather than what you put in. Longer time horizons and higher rates both increase this share — but returns are never guaranteed."
      },
      chart: {
        title: "Contributions vs. total value over time",
        labels: pointYears.map(function (yr) { return "Yr " + yr; }),
        series: [
          { name: "Your money in", data: contribLine, color: "#2C6CB0" },
          { name: "Total value (with growth)", data: totalLine, color: "#12A48C" }
        ]
      }
    };
  }

  // Builds an array of year-marks from 0 to `years`, capped at ~12 points
  // so the chart stays readable even for very long time horizons.
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
