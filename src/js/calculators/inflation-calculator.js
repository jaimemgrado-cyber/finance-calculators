/*
 * Inflation Calculator — compute module.
 * futureCost = amount * (1 + rate/100)^years
 * Uses a rate the user provides rather than historical CPI data — see the
 * page content for why (CPI is real historical data we don't hardcode here).
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  function compute(v) {
    var amount = v.amount;
    var inflationRate = v.annualInflationRate;
    var years = v.years;

    var futureCost = amount * Math.pow(1 + inflationRate / 100, years);
    var difference = futureCost - amount;
    var percentIncrease = amount > 0 ? (difference / amount) * 100 : 0;

    if (!lib.isSafe(futureCost)) {
      return { error: "We couldn't calculate a result with these values." };
    }

    return {
      rows: [
        { label: "Today's amount", value: lib.fmtCurrency(amount), rawValue: amount },
        { label: "Additional cost from inflation", value: lib.fmtCurrency(difference), rawValue: difference },
        { label: "Total increase", value: lib.fmtNumber(percentIncrease) + "%", rawValue: percentIncrease },
        { label: "Equivalent cost in " + years + " years", value: lib.fmtCurrency(futureCost), rawValue: futureCost, isTotal: true }
      ],
      note: "Uses the inflation rate you entered, applied evenly every year — real inflation varies year to year and isn't predictable this far out."
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
