/*
 * Personal Loan Calculator — compute module.
 * Same amortization formula as the generic loan calculator, but also
 * models an origination fee: many personal loans deduct a fee from the
 * loan amount before disbursing it, so the amount you receive is less
 * than the amount you repay.
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  function compute(v) {
    var loanAmount = v.loanAmount;
    var originationFeePercent = v.originationFeePercent || 0;
    var interestRate = v.interestRate;
    var loanTermMonths = Math.round(v.loanTermMonths);

    if (loanAmount <= 0) {
      return { error: "Loan amount must be greater than zero." };
    }
    if (loanTermMonths <= 0) {
      return { error: "Loan term must be greater than zero." };
    }

    var fee = loanAmount * (originationFeePercent / 100);
    var amountReceived = loanAmount - fee;

    var i = interestRate / 100 / 12;
    var monthlyPayment;
    if (i === 0) {
      monthlyPayment = loanAmount / loanTermMonths;
    } else {
      var factor = Math.pow(1 + i, loanTermMonths);
      monthlyPayment = loanAmount * (i * factor) / (factor - 1);
    }

    if (!lib.isSafe(monthlyPayment)) {
      return { error: "We couldn't calculate a payment with these values. Try adjusting the rate or term." };
    }

    var totalPaid = monthlyPayment * loanTermMonths;
    var totalInterest = totalPaid - loanAmount;

    var rows = [
      { label: "Amount received (after fee)", value: lib.fmtCurrency(amountReceived), rawValue: amountReceived }
    ];
    if (fee > 0) {
      rows.push({ label: "Origination fee", value: lib.fmtCurrency(fee), rawValue: fee });
    }
    rows.push(
      { label: "Monthly payment", value: lib.fmtCurrency(monthlyPayment), rawValue: monthlyPayment, isTotal: true },
      { label: "Total interest paid", value: lib.fmtCurrency(totalInterest), rawValue: totalInterest }
    );

    return {
      rows: rows,
      note: "The monthly payment is based on the full loan amount — the origination fee reduces what you receive, not what you repay."
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
