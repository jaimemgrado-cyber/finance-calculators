/*
 * Mortgage Calculator — compute module.
 * Formula: standard fixed-rate amortized loan payment,
 *   M = P * [ i(1+i)^n ] / [ (1+i)^n - 1 ]
 * where P = loan principal, i = monthly interest rate, n = number of payments.
 * This is the standard formula used for fixed-rate amortizing loans; it does
 * not model ARMs, PMI, or closing costs.
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  function compute(v) {
    var homePrice = v.homePrice;
    var downPayment = v.downPayment;
    var interestRate = v.interestRate;
    var loanTermYears = v.loanTermYears;
    var annualPropertyTax = v.annualPropertyTax || 0;
    var annualHomeInsurance = v.annualHomeInsurance || 0;
    var monthlyHOA = v.monthlyHOA || 0;

    if (downPayment >= homePrice) {
      return { error: "Down payment must be less than the home price." };
    }

    var principal = homePrice - downPayment;
    var n = Math.round(loanTermYears * 12);
    if (n <= 0) {
      return { error: "Loan term must be greater than zero." };
    }
    var i = interestRate / 100 / 12;

    var monthlyPI;
    if (i === 0) {
      monthlyPI = principal / n;
    } else {
      var factor = Math.pow(1 + i, n);
      monthlyPI = principal * (i * factor) / (factor - 1);
    }

    if (!lib.isSafe(monthlyPI)) {
      return { error: "We couldn't calculate a payment with these values. Try adjusting the interest rate or term." };
    }

    var monthlyTax = annualPropertyTax / 12;
    var monthlyIns = annualHomeInsurance / 12;
    var totalMonthly = monthlyPI + monthlyTax + monthlyIns + monthlyHOA;
    var totalPaidPI = monthlyPI * n;
    var totalInterest = totalPaidPI - principal;
    var monthlyGrossIncome = v.monthlyGrossIncome || 0;

    var result = {
      rows: [
        { label: "Loan amount", value: lib.fmtCurrency(principal), rawValue: principal },
        { label: "Principal & interest", value: lib.fmtCurrency(monthlyPI), rawValue: monthlyPI },
        { label: "Property tax (monthly)", value: lib.fmtCurrency(monthlyTax), rawValue: monthlyTax },
        { label: "Home insurance (monthly)", value: lib.fmtCurrency(monthlyIns), rawValue: monthlyIns },
        { label: "HOA fees (monthly)", value: lib.fmtCurrency(monthlyHOA), rawValue: monthlyHOA },
        { label: "Total monthly payment", value: lib.fmtCurrency(totalMonthly), rawValue: totalMonthly, isTotal: true }
      ],
      note: "Over " + loanTermYears + " years you'd pay " + lib.fmtCurrency(totalInterest) + " in interest, for a total of " + lib.fmtCurrency(totalPaidPI) + " in principal and interest combined."
    };

    // Optional: only shown if the user entered an income, so the scale never
    // appears based on an assumed or default value.
    if (monthlyGrossIncome > 0) {
      var frontEndDTI = (totalMonthly / monthlyGrossIncome) * 100;
      result.scale = {
        label: "Housing payment vs. gross income",
        min: 0,
        max: 50,
        value: frontEndDTI,
        valueDisplay: lib.fmtNumber(frontEndDTI) + "%",
        lowLabel: "0%",
        highLabel: "50%+",
        kind: "guideline",
        interpretation: "Your total monthly payment is " + lib.fmtNumber(frontEndDTI) + "% of the gross monthly income you entered. A commonly cited lending guideline suggests keeping housing costs at or below 28% of gross income, though actual approval depends on your full financial picture and lender.",
        source: "Reference point: the 28% \"front-end\" housing-to-income guideline used by many conventional mortgage lenders — not a hard rule, and not personalized advice."
      };
    }

    // Yearly remaining-balance series for the chart.
    var balancePoints = buildYearPoints(loanTermYears);
    var balanceLine = balancePoints.map(function (yr) {
      var m = Math.round(yr * 12);
      if (m <= 0) return principal;
      if (m >= n) return 0;
      if (i === 0) return Math.max(0, principal - monthlyPI * m);
      var factorM = Math.pow(1 + i, m);
      var bal = principal * factorM - monthlyPI * ((factorM - 1) / i);
      return Math.max(0, bal);
    });

    result.chart = {
      title: "Remaining loan balance over time",
      labels: balancePoints.map(function (yr) { return "Yr " + yr; }),
      series: [{ name: "Remaining balance", data: balanceLine, color: "#12A48C" }]
    };

    return result;
  }

  // Builds an array of year-marks from 0 to `years`, capped at ~12 points.
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
