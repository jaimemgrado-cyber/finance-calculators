/*
 * Salary to Hourly Calculator — compute module.
 * hourlyRate = annualSalary / (hoursPerWeek * weeksPerYear)
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  function compute(v) {
    var annualSalary = v.annualSalary;
    var hoursPerWeek = v.hoursPerWeek;
    var weeksPerYear = v.weeksPerYear;

    var totalHours = hoursPerWeek * weeksPerYear;
    if (totalHours <= 0) {
      return { error: "Hours per week and weeks per year must be greater than zero." };
    }

    var hourlyRate = annualSalary / totalHours;
    var weeklyRate = hourlyRate * hoursPerWeek;

    if (!lib.isSafe(hourlyRate)) {
      return { error: "We couldn't calculate a result with these values." };
    }

    return {
      rows: [
        { label: "Total hours worked per year", value: lib.fmtNumber(totalHours), rawValue: totalHours },
        { label: "Weekly (gross)", value: lib.fmtCurrency(weeklyRate), rawValue: weeklyRate },
        { label: "Equivalent hourly rate", value: lib.fmtCurrency(hourlyRate), rawValue: hourlyRate, isTotal: true }
      ],
      note: "Gross figures, before taxes or other withholdings."
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
