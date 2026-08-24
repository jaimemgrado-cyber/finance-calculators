const path = require('path');
function load(name) { return require(path.join(__dirname, '..', 'src', 'js', 'calculators', name)); }

function approx(a, b, tol) { return Math.abs(a - b) <= (tol || 0.5); }
let pass = 0, fail = 0;
function check(name, cond, detail) {
  if (cond) { pass++; }
  else { fail++; console.log('FAIL:', name, detail || ''); }
}

// Mortgage: known value $240k principal, 6% APR, 30yr -> ~$1,438.92/mo P&I
{
  const compute = load('mortgage-calculator.js');
  const r = compute({ homePrice: 300000, downPayment: 60000, interestRate: 6, loanTermYears: 30, annualPropertyTax: 0, annualHomeInsurance: 0, monthlyHOA: 0 });
  const pi = r.rows.find(x => x.label === 'Principal & interest').rawValue;
  check('mortgage known P&I ~1438.92', approx(pi, 1438.92, 0.5), pi);

  // zero interest edge case
  const r2 = compute({ homePrice: 120000, downPayment: 20000, interestRate: 0, loanTermYears: 10, annualPropertyTax: 0, annualHomeInsurance: 0, monthlyHOA: 0 });
  const pi2 = r2.rows.find(x => x.label === 'Principal & interest').rawValue;
  check('mortgage 0% interest = principal/months', approx(pi2, 100000 / 120, 0.01), pi2);

  // down payment >= price -> error
  const r3 = compute({ homePrice: 100000, downPayment: 100000, interestRate: 5, loanTermYears: 30 });
  check('mortgage down>=price errors', !!r3.error, JSON.stringify(r3));
}

// Auto loan
{
  const compute = load('auto-loan-calculator.js');
  const r = compute({ vehiclePrice: 30000, downPayment: 5000, tradeInValue: 0, interestRate: 5, loanTermMonths: 60 });
  const pay = r.rows.find(x => x.isTotal).rawValue;
  check('auto loan payment positive & finite', isFinite(pay) && pay > 0, pay);
  // sanity: standard calculators give ~$471.78 for $25k at 5% / 60mo
  check('auto loan known payment ~471.78', approx(pay, 471.78, 0.5), pay);

  const rBad = compute({ vehiclePrice: 20000, downPayment: 15000, tradeInValue: 6000, interestRate: 5, loanTermMonths: 60 });
  check('auto loan down+trade>price errors', !!rBad.error, JSON.stringify(rBad));
}

// Compound interest
{
  const compute = load('compound-interest-calculator.js');
  // P=10000, no contributions, 5% annual, 10 years, monthly compounding
  const r = compute({ initialAmount: 10000, monthlyContribution: 0, annualInterestRate: 5, years: 10 });
  const fv = r.rows.find(x => x.isTotal).rawValue;
  // FV = 10000*(1+0.05/12)^120 ≈ 16470.09
  check('compound interest known FV ~16470', approx(fv, 16470.09, 1), fv);

  const rZero = compute({ initialAmount: 1000, monthlyContribution: 100, annualInterestRate: 0, years: 1 });
  const fvZero = rZero.rows.find(x => x.isTotal).rawValue;
  check('compound interest 0% = simple sum', approx(fvZero, 1000 + 100 * 12, 0.01), fvZero);
}

// Savings goal
{
  const compute = load('savings-calculator.js');
  const r = compute({ goalAmount: 20000, currentSavings: 0, annualInterestRate: 0, years: 2 });
  const req = r.rows.find(x => x.isTotal).rawValue;
  check('savings goal 0% = goal/months', approx(req, 20000 / 24, 0.01), req);

  const r2 = compute({ goalAmount: 5000, currentSavings: 10000, annualInterestRate: 3, years: 5 });
  check('savings goal already exceeded -> 0 required', r2.rows.find(x => x.isTotal).rawValue === 0, r2);
}

// Credit card payoff
{
  const compute = load('credit-card-payoff-calculator.js');
  const r = compute({ currentBalance: 5000, apr: 20, monthlyPayment: 200 });
  check('credit card payoff finite months', isFinite(r.rows[0].rawValue) && r.rows[0].rawValue > 0, r.rows[0]);
  const rBad = compute({ currentBalance: 5000, apr: 20, monthlyPayment: 50 }); // 50 < 5000*0.2/12=83.33 interest
  check('credit card payment too low errors', !!rBad.error, JSON.stringify(rBad));
}

// Salary
{
  const compute = load('salary-calculator.js');
  const r = compute({ hourlyRate: 25, hoursPerWeek: 40, weeksPerYear: 52 });
  const annual = r.rows.find(x => x.isTotal).rawValue;
  check('salary annual = 25*40*52=52000', approx(annual, 52000, 0.01), annual);
}

// Sales tax
{
  const compute = load('sales-tax-calculator.js');
  const r = compute({ price: 100, taxRate: 8.25 });
  const total = r.rows.find(x => x.isTotal).rawValue;
  check('sales tax total = 108.25', approx(total, 108.25, 0.01), total);
}

// Tip
{
  const compute = load('tip-calculator.js');
  const r = compute({ billAmount: 80, tipPercent: 20, numberOfPeople: 4 });
  const perPerson = r.rows.find(x => x.isTotal).rawValue;
  check('tip per person = 96/4=24', approx(perPerson, 24, 0.01), perPerson);
}

// Percentage
{
  const compute = load('percentage-calculator.js');
  const r = compute({ percent: 15, baseValue: 200 });
  const result = r.rows.find(x => x.isTotal).rawValue;
  check('15% of 200 = 30', approx(result, 30, 0.01), result);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
