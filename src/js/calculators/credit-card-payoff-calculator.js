/*
 * Credit Card Payoff Calculator — compute module.
 * Simulates the balance month by month: each month, interest accrues on
 * the remaining balance at the monthly rate, then the payment is applied.
 * This is the standard method card issuers use to disclose payoff time,
 * simulated directly rather than approximated with a closed-form formula.
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  var MAX_MONTHS = 600; // 50 years — a practical safety cap, not a real limit

  function compute(v) {
    var balance = v.currentBalance;
    var apr = v.apr;
    var monthlyPayment = v.monthlyPayment;

    var monthlyRate = apr / 100 / 12;
    var firstInterest = balance * monthlyRate;

    if (monthlyPayment <= firstInterest) {
      return { error: "This payment only covers interest (or less). Increase the monthly payment so it also reduces the balance." };
    }

    var remaining = balance;
    var totalInterest = 0;
    var months = 0;
    var history = [balance];

    while (remaining > 0 && months < MAX_MONTHS) {
      var interest = remaining * monthlyRate;
      var principalPaid = monthlyPayment - interest;
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

    if (remaining > 0) {
      return { error: "At this payment, it would take more than 50 years to pay off the balance. Try a higher monthly payment." };
    }

    var totalPaid = balance + totalInterest;
    var years = Math.floor(months / 12);
    var remMonths = months % 12;
    var timeLabel = (years > 0 ? years + (years === 1 ? " year" : " years") : "") +
      (years > 0 && remMonths > 0 ? ", " : "") +
      (remMonths > 0 ? remMonths + (remMonths === 1 ? " month" : " months") : "");
    if (!timeLabel) timeLabel = "0 months";

    if (!lib.isSafe(totalInterest) || !lib.isSafe(totalPaid)) {
      return { error: "We couldn't calculate a result with these values." };
    }

    return {
      rows: [
        { label: "Time to pay off", value: timeLabel, rawValue: months },
        { label: "Number of payments", value: lib.fmtNumber(months), rawValue: months },
        { label: "Total interest paid", value: lib.fmtCurrency(totalInterest), rawValue: totalInterest },
        { label: "Total paid (balance + interest)", value: lib.fmtCurrency(totalPaid), rawValue: totalPaid, isTotal: true }
      ],
      note: "Assumes no new charges are added to the card and the payment is made in full every month.",
      scale: {
        label: "Interest as a share of total payoff cost",
        min: 0,
        max: 100,
        value: totalPaid > 0 ? (totalInterest / totalPaid) * 100 : 0,
        valueDisplay: lib.fmtNumber(totalPaid > 0 ? (totalInterest / totalPaid) * 100 : 0) + "%",
        lowLabel: "Mostly principal",
        highLabel: "Mostly interest",
        kind: "computed",
        interpretation: "Of the " + lib.fmtCurrency(totalPaid) + " you'll pay in total, " + lib.fmtNumber(totalPaid > 0 ? (totalInterest / totalPaid) * 100 : 0) + "% (" + lib.fmtCurrency(totalInterest) + ") is interest. Credit card APRs are typically high, so this share climbs fast with slow payoffs."
      },
      chart: buildBalanceChart(history)
    };
  }

  function buildBalanceChart(history) {
    var totalMonths = history.length - 1;
    var maxPoints = 12;
    var step = Math.max(1, Math.ceil(totalMonths / maxPoints));
    var pts = [];
    for (var m = 0; m < history.length; m += step) pts.push(history[m]);
    if (pts[pts.length - 1] !== history[history.length - 1]) pts.push(history[history.length - 1]);
    var usedStep = step;
    var labels = pts.map(function (_, idx) { return "Mo " + Math.min(idx * usedStep, totalMonths); });
    return { title: "Balance over time", labels: labels, series: [{ name: "Balance", data: pts, color: "#C1583B" }] };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
