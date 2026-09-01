/*
 * Dividend Calculator — compute module.
 * Projects dividend income and portfolio value year by year given a
 * starting position, dividend yield, an assumed annual dividend growth
 * rate, and an assumed annual share-price growth rate. Optionally
 * reinvests dividends into more shares each year (DRIP-style).
 * This is a projection based on rates you supply, not a prediction —
 * real dividend yields, growth, and share prices vary continuously.
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  function compute(v) {
    var shares = v.numberOfShares;
    var price = v.sharePrice;
    var yieldPercent = v.dividendYieldPercent;
    var dividendGrowth = v.dividendGrowthPercent || 0;
    var priceGrowth = v.priceAppreciationPercent || 0;
    var years = Math.round(v.years);
    var reinvest = v.reinvestDividends === "yes";

    if (shares <= 0 || price <= 0) {
      return { error: "Number of shares and share price must be greater than zero." };
    }
    if (years <= 0) {
      return { error: "Number of years must be greater than zero." };
    }

    var initialInvestment = shares * price;
    var dividendPerShare = price * (yieldPercent / 100);
    var currentShares = shares;
    var currentPrice = price;
    var totalDividendsReceived = 0;

    var pointYears = buildYearPoints(years);
    var valueLine = [];
    var pointIdx = 0;

    for (var yr = 1; yr <= years; yr++) {
      var dividendPaid = currentShares * dividendPerShare;
      totalDividendsReceived += dividendPaid;
      if (reinvest && currentPrice > 0) {
        currentShares += dividendPaid / currentPrice;
      }
      currentPrice = currentPrice * (1 + priceGrowth / 100);
      dividendPerShare = dividendPerShare * (1 + dividendGrowth / 100);

      if (pointYears.indexOf(yr) !== -1) {
        valueLine.push(currentShares * currentPrice);
      }
    }
    // Always include year 0 at the start of the series.
    valueLine.unshift(initialInvestment);
    if (pointYears[0] !== 0) pointYears.unshift(0);

    var finalPortfolioValue = currentShares * currentPrice;
    var totalReturnValue = reinvest ? finalPortfolioValue : finalPortfolioValue + totalDividendsReceived;
    var totalReturnPercent = initialInvestment > 0 ? ((totalReturnValue - initialInvestment) / initialInvestment) * 100 : 0;

    if (!lib.isSafe(finalPortfolioValue) || !lib.isSafe(totalDividendsReceived)) {
      return { error: "We couldn't calculate a result with these values." };
    }

    var rows = [
      { label: "Initial investment", value: lib.fmtCurrency(initialInvestment), rawValue: initialInvestment },
      { label: "Total dividends received", value: lib.fmtCurrency(totalDividendsReceived), rawValue: totalDividendsReceived },
      { label: "Final portfolio value", value: lib.fmtCurrency(finalPortfolioValue), rawValue: finalPortfolioValue, isTotal: true }
    ];
    if (reinvest) {
      rows.push({ label: "Final share count", value: lib.fmtNumber(currentShares), rawValue: currentShares });
    }

    return {
      rows: rows,
      note: reinvest
        ? "Assumes every dividend is used to buy more shares at the then-current price, and that both the dividend and the share price grow at the steady rates you entered."
        : "Assumes dividends are taken as cash (not reinvested), and that both the dividend and the share price grow at the steady rates you entered.",
      scale: {
        label: "Total return over the period",
        min: -20,
        max: 100,
        value: totalReturnPercent,
        valueDisplay: lib.fmtNumber(totalReturnPercent) + "%",
        lowLabel: "Loss",
        highLabel: "Strong gain",
        kind: "computed",
        interpretation: "Combining price growth and dividends" + (reinvest ? " reinvested" : " taken as cash") + ", this projects a " + lib.fmtNumber(totalReturnPercent) + "% total return over " + years + " year" + (years === 1 ? "" : "s") + " at the rates you entered."
      },
      chart: {
        title: reinvest ? "Portfolio value over time (dividends reinvested)" : "Share value over time",
        labels: pointYears.map(function (yr) { return "Yr " + yr; }),
        series: [{ name: "Portfolio value", data: valueLine, color: "#12A48C" }]
      }
    };
  }

  function buildYearPoints(years) {
    var maxPoints = 11;
    var step = Math.max(1, Math.ceil(years / maxPoints));
    var pts = [];
    for (var yr = step; yr < years; yr += step) pts.push(yr);
    pts.push(years);
    return pts;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
