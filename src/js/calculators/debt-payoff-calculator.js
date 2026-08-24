/*
 * Debt Payoff Calculator — compute module.
 * Same month-by-month simulation as the credit card payoff calculator,
 * generalized to any debt with a balance, interest rate, and payment.
 * Distinct feature: compares payoff time/interest against paying an
 * extra fixed amount each month, so the value of extra payments is
 * visible directly rather than requiring a second calculation.
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  var MAX_MONTHS = 600;

  function simulate(balance, monthlyRate, payment) {
    var remaining = balance;
    var totalInterest = 0;
    var months = 0;
    if (payment <= remaining * monthlyRate) return null;
    while (remaining > 0 && months < MAX_MONTHS) {
      var interest = remaining * monthlyRate;
      var principalPaid = payment - interest;
      if (principalPaid >= remaining) {
        totalInterest += interest;
        remaining = 0;
        months += 1;
        break;
      }
      remaining -= principalPaid;
      totalInterest += interest;
      months += 1;
    }
    if (remaining > 0) return null;
    return { months: months, totalInterest: totalInterest };
  }

  function compute(v) {
    var balance = v.currentBalance;
    var apr = v.apr;
    var monthlyPayment = v.monthlyPayment;
    var extraPayment = v.extraPayment || 0;

    var monthlyRate = apr / 100 / 12;

    var base = simulate(balance, monthlyRate, monthlyPayment);
    if (!base) {
      return { error: "This payment only covers interest (or less). Increase the monthly payment so it also reduces the balance." };
    }

    var rows = [
      { label: "Time to pay off", value: lib.fmtNumber(base.months) + " months", rawValue: base.months },
      { label: "Total interest paid", value: lib.fmtCurrency(base.totalInterest), rawValue: base.totalInterest, isTotal: true }
    ];

    var note = "Assumes no new charges are added and the payment is made every month.";

    if (extraPayment > 0) {
      var withExtra = simulate(balance, monthlyRate, monthlyPayment + extraPayment);
      if (withExtra) {
        var monthsSaved = base.months - withExtra.months;
        var interestSaved = base.totalInterest - withExtra.totalInterest;
        rows.push(
          { label: "With extra payment: time to pay off", value: lib.fmtNumber(withExtra.months) + " months", rawValue: withExtra.months },
          { label: "With extra payment: interest saved", value: lib.fmtCurrency(interestSaved), rawValue: interestSaved }
        );
        note = "Paying " + lib.fmtCurrency(extraPayment) + " extra each month pays this off " + monthsSaved + " month" + (monthsSaved === 1 ? "" : "s") + " sooner.";
      }
    }

    return { rows: rows, note: note };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
