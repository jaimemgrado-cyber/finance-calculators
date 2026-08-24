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

    return {
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
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
