/*
 * Mortgage Affordability Calculator — compute module.
 * Solves for the maximum home price whose total monthly housing payment
 * (principal, interest, property tax, insurance, HOA) does not exceed the
 * lower of two commonly cited lending guidelines:
 *   - front-end ratio: housing payment <= 28% of gross monthly income
 *   - back-end ratio: housing payment + other debts <= 36% of gross monthly income
 * These 28%/36% figures are a widely used conventional-lending guideline,
 * not a law or a guarantee of approval — actual limits vary by lender and
 * loan program (e.g. many "qualified mortgages" allow back-end DTI up to
 * 43% per the CFPB's Ability-to-Repay rule).
 * Because property tax and maintenance scale with home price, the max
 * price is solved algebraically rather than guessed: the monthly
 * principal-and-interest payment and the monthly tax are both linear
 * functions of home price for a fixed rate/term, so the whole equation
 * (payment budget = P&I(price) + tax(price) + insurance + HOA) is linear
 * in price and solvable directly.
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  function compute(v) {
    var monthlyIncome = v.monthlyGrossIncome;
    var monthlyDebts = v.monthlyDebts || 0;
    var downPayment = v.downPayment || 0;
    var interestRate = v.interestRate;
    var loanTermYears = v.loanTermYears;
    var propertyTaxRate = v.propertyTaxRate || 0;
    var annualHomeInsurance = v.annualHomeInsurance || 0;
    var monthlyHOA = v.monthlyHOA || 0;

    if (monthlyIncome <= 0) {
      return { error: "Monthly income must be greater than zero." };
    }

    var maxFrontEnd = monthlyIncome * 0.28;
    var maxBackEnd = monthlyIncome * 0.36 - monthlyDebts;
    var maxHousingPayment = Math.max(0, Math.min(maxFrontEnd, maxBackEnd));
    var bindingRule = maxFrontEnd <= maxBackEnd ? "28% front-end" : "36% back-end";

    if (maxHousingPayment <= 0) {
      return { error: "Based on your income and existing debts, this guideline suggests $0 available for a housing payment. Try lowering your other monthly debts." };
    }

    var n = Math.round(loanTermYears * 12);
    var i = interestRate / 100 / 12;
    var monthlyInsurance = annualHomeInsurance / 12;

    // k = the P&I payment per dollar of loan principal (constant for a
    // given rate/term). monthlyPI(price) = (price - downPayment) * k.
    var k;
    if (i === 0) {
      k = 1 / n;
    } else {
      var factor = Math.pow(1 + i, n);
      k = (i * factor) / (factor - 1);
    }

    // maxHousingPayment = (price - downPayment)*k + price*taxRate/1200 + monthlyInsurance + monthlyHOA
    // => price*(k + taxRate/1200) = maxHousingPayment + downPayment*k - monthlyInsurance - monthlyHOA
    var denom = k + propertyTaxRate / 1200;
    var numerator = maxHousingPayment + downPayment * k - monthlyInsurance - monthlyHOA;
    var maxHomePrice = numerator / denom;

    if (!lib.isSafe(maxHomePrice) || maxHomePrice <= downPayment) {
      return { error: "We couldn't find an affordable home price with these numbers. Try adjusting your debts, down payment, or insurance/HOA estimates." };
    }

    var loanAmount = maxHomePrice - downPayment;
    var monthlyPI = loanAmount * k;
    var monthlyTax = maxHomePrice * propertyTaxRate / 1200;
    var totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA;
    var backEndDTI = ((totalMonthly + monthlyDebts) / monthlyIncome) * 100;

    return {
      rows: [
        { label: "Maximum home price", value: lib.fmtCurrency(maxHomePrice), rawValue: maxHomePrice, isTotal: true },
        { label: "Loan amount", value: lib.fmtCurrency(loanAmount), rawValue: loanAmount },
        { label: "Est. monthly payment (PITI)", value: lib.fmtCurrency(totalMonthly), rawValue: totalMonthly },
        { label: "Binding guideline", value: bindingRule, rawValue: bindingRule }
      ],
      note: "Based on the " + bindingRule + " guideline for your income and debts. This is a widely used lending reference point, not a loan pre-approval — actual limits depend on your credit, the lender, and the loan program.",
      scale: {
        label: "Back-end debt-to-income at this price",
        min: 0,
        max: 50,
        value: backEndDTI,
        valueDisplay: lib.fmtNumber(backEndDTI) + "%",
        lowLabel: "0%",
        highLabel: "50%",
        kind: "guideline",
        interpretation: "At this home price, your total debt payments (including the new mortgage) would be " + lib.fmtNumber(backEndDTI) + "% of your gross monthly income.",
        source: "Reference points: 28% front-end / 36% back-end is a common conventional-lending guideline; the CFPB's Ability-to-Repay rule allows Qualified Mortgages up to 43% back-end DTI. Neither is personalized advice or a guarantee of approval."
      }
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
