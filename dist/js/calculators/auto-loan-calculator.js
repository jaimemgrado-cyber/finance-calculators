/*
 * Auto Loan Calculator — compute module.
 * Same standard amortized-loan formula as the mortgage calculator,
 * applied to a vehicle loan principal (price minus down payment and trade-in).
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  function compute(v) {
    var vehiclePrice = v.vehiclePrice;
    var downPayment = v.downPayment || 0;
    var tradeInValue = v.tradeInValue || 0;
    var interestRate = v.interestRate;
    var loanTermMonths = Math.round(v.loanTermMonths);

    var principal = vehiclePrice - downPayment - tradeInValue;

    if (principal <= 0) {
      return { error: "Down payment and trade-in value can't add up to more than the vehicle price." };
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
    var interestShare = totalPaid > 0 ? (totalInterest / totalPaid) * 100 : 0;

    return {
      rows: [
        { label: "Amount financed", value: lib.fmtCurrency(principal), rawValue: principal },
        { label: "Monthly payment", value: lib.fmtCurrency(monthlyPayment), rawValue: monthlyPayment, isTotal: true },
        { label: "Total interest paid", value: lib.fmtCurrency(totalInterest), rawValue: totalInterest },
        { label: "Total of all payments", value: lib.fmtCurrency(totalPaid), rawValue: totalPaid }
      ],
      note: "Based on a fixed rate over " + loanTermMonths + " months, with no fees or taxes included.",
      scale: {
        label: "Interest as a share of total repayment",
        min: 0, max: 100, value: interestShare, valueDisplay: lib.fmtNumber(interestShare) + "%",
        lowLabel: "Mostly principal", highLabel: "Mostly interest", kind: "computed",
        interpretation: "Of the " + lib.fmtCurrency(totalPaid) + " you'll repay in total, " + lib.fmtNumber(interestShare) + "% (" + lib.fmtCurrency(totalInterest) + ") is interest."
      }
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
