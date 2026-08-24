/*
 * Percentage Calculator — compute module.
 * result = value * (percent / 100)
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  function compute(v) {
    var percent = v.percent;
    var value = v.baseValue;

    var result = value * (percent / 100);
    var increased = value + result;
    var decreased = value - result;

    if (![result, increased, decreased].every(lib.isSafe)) {
      return { error: "We couldn't calculate a result with these values." };
    }

    return {
      rows: [
        { label: percent + "% of " + lib.fmtNumber(value), value: lib.fmtNumber(result), rawValue: result, isTotal: true },
        { label: "Value increased by " + percent + "%", value: lib.fmtNumber(increased), rawValue: increased },
        { label: "Value decreased by " + percent + "%", value: lib.fmtNumber(decreased), rawValue: decreased }
      ],
      note: "Works with any numbers — dollars, quantities, or plain percentages."
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
