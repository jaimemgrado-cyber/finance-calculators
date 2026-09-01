/*
 * ROI Calculator — compute module.
 * ROI% = (finalValue - initialInvestment) / initialInvestment * 100
 * Annualized return uses the standard CAGR formula:
 *   CAGR = (finalValue / initialInvestment)^(1/years) - 1
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  function compute(v) {
    var initial = v.initialInvestment;
    var finalValue = v.finalValue;
    var years = v.years;

    if (initial <= 0) {
      return { error: "Initial investment must be greater than zero." };
    }

    var gain = finalValue - initial;
    var roiPercent = (gain / initial) * 100;

    var rows = [
      { label: "Net gain or loss", value: lib.fmtCurrency(gain), rawValue: gain },
      { label: "ROI", value: lib.fmtNumber(roiPercent) + "%", rawValue: roiPercent, isTotal: true }
    ];

    var note = "Total return over the full period, not annualized.";

    if (years > 0) {
      if (finalValue < 0 || initial <= 0) {
        // avoid Math.pow with negative base producing NaN for fractional exponents
      } else {
        var cagr = (Math.pow(finalValue / initial, 1 / years) - 1) * 100;
        if (lib.isSafe(cagr)) {
          rows.push({ label: "Annualized return (CAGR)", value: lib.fmtNumber(cagr) + "%", rawValue: cagr });
          note = "CAGR assumes steady growth every year, which real investments rarely deliver exactly.";
        }
      }
    }

    if (!lib.isSafe(gain) || !lib.isSafe(roiPercent)) {
      return { error: "We couldn't calculate a result with these values." };
    }

    return {
      rows: rows,
      note: note,
      scale: {
        label: "Return on investment",
        min: -50,
        max: 100,
        value: roiPercent,
        valueDisplay: lib.fmtNumber(roiPercent) + "%",
        lowLabel: "Loss",
        highLabel: "Strong gain",
        kind: "computed",
        interpretation: roiPercent >= 0
          ? "You gained " + lib.fmtNumber(roiPercent) + "% on your initial investment over this period."
          : "You lost " + lib.fmtNumber(Math.abs(roiPercent)) + "% of your initial investment over this period."
      }
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
