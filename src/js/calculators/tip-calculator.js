/*
 * Tip Calculator — compute module.
 * tipAmount = bill * (tipPercent / 100); split evenly across the party size.
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  function compute(v) {
    var bill = v.billAmount;
    var tipPercent = v.tipPercent;
    var people = Math.max(1, Math.round(v.numberOfPeople || 1));

    var tipAmount = bill * (tipPercent / 100);
    var total = bill + tipAmount;
    var perPerson = total / people;
    var tipPerPerson = tipAmount / people;

    if (![tipAmount, total, perPerson].every(lib.isSafe)) {
      return { error: "We couldn't calculate a result with these values." };
    }

    return {
      rows: [
        { label: "Tip amount", value: lib.fmtCurrency(tipAmount), rawValue: tipAmount },
        { label: "Total bill", value: lib.fmtCurrency(total), rawValue: total },
        { label: "Tip per person", value: lib.fmtCurrency(tipPerPerson), rawValue: tipPerPerson },
        { label: "Total per person", value: lib.fmtCurrency(perPerson), rawValue: perPerson, isTotal: true }
      ],
      note: people > 1 ? "Split evenly across " + people + " people." : "For one person."
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
