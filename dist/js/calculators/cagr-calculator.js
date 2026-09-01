/*
 * CAGR (Compound Annual Growth Rate) Calculator — compute module.
 * CAGR = (endingValue / beginningValue)^(1/years) - 1
 * The standard formula for the constant annual rate that would take a
 * beginning value to an ending value over a number of years, smoothing
 * out any actual year-to-year volatility.
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  function compute(v) {
    var beginningValue = v.beginningValue;
    var endingValue = v.endingValue;
    var years = v.years;

    if (beginningValue <= 0) {
      return { error: "Beginning value must be greater than zero." };
    }
    if (years <= 0) {
      return { error: "Number of years must be greater than zero." };
    }

    var totalGrowthPercent = ((endingValue - beginningValue) / beginningValue) * 100;
    var cagr;
    if (endingValue <= 0) {
      return { error: "Ending value must be greater than zero to compute a compound growth rate." };
    }
    cagr = (Math.pow(endingValue / beginningValue, 1 / years) - 1) * 100;

    if (!lib.isSafe(cagr)) {
      return { error: "We couldn't calculate a result with these values." };
    }

    return {
      rows: [
        { label: "Total growth", value: lib.fmtNumber(totalGrowthPercent) + "%", rawValue: totalGrowthPercent },
        { label: "Compound annual growth rate (CAGR)", value: lib.fmtNumber(cagr) + "%", rawValue: cagr, isTotal: true }
      ],
      note: "CAGR is the smoothed, constant annual rate that connects the beginning and ending values — actual year-to-year returns are almost always uneven even when CAGR is positive.",
      scale: {
        label: "Compound annual growth rate",
        min: -20,
        max: 30,
        value: cagr,
        valueDisplay: lib.fmtNumber(cagr) + "%",
        lowLabel: "Loss",
        highLabel: "Strong growth",
        kind: "computed",
        interpretation: cagr >= 0
          ? "This investment grew at an average of " + lib.fmtNumber(cagr) + "% per year, compounded, over the period."
          : "This investment lost an average of " + lib.fmtNumber(Math.abs(cagr)) + "% per year, compounded, over the period."
      }
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
