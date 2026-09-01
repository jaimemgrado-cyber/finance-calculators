/*
 * Mortgage Payoff Calculator — compute module.
 * Given a current mortgage balance, rate, and remaining term, this derives
 * the standard fixed-rate monthly payment for that remaining balance, then
 * simulates paying it off month by month — same method as the debt payoff
 * calculator — to show the effect of an extra monthly payment on payoff
 * time and total interest.
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  function simulate(balance, monthlyRate, payment) {
    var remaining = balance;
    var totalInterest = 0;
    var months = 0;
    var history = [balance];
    if (payment <= remaining * monthlyRate) return null;
    while (remaining > 0 && months < 600) {
      var interest = remaining * monthlyRate;
      var principalPaid = payment - interest;
      if (principalPaid >= remaining) {
        totalInterest += interest;
        remaining = 0;
        months += 1;
        history.push(0);
        break;
      }
      remaining -= principalPaid;
      totalInterest += interest;
      months += 1;
      history.push(remaining);
    }
    if (remaining > 0) return null;
    return { months: months, totalInterest: totalInterest, history: history };
  }

  function sampleHistory(history) {
    var totalMonths = history.length - 1;
    var maxPoints = 12;
    var step = Math.max(1, Math.ceil(totalMonths / maxPoints));
    var pts = [];
    for (var m = 0; m < history.length; m += step) pts.push(history[m]);
    if (pts[pts.length - 1] !== history[history.length - 1]) pts.push(history[history.length - 1]);
    return pts;
  }

  function compute(v) {
    var balance = v.currentBalance;
    var apr = v.interestRate;
    var remainingYears = v.remainingTermYears;
    var extraPayment = v.extraMonthlyPayment || 0;

    var n = Math.round(remainingYears * 12);
    if (n <= 0) {
      return { error: "Remaining term must be greater than zero." };
    }
    var monthlyRate = apr / 100 / 12;

    var basePayment;
    if (monthlyRate === 0) {
      basePayment = balance / n;
    } else {
      var factor = Math.pow(1 + monthlyRate, n);
      basePayment = balance * (monthlyRate * factor) / (factor - 1);
    }
    if (!lib.isSafe(basePayment)) {
      return { error: "We couldn't calculate a payment with these values." };
    }

    var base = simulate(balance, monthlyRate, basePayment);
    if (!base) {
      return { error: "We couldn't simulate a payoff with these values." };
    }

    var rows = [
      { label: "Current monthly payment (P&I)", value: lib.fmtCurrency(basePayment), rawValue: basePayment },
      { label: "Time remaining at this payment", value: lib.fmtNumber(base.months) + " months", rawValue: base.months },
      { label: "Interest remaining at this payment", value: lib.fmtCurrency(base.totalInterest), rawValue: base.totalInterest, isTotal: true }
    ];

    var note = "Based on the fixed-rate amortization formula applied to your remaining balance and term.";

    if (extraPayment > 0) {
      var withExtra = simulate(balance, monthlyRate, basePayment + extraPayment);
      if (withExtra) {
        var monthsSaved = base.months - withExtra.months;
        var interestSaved = base.totalInterest - withExtra.totalInterest;
        rows.push(
          { label: "With extra payment: months remaining", value: lib.fmtNumber(withExtra.months), rawValue: withExtra.months },
          { label: "With extra payment: interest saved", value: lib.fmtCurrency(interestSaved), rawValue: interestSaved }
        );
        note = "Paying " + lib.fmtCurrency(extraPayment) + " extra each month pays this off " + monthsSaved + " month" + (monthsSaved === 1 ? "" : "s") + " sooner and saves " + lib.fmtCurrency(interestSaved) + " in interest.";
      }
    }

    var totalMonths = base.history.length - 1;
    var maxPoints = 12;
    var step = Math.max(1, Math.ceil(totalMonths / maxPoints));
    var labels = sampleHistory(base.history).map(function (_, idx) { return "Mo " + Math.min(idx * step, totalMonths); });

    return {
      rows: rows,
      note: note,
      scale: {
        label: "Interest remaining as a share of what's left to pay",
        min: 0,
        max: 100,
        value: base.totalInterest + balance > 0 ? (base.totalInterest / (base.totalInterest + balance)) * 100 : 0,
        valueDisplay: lib.fmtNumber(base.totalInterest + balance > 0 ? (base.totalInterest / (base.totalInterest + balance)) * 100 : 0) + "%",
        lowLabel: "Mostly principal",
        highLabel: "Mostly interest",
        kind: "computed",
        interpretation: "Of the " + lib.fmtCurrency(base.totalInterest + balance) + " left to pay at the current payment, " + lib.fmtNumber(base.totalInterest + balance > 0 ? (base.totalInterest / (base.totalInterest + balance)) * 100 : 0) + "% is interest rather than principal."
      },
      chart: { title: "Remaining balance over time", labels: labels, series: [{ name: "Balance", data: sampleHistory(base.history), color: "#C1583B" }] }
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
