/*
 * FIRE (Financial Independence, Retire Early) Calculator — compute module.
 * The FIRE number is computed as annualExpenses / withdrawalRate — the
 * inverse of the widely cited "4% rule" (Bengen, 1994; popularized by the
 * Trinity Study), i.e. 25x annual expenses at a 4% withdrawal rate. This
 * is a commonly referenced planning guideline, not a guarantee: how long
 * any portfolio lasts depends on actual returns, sequence of returns, and
 * spending.
 * Years to FIRE is then found by simulating monthly compound growth of
 * current savings plus contributions until the projected balance reaches
 * the FIRE number (pure computation, capped at 60 years).
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  var MAX_MONTHS = 720; // 60 years

  function compute(v) {
    var currentAge = v.currentAge;
    var currentSavings = v.currentSavings || 0;
    var monthlyContribution = v.monthlyContribution || 0;
    var annualReturn = v.expectedAnnualReturn;
    var annualExpenses = v.annualExpenses;
    var withdrawalRate = v.withdrawalRatePercent;

    if (annualExpenses <= 0) {
      return { error: "Annual expenses must be greater than zero." };
    }
    if (withdrawalRate <= 0) {
      return { error: "Withdrawal rate must be greater than zero." };
    }

    var fireNumber = annualExpenses / (withdrawalRate / 100);
    var r = annualReturn / 100 / 12;

    var balance = currentSavings;
    var months = 0;
    if (balance < fireNumber) {
      while (balance < fireNumber && months < MAX_MONTHS) {
        balance = balance * (1 + r) + monthlyContribution;
        months += 1;
      }
    }

    if (balance < fireNumber) {
      return { error: "At this contribution and return rate, you wouldn't reach your FIRE number within 60 years. Try increasing your contribution or expected return." };
    }

    var years = months / 12;
    var fireAge = currentAge + years;
    var progressPercent = fireNumber > 0 ? Math.min(100, (currentSavings / fireNumber) * 100) : 0;

    var pointYears = buildYearPoints(Math.ceil(years));
    var balanceLine = pointYears.map(function (yr) {
      var m = Math.min(Math.round(yr * 12), months);
      var bal = currentSavings;
      for (var mo = 0; mo < m; mo++) {
        bal = bal * (1 + r) + monthlyContribution;
      }
      return bal;
    });

    return {
      rows: [
        { label: "FIRE number (guideline)", value: lib.fmtCurrency(fireNumber), rawValue: fireNumber, isTotal: true },
        { label: "Years to reach it", value: lib.fmtNumber(years), rawValue: years },
        { label: "Projected FIRE age", value: lib.fmtNumber(fireAge), rawValue: fireAge },
        { label: "Total contributions along the way", value: lib.fmtCurrency(monthlyContribution * months), rawValue: monthlyContribution * months }
      ],
      note: "The FIRE number uses the withdrawal rate you set — a " + lib.fmtNumber(withdrawalRate) + "% rate is the inverse of saving " + lib.fmtNumber(100 / withdrawalRate) + "x annual expenses. The 4% figure popularized by the Trinity Study is a commonly referenced starting point, not a guarantee — actual safe withdrawal rates depend on market returns and how long the money needs to last.",
      scale: {
        label: "Progress toward your FIRE number",
        min: 0,
        max: 100,
        value: progressPercent,
        valueDisplay: lib.fmtNumber(progressPercent) + "%",
        lowLabel: "Just starting",
        highLabel: "Nearly there",
        kind: "computed",
        interpretation: "Your current savings cover " + lib.fmtNumber(progressPercent) + "% of your FIRE number today, before any further growth or contributions."
      },
      chart: {
        title: "Projected balance toward your FIRE number",
        labels: pointYears.map(function (yr) { return "Yr " + yr; }),
        series: [{ name: "Projected balance", data: balanceLine, color: "#6E5DC6" }],
        referenceLine: { value: fireNumber, label: "FIRE number" }
      }
    };
  }

  function buildYearPoints(years) {
    if (years <= 0) return [0];
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
