/*
 * Rent vs. Buy Calculator — compute module.
 * Compares the total net cost of buying a home against renting over a
 * chosen time horizon. This is a simplified model, similar in spirit to
 * widely used rent-vs-buy calculators (e.g. the New York Times' version):
 *   - Buying's net cost = upfront costs + all monthly housing costs paid
 *     over the period, minus the net proceeds you'd get from selling the
 *     home at the end (home value minus remaining loan balance minus
 *     selling costs).
 *   - Renting's net cost = all rent paid over the period, minus the
 *     investment growth you'd get by investing the upfront cash you
 *     *didn't* spend on a down payment/closing costs instead.
 * Every rate (appreciation, rent growth, investment return) is an input
 * you provide — this calculator does not predict the market. It does not
 * model mortgage interest tax deductions, PMI, or moving costs beyond the
 * selling-cost estimate.
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  function compute(v) {
    var homePrice = v.homePrice;
    var downPayment = v.downPayment;
    var interestRate = v.interestRate;
    var loanTermYears = v.loanTermYears;
    var propertyTaxRate = v.propertyTaxRate || 0;
    var annualHomeInsurance = v.annualHomeInsurance || 0;
    var maintenanceRate = v.maintenanceRate || 0;
    var closingCostRate = v.closingCostRate || 0;
    var appreciationRate = v.homeAppreciationRate || 0;
    var sellingCostRate = v.sellingCostRate || 0;
    var monthlyRent = v.monthlyRent;
    var rentIncreaseRate = v.rentIncreaseRate || 0;
    var investmentReturnRate = v.investmentReturnRate || 0;
    var years = Math.round(v.analysisYears);

    if (downPayment >= homePrice) {
      return { error: "Down payment must be less than the home price." };
    }
    if (years <= 0) {
      return { error: "Analysis period must be at least 1 year." };
    }

    var principal = homePrice - downPayment;
    var n = Math.round(loanTermYears * 12);
    var i = interestRate / 100 / 12;
    var monthlyPI;
    if (i === 0) {
      monthlyPI = principal / n;
    } else {
      var factor = Math.pow(1 + i, n);
      monthlyPI = principal * (i * factor) / (factor - 1);
    }
    if (!lib.isSafe(monthlyPI)) {
      return { error: "We couldn't calculate a payment with these values. Try adjusting the rate or term." };
    }

    var upfrontCost = downPayment + homePrice * (closingCostRate / 100);

    var buyCumulative = [];
    var rentCumulative = [];
    var buyRunning = 0;
    var rentRunning = 0;

    for (var yr = 1; yr <= years; yr++) {
      var homeValueStart = homePrice * Math.pow(1 + appreciationRate / 100, yr - 1);
      var taxThisYear = homeValueStart * (propertyTaxRate / 100);
      var maintenanceThisYear = homeValueStart * (maintenanceRate / 100);
      buyRunning += monthlyPI * 12 + taxThisYear + annualHomeInsurance + maintenanceThisYear;
      buyCumulative.push(buyRunning);

      var rentThisYear = monthlyRent * Math.pow(1 + rentIncreaseRate / 100, yr - 1) * 12;
      rentRunning += rentThisYear;
      rentCumulative.push(rentRunning);
    }

    var finalHomeValue = homePrice * Math.pow(1 + appreciationRate / 100, years);
    var monthsPaid = Math.min(n, years * 12);
    var remainingBalance;
    if (monthsPaid >= n) {
      remainingBalance = 0;
    } else if (i === 0) {
      remainingBalance = Math.max(0, principal - monthlyPI * monthsPaid);
    } else {
      var factorM = Math.pow(1 + i, monthsPaid);
      remainingBalance = Math.max(0, principal * factorM - monthlyPI * ((factorM - 1) / i));
    }
    var sellingCosts = finalHomeValue * (sellingCostRate / 100);
    var netSaleProceeds = finalHomeValue - remainingBalance - sellingCosts;

    var totalBuyingCost = upfrontCost + buyRunning - netSaleProceeds;

    var opportunityGain = upfrontCost * (Math.pow(1 + investmentReturnRate / 100, years) - 1);
    var totalRentingCost = rentRunning - opportunityGain;

    if (![totalBuyingCost, totalRentingCost].every(lib.isSafe)) {
      return { error: "We couldn't calculate a result with these values." };
    }

    var difference = totalBuyingCost - totalRentingCost;
    var cheaper = difference < 0 ? "buying" : "renting";
    var amountDiff = Math.abs(difference);

    return {
      rows: [
        { label: "Net cost of buying over " + years + " yr" + (years === 1 ? "" : "s"), value: lib.fmtCurrency(totalBuyingCost), rawValue: totalBuyingCost },
        { label: "Net cost of renting over " + years + " yr" + (years === 1 ? "" : "s"), value: lib.fmtCurrency(totalRentingCost), rawValue: totalRentingCost },
        { label: "Equity you'd have if you bought", value: lib.fmtCurrency(Math.max(0, finalHomeValue - remainingBalance)), rawValue: Math.max(0, finalHomeValue - remainingBalance) },
        { label: cheaper === "buying" ? "Buying is cheaper by" : "Renting is cheaper by", value: lib.fmtCurrency(amountDiff), rawValue: amountDiff, isTotal: true }
      ],
      note: "Net cost accounts for home equity (if buying) and investment growth on the cash you didn't spend upfront (if renting). Assumes the rates you entered hold steady, which real markets rarely do exactly — treat this as a way to compare assumptions, not a prediction.",
      chart: {
        title: "Cumulative cash paid: buying vs. renting",
        labels: buyCumulative.map(function (_, idx) { return "Yr " + (idx + 1); }),
        series: [
          { name: "Buying (cash paid)", data: buyCumulative, color: "#2C6CB0" },
          { name: "Renting (cash paid)", data: rentCumulative, color: "#C77A4A" }
        ]
      }
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
