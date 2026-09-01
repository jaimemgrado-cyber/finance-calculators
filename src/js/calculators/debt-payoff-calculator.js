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
    var history = [balance];
    if (payment <= remaining * monthlyRate) return null;
    while (remaining > 0 && months < MAX_MONTHS) {
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

    var totalPaid = base.totalInterest + balance;
    var interestShare = totalPaid > 0 ? (base.totalInterest / totalPaid) * 100 : 0;

    return {
      rows: rows,
      note: note,
      scale: {
        label: "Interest as a share of total payoff cost",
        min: 0,
        max: 100,
        value: interestShare,
        valueDisplay: lib.fmtNumber(interestShare) + "%",
        lowLabel: "Mostly principal",
        highLabel: "Mostly interest",
        kind: "computed",
        interpretation: "Of the " + lib.fmtCurrency(totalPaid) + " you'll pay in total at this payment, " + lib.fmtNumber(interestShare) + "% (" + lib.fmtCurrency(base.totalInterest) + ") is interest rather than paying down the balance. A higher share generally means a higher rate, a longer payoff, or both."
      },
      chart: buildDebtChart(base)
    };
  }

  // Builds the "balance over time" chart from month-by-month history,
  // sampled down to ~12 points so long payoffs stay readable.
  function buildDebtChart(base) {
    var sampled = sampleHistory(base.history);
    var totalMonths = base.history.length - 1;
    var step = Math.max(1, Math.ceil(totalMonths / (sampled.length - 1 || 1)));
    var labels = sampled.map(function (_, idx) {
      return "Mo " + Math.min(idx * step, totalMonths);
    });
    return { title: "Balance over time", labels: labels, series: [{ name: "Balance", data: sampled, color: "#C1583B" }] };
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

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
