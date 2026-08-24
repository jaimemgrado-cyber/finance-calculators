/*
 * Investment Calculator — compute module.
 * Future value of a lump sum with annual compounding: FV = P(1+r)^n.
 * Also shows that amount in today's purchasing power by deflating with a
 * user-supplied inflation rate: real FV = FV / (1+inflation)^n. Both rates
 * are assumptions the user provides — this tool doesn't assume or predict
 * any specific market return or inflation figure.
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  function compute(v) {
    var initial = v.initialInvestment;
    var annualReturn = v.expectedAnnualReturn;
    var years = v.years;
    var inflationRate = v.expectedInflationRate || 0;

    if (years <= 0) {
      return { error: "Time period must be greater than zero." };
    }

    var nominalFV = initial * Math.pow(1 + annualReturn / 100, years);
    var realFV = nominalFV / Math.pow(1 + inflationRate / 100, years);
    var totalGain = nominalFV - initial;

    if (!lib.isSafe(nominalFV) || !lib.isSafe(realFV)) {
      return { error: "We couldn't calculate a result with these values." };
    }

    return {
      rows: [
        { label: "Starting investment", value: lib.fmtCurrency(initial), rawValue: initial },
        { label: "Total gain (nominal)", value: lib.fmtCurrency(totalGain), rawValue: totalGain },
        { label: "Future value (nominal)", value: lib.fmtCurrency(nominalFV), rawValue: nominalFV },
        { label: "Future value in today's dollars", value: lib.fmtCurrency(realFV), rawValue: realFV, isTotal: true }
      ],
      note: "Assumes annual compounding at a constant return, which isn't guaranteed. The 'today's dollars' figure adjusts for the inflation rate you entered so you can compare purchasing power, not just the dollar amount."
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
