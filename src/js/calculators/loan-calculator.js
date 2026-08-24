/*
 * Loan Calculator (generic) — compute module.
 * Standard fixed-rate amortized loan payment formula, for any lump-sum
 * loan with a fixed rate and fixed term.
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  function compute(v) {
    var principal = v.loanAmount;
    var interestRate = v.interestRate;
    var loanTermMonths = Math.round(v.loanTermMonths);

    if (principal <= 0) {
      return { error: "Loan amount must be greater than zero." };
    }
    if (loanTermMonths <= 0) {
      return { error: "Loan term must be greater than zero." };
    }

    var i = interestRate / 100 / 12;
    var monthlyPayment;
    if (i === 0) {
      monthlyPayment = principal / loanTermMonths;
    } else {
      var factor = Math.pow(1 + i, loanTermMonths);
      monthlyPayment = principal * (i * factor) / (factor - 1);
    }

    if (!lib.isSafe(monthlyPayment)) {
      return { error: "We couldn't calculate a payment with these values. Try adjusting the rate or term." };
    }

    var totalPaid = monthlyPayment * loanTermMonths;
    var totalInterest = totalPaid - principal;

    return {
      rows: [
        { label: "Loan amount", value: lib.fmtCurrency(principal), rawValue: principal },
        { label: "Monthly payment", value: lib.fmtCurrency(monthlyPayment), rawValue: monthlyPayment, isTotal: true },
        { label: "Total interest paid", value: lib.fmtCurrency(totalInterest), rawValue: totalInterest },
        { label: "Total of all payments", value: lib.fmtCurrency(totalPaid), rawValue: totalPaid }
      ],
      note: "Assumes a fixed rate and equal monthly payments over " + loanTermMonths + " months."
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
