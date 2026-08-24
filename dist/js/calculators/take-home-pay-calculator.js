/*
 * Take-Home Pay Calculator — compute module.
 * Federal income tax uses the 2026 IRS standard deduction and brackets
 * (see _tax-data.js for sources). Social Security and Medicare use the
 * actual 2026 SSA rates and wage base. State tax is a flat rate the user
 * supplies, since state income tax rules vary too widely to hardcode.
 * This is a simplification of real payroll withholding (it does not model
 * W-4 elections, local taxes, or all pre-tax benefit types) — treat it as
 * an estimate, not a paycheck.
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
    var grossIncome = v.annualGrossIncome;
    var filingStatus = ["single", "mfj", "hoh"].indexOf(v.filingStatus) !== -1 ? v.filingStatus : "single";
    var preTaxDeductions = v.preTaxDeductions || 0;
    var stateTaxRate = v.stateTaxRate || 0;

    var fica = taxData.FICA;
    var socialSecurityTax = Math.min(grossIncome, fica.socialSecurityWageBase) * fica.socialSecurityRate;
    var medicareTax = grossIncome * fica.medicareRate;
    var addlThreshold = fica.additionalMedicareThreshold[filingStatus];
    if (grossIncome > addlThreshold) {
      medicareTax += (grossIncome - addlThreshold) * fica.additionalMedicareRate;
    }

    var federalTaxableIncome = Math.max(0, grossIncome - preTaxDeductions - taxData.STANDARD_DEDUCTION[filingStatus]);
    var federalTax = taxData.bracketTax(federalTaxableIncome, filingStatus);

    var stateTax = grossIncome * (stateTaxRate / 100);

    var totalTax = federalTax + socialSecurityTax + medicareTax + stateTax;
    var takeHomePay = grossIncome - preTaxDeductions - totalTax;

    if (![federalTax, socialSecurityTax, medicareTax, stateTax, takeHomePay].every(lib.isSafe)) {
      return { error: "We couldn't calculate a result with these values." };
    }

    var rows = [
      { label: "Federal income tax", value: lib.fmtCurrency(federalTax), rawValue: federalTax },
      { label: "Social Security tax (6.2%)", value: lib.fmtCurrency(socialSecurityTax), rawValue: socialSecurityTax },
      { label: "Medicare tax", value: lib.fmtCurrency(medicareTax), rawValue: medicareTax }
    ];
    if (stateTaxRate > 0) {
      rows.push({ label: "State income tax", value: lib.fmtCurrency(stateTax), rawValue: stateTax });
    }
    if (preTaxDeductions > 0) {
      rows.push({ label: "Pre-tax deductions (401k, etc.)", value: lib.fmtCurrency(preTaxDeductions), rawValue: preTaxDeductions });
    }
    rows.push({ label: "Estimated annual take-home pay", value: lib.fmtCurrency(takeHomePay), rawValue: takeHomePay, isTotal: true });

    return {
      rows: rows,
      note: "2026 federal brackets and standard deduction (Single/MFJ/Head of Household), and 2026 Social Security/Medicare rates. State tax uses the flat rate you entered — real state tax rules vary. Doesn't include local taxes or W-4 elections."
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
