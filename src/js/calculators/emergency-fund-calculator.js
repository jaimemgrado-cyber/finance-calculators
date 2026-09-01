/*
 * Emergency Fund Calculator — compute module.
 * target = monthlyEssentialExpenses * targetMonthsCoverage
 * The target-months figure (commonly 3-6 months of essential expenses) is
 * a widely cited personal-finance guideline — e.g. the CFPB and many
 * financial educators suggest this range — not a rule that fits every
 * situation (income stability, dependents, and job type all matter).
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  function compute(v) {
    var monthlyExpenses = v.monthlyEssentialExpenses;
    var currentSavings = v.currentSavings || 0;
    var targetMonths = v.targetMonthsCoverage;
    var monthlyContribution = v.monthlySavingsContribution || 0;

    if (monthlyExpenses <= 0) {
      return { error: "Monthly essential expenses must be greater than zero." };
    }

    var targetAmount = monthlyExpenses * targetMonths;
    var gap = Math.max(0, targetAmount - currentSavings);
    var monthsCoveredNow = currentSavings / monthlyExpenses;

    var rows = [
      { label: "Target emergency fund (" + lib.fmtNumber(targetMonths) + " months)", value: lib.fmtCurrency(targetAmount), rawValue: targetAmount, isTotal: true },
      { label: "Current savings", value: lib.fmtCurrency(currentSavings), rawValue: currentSavings },
      { label: "Amount still needed", value: lib.fmtCurrency(gap), rawValue: gap }
    ];

    var note;
    var chart = null;
    if (gap <= 0) {
      note = "Your current savings already meet or exceed this target.";
    } else if (monthlyContribution > 0) {
      var months = Math.ceil(gap / monthlyContribution);
      rows.push({ label: "Time to reach target", value: lib.fmtNumber(months) + " months", rawValue: months });
      note = "Assumes you save the same amount every month with no investment growth on those savings.";

      var pointMonths = buildPoints(months);
      chart = {
        title: "Savings progress toward your target",
        labels: pointMonths.map(function (m) { return "Mo " + m; }),
        series: [{ name: "Projected savings", data: pointMonths.map(function (m) { return Math.min(targetAmount, currentSavings + monthlyContribution * m); }), color: "#12A48C" }],
        referenceLine: { value: targetAmount, label: "Target" }
      };
    } else {
      note = "Add a monthly savings amount to see how long it would take to reach this target.";
    }

    return {
      rows: rows,
      note: note,
      scale: {
        label: "Months of expenses currently covered",
        min: 0,
        max: 12,
        value: monthsCoveredNow,
        valueDisplay: lib.fmtNumber(monthsCoveredNow) + " mo",
        lowLabel: "0 months",
        highLabel: "12 months",
        kind: "guideline",
        interpretation: "Your current savings would cover about " + lib.fmtNumber(monthsCoveredNow) + " months of essential expenses if your income stopped today.",
        source: "3-6 months of essential expenses is a commonly cited emergency-fund guideline (e.g. from the CFPB and many financial educators) — the right amount depends on job stability, dependents, and other income sources."
      },
      chart: chart
    };
  }

  function buildPoints(months) {
    var maxPoints = 12;
    var step = Math.max(1, Math.ceil(months / maxPoints));
    var pts = [];
    for (var m = 0; m < months; m += step) pts.push(m);
    pts.push(months);
    return pts;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
