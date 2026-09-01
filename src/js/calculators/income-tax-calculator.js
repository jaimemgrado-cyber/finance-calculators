/*
 * Income Tax Calculator — compute module.
 * Applies the 2026 IRS standard deduction and marginal tax brackets
 * (see _tax-data.js for sources) to estimate federal income tax owed.
 * Covers Single and Married Filing Jointly only.
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };
  var taxData = (typeof module !== "undefined" && module.exports)
    ? require("./_tax-data.js")
    : global.ClearSumTaxData;

  function compute(v) {
    var grossIncome = v.grossIncome;
    var filingStatus = ["single", "mfj", "hoh"].indexOf(v.filingStatus) !== -1 ? v.filingStatus : "single";
    var otherDeductions = v.otherDeductions || 0;

    var standardDeduction = taxData.STANDARD_DEDUCTION[filingStatus];
    var taxableIncome = Math.max(0, grossIncome - standardDeduction - otherDeductions);
    var federalTax = taxData.bracketTax(taxableIncome, filingStatus);
    var marginal = taxData.marginalRate(taxableIncome, filingStatus);
    var effectiveRate = grossIncome > 0 ? (federalTax / grossIncome) * 100 : 0;

    if (!lib.isSafe(federalTax)) {
      return { error: "We couldn't calculate a result with these values." };
    }

    return {
      rows: [
        { label: "Taxable income", value: lib.fmtCurrency(taxableIncome), rawValue: taxableIncome },
        { label: "Marginal tax bracket", value: lib.fmtNumber(marginal * 100) + "%", rawValue: marginal },
        { label: "Effective tax rate", value: lib.fmtNumber(effectiveRate) + "%", rawValue: effectiveRate },
        { label: "Estimated federal tax owed", value: lib.fmtCurrency(federalTax), rawValue: federalTax, isTotal: true }
      ],
      note: "2026 federal brackets, Single/MFJ/Head of Household. Uses the standard deduction — doesn't include credits, itemized deductions, state tax, or FICA.",
      scale: {
        label: "Effective federal tax rate",
        min: 0,
        max: 37,
        value: effectiveRate,
        valueDisplay: lib.fmtNumber(effectiveRate) + "%",
        lowLabel: "0%",
        highLabel: "37%",
        kind: "computed",
        interpretation: "Your effective rate (" + lib.fmtNumber(effectiveRate) + "%) is the share of your gross income paid in federal tax overall — it's lower than your marginal bracket (" + lib.fmtNumber(marginal * 100) + "%) because only income above each bracket threshold is taxed at that bracket's rate."
      }
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
