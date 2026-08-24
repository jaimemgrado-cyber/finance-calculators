/*
 * Salary Calculator — compute module.
 * Converts an hourly wage to gross pay at different intervals.
 * Gross pay only: this does not withhold taxes, benefits, or other
 * deductions, since those depend on the person's specific situation.
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  function compute(v) {
    var hourlyRate = v.hourlyRate;
    var hoursPerWeek = v.hoursPerWeek;
    var weeksPerYear = v.weeksPerYear;

    var weekly = hourlyRate * hoursPerWeek;
    var biweekly = weekly * 2;
    var annual = weekly * weeksPerYear;
    var monthly = annual / 12;

    if (![weekly, biweekly, monthly, annual].every(lib.isSafe)) {
      return { error: "We couldn't calculate a result with these values." };
    }

    return {
      rows: [
        { label: "Weekly (gross)", value: lib.fmtCurrency(weekly), rawValue: weekly },
        { label: "Biweekly (gross)", value: lib.fmtCurrency(biweekly), rawValue: biweekly },
        { label: "Monthly (gross)", value: lib.fmtCurrency(monthly), rawValue: monthly },
        { label: "Annual (gross)", value: lib.fmtCurrency(annual), rawValue: annual, isTotal: true }
      ],
      note: "These are gross figures before taxes, benefits, or other withholdings, based on the hours and weeks you entered."
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
