const path = require('path');
function load(name) { return require(path.join(__dirname, '..', 'src', 'js', 'calculators', name)); }
function approx(a, b, tol) { return Math.abs(a - b) <= (tol || 0.5); }
let pass = 0, fail = 0;
function check(name, cond, detail) {
  if (cond) { pass++; } else { fail++; console.log('FAIL:', name, detail || ''); }
}

// Mortgage Affordability: the resulting max price should make the
// front-end (or back-end, whichever binds) budget check out exactly.
{
  const c = load('mortgage-affordability-calculator.js');
  const r = c({ monthlyGrossIncome: 8000, monthlyDebts: 400, downPayment: 40000, interestRate: 6.5, loanTermYears: 30, propertyTaxRate: 1.1, annualHomeInsurance: 1500, monthlyHOA: 0 });
  check('affordability: front-end used when it is the lower cap', r.rows[3].rawValue === '28% front-end', r.rows);
  check('affordability: monthly payment <= 28% of income (+tiny rounding)', r.rows[2].rawValue <= 8000 * 0.28 + 0.01, r.rows);
  const rBad = c({ monthlyGrossIncome: 0, monthlyDebts: 0, downPayment: 0, interestRate: 6, loanTermYears: 30, propertyTaxRate: 1, annualHomeInsurance: 0, monthlyHOA: 0 });
  check('affordability: zero income errors', !!rBad.error);
}

// Rent vs Buy: with 0% for every rate, net cost of buying should equal
// upfront + (P&I*12+tax+insurance+maintenance)*years - (finalValue - remainingBalance - sellingCosts),
// and net cost of renting should equal simple rent*12*years (no growth, no opportunity gain).
{
  const c = load('rent-vs-buy-calculator.js');
  const r = c({ homePrice: 300000, downPayment: 60000, interestRate: 0, loanTermYears: 30, propertyTaxRate: 0, annualHomeInsurance: 0, maintenanceRate: 0, closingCostRate: 0, homeAppreciationRate: 0, sellingCostRate: 0, monthlyRent: 2000, rentIncreaseRate: 0, investmentReturnRate: 0, analysisYears: 5 });
  // renting cost = 2000*12*5 = 120000 exactly (no growth, no opportunity gain since down payment isn't invested at 0%... but opportunityGain=upfront*((1+0)^5-1)=0)
  check('rent vs buy: flat renting cost with all rates at 0%', approx(r.rows[1].rawValue, 120000, 1), r.rows);
  check('rent vs buy: chart has one point per year', r.chart.labels.length === 5, r.chart);
}

// Down Payment: basic percentage math + PMI guideline flag direction
{
  const c = load('down-payment-calculator.js');
  const r = c({ homePrice: 200000, downPaymentPercent: 20, currentSavings: 0, monthlySavings: 0 });
  check('down payment: 20% of 200k = 40000', approx(r.rows[0].rawValue, 40000, 0.01), r.rows);
  check('down payment: loan amount = 160000', approx(r.rows[1].rawValue, 160000, 0.01), r.rows);
  check('down payment: at 20% guideline says at/above threshold', r.scale.interpretation.indexOf('at or above') !== -1, r.scale);
}

// Mortgage Payoff: 0% interest means payment = balance / months exactly,
// and payoff time should equal the remaining term exactly.
{
  const c = load('mortgage-payoff-calculator.js');
  const r = c({ currentBalance: 120000, interestRate: 0, remainingTermYears: 10, extraMonthlyPayment: 0 });
  check('mortgage payoff: 0% payment = balance/months', approx(r.rows[0].rawValue, 120000 / 120, 0.01), r.rows);
  check('mortgage payoff: 0% payoff time = full term', r.rows[1].rawValue === 120, r.rows);
}

// CAGR: known values, e.g. doubling over 10 years ~ 7.177%
{
  const c = load('cagr-calculator.js');
  const r = c({ beginningValue: 10000, endingValue: 20000, years: 10 });
  check('cagr: doubling over 10yr ~= 7.18%', approx(r.rows[1].rawValue, 7.177, 0.01), r.rows);
  const rBad = c({ beginningValue: 0, endingValue: 20000, years: 10 });
  check('cagr: zero beginning value errors', !!rBad.error);
}

// Dividend: no reinvestment, no growth -> dividends are flat and total = shares*price*yield*years
{
  const c = load('dividend-calculator.js');
  const r = c({ numberOfShares: 100, sharePrice: 50, dividendYieldPercent: 4, dividendGrowthPercent: 0, priceAppreciationPercent: 0, years: 5, reinvestDividends: 'no' });
  // dividendPerShare = 50*0.04 = 2/share/yr, flat, x100 shares x5yr = 1000
  check('dividend: flat no-growth no-reinvest total = 1000', approx(r.rows[1].rawValue, 1000, 0.01), r.rows);
  check('dividend: final portfolio value unchanged at 0% price growth', approx(r.rows[2].rawValue, 5000, 0.01), r.rows);
}

// FIRE: 0% return -> years to reach fireNumber is a simple linear division
{
  const c = load('fire-calculator.js');
  const r = c({ currentAge: 30, currentSavings: 0, monthlyContribution: 5000, expectedAnnualReturn: 0, annualExpenses: 60000, withdrawalRatePercent: 4 });
  // fireNumber = 60000/0.04 = 1,500,000; months = 1500000/5000 = 300 -> 25 years
  check('fire: fireNumber = 1,500,000', approx(r.rows[0].rawValue, 1500000, 0.01), r.rows);
  check('fire: 0% return years = 25', approx(r.rows[1].rawValue, 25, 0.05), r.rows);
}

// Debt-to-Income: exact division math
{
  const c = load('debt-to-income-calculator.js');
  const r = c({ monthlyGrossIncome: 5000, monthlyHousingPayment: 1250, otherMonthlyDebtPayments: 250 });
  check('dti: front-end = 25%', approx(r.rows[0].rawValue, 25, 0.01), r.rows);
  check('dti: back-end = 30%', approx(r.rows[1].rawValue, 30, 0.01), r.rows);
}

// Emergency Fund: target and months-to-reach math
{
  const c = load('emergency-fund-calculator.js');
  const r = c({ monthlyEssentialExpenses: 2500, currentSavings: 5000, targetMonthsCoverage: 6, monthlySavingsContribution: 500 });
  check('emergency fund: target = 15000', approx(r.rows[0].rawValue, 15000, 0.01), r.rows);
  check('emergency fund: gap = 10000', approx(r.rows[2].rawValue, 10000, 0.01), r.rows);
  check('emergency fund: months to reach = 20', r.rows[3].rawValue === 20, r.rows);
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
