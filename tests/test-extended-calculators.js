const path = require('path');
function load(name) { return require(path.join(__dirname, '..', 'src', 'js', 'calculators', name)); }
function approx(a, b, tol) { return Math.abs(a - b) <= (tol || 0.5); }
let pass = 0, fail = 0;
function check(name, cond, detail) {
  if (cond) { pass++; } else { fail++; console.log('FAIL:', name, detail || ''); }
}

// Personal loan: fee reduces amount received, payment based on full loan amount
{
  const c = load('personal-loan-calculator.js');
  const r = c({ loanAmount: 10000, originationFeePercent: 3, interestRate: 11.5, loanTermMonths: 36 });
  check('personal loan received = 9700', approx(r.rows[0].rawValue, 9700, 0.01), r.rows[0]);
  const r0 = c({ loanAmount: 10000, originationFeePercent: 0, interestRate: 0, loanTermMonths: 10 });
  check('personal loan 0% interest = amount/months', approx(r0.rows.find(x=>x.isTotal).rawValue, 1000, 0.01));
}

// Investment: known FV, and real FV via deflation
{
  const c = load('investment-calculator.js');
  const r = c({ initialInvestment: 10000, expectedAnnualReturn: 10, years: 10, expectedInflationRate: 0 });
  // FV = 10000*1.1^10 = 25937.42
  check('investment FV 10%/10yr known', approx(r.rows.find(x=>x.isTotal).rawValue, 25937.42, 1), r.rows);
  const r2 = c({ initialInvestment: 10000, expectedAnnualReturn: 5, years: 1, expectedInflationRate: 5 });
  // same rate as inflation -> real FV should equal initial (no real growth)
  check('investment real FV = initial when return=inflation', approx(r2.rows.find(x=>x.isTotal).rawValue, 10000, 0.01), r2.rows);
}

// Retirement: known compounding with contributions
{
  const c = load('retirement-calculator.js');
  const r = c({ currentAge: 25, retirementAge: 65, currentSavings: 0, monthlyContribution: 500, expectedAnnualReturn: 0 });
  // 0% return -> balance = 500*12*40 = 240000
  check('retirement 0% return = simple sum', approx(r.rows.find(x=>x.isTotal).rawValue, 240000, 0.01), r.rows);
  const rBad = c({ currentAge: 40, retirementAge: 30, currentSavings: 0, monthlyContribution: 0, expectedAnnualReturn: 5 });
  check('retirement age <= current errors', !!rBad.error);
}

// ROI: known CAGR
{
  const c = load('roi-calculator.js');
  const r = c({ initialInvestment: 10000, finalValue: 21436, years: 8 });
  // CAGR = (21436/10000)^(1/8)-1 ~ 10.0%
  const cagrRow = r.rows.find(x => x.label.indexOf('CAGR') !== -1);
  check('roi CAGR ~10%', approx(cagrRow.rawValue, 10.0, 0.1), cagrRow);
  const rNoYears = c({ initialInvestment: 5000, finalValue: 6000, years: 0 });
  check('roi without years has no CAGR row', !rNoYears.rows.find(x => x.label.indexOf('CAGR') !== -1));
}

// Debt payoff: extra payment reduces months and interest
{
  const c = load('debt-payoff-calculator.js');
  const base = c({ currentBalance: 8000, apr: 15, monthlyPayment: 250, extraPayment: 0 });
  const extra = c({ currentBalance: 8000, apr: 15, monthlyPayment: 250, extraPayment: 100 });
  const baseMonths = base.rows[0].rawValue;
  const extraMonths = extra.rows.find(x => x.label.indexOf('With extra') !== -1 && x.label.indexOf('time') !== -1).rawValue;
  check('debt payoff extra payment reduces months', extraMonths < baseMonths, { baseMonths, extraMonths });
}

// Salary to hourly known value
{
  const c = load('salary-to-hourly-calculator.js');
  const r = c({ annualSalary: 65000, hoursPerWeek: 40, weeksPerYear: 52 });
  check('salary to hourly = 65000/2080=31.25', approx(r.rows.find(x=>x.isTotal).rawValue, 31.25, 0.001));
}

// Discount known value
{
  const c = load('discount-calculator.js');
  const r = c({ originalPrice: 120, discountPercent: 25 });
  check('discount final price = 90', approx(r.rows.find(x=>x.isTotal).rawValue, 90, 0.01));
}

// Inflation known value: 3% for 10 years on 10000 -> 10000*1.03^10=13439.16
{
  const c = load('inflation-calculator.js');
  const r = c({ amount: 10000, annualInflationRate: 3, years: 10 });
  check('inflation known FV ~13439.16', approx(r.rows.find(x=>x.isTotal).rawValue, 13439.16, 1));
}

// Income tax: verify against hand-computed bracket math
{
  const c = load('income-tax-calculator.js');
  const r = c({ grossIncome: 80000, filingStatus: 'single', otherDeductions: 0 });
  // taxable = 80000-16100=63900; tax=1240+4560+2970=8770
  check('income tax single known = 8770', approx(r.rows.find(x=>x.isTotal).rawValue, 8770, 0.01), r.rows);

  const r2 = c({ grossIncome: 10000, filingStatus: 'single', otherDeductions: 0 });
  check('income tax below standard deduction = 0', r2.rows.find(x=>x.isTotal).rawValue === 0, r2.rows);

  const rHoh = c({ grossIncome: 80000, filingStatus: 'hoh', otherDeductions: 0 });
  check('income tax HoH known = 6348', approx(rHoh.rows.find(x=>x.isTotal).rawValue, 6348, 0.01), rHoh.rows);
}

// Take-home pay: verify FICA math matches known rates
{
  const c = load('take-home-pay-calculator.js');
  const r = c({ annualGrossIncome: 80000, filingStatus: 'single', preTaxDeductions: 0, stateTaxRate: 5 });
  const ss = r.rows.find(x => x.label.indexOf('Social Security') !== -1).rawValue;
  const medicare = r.rows.find(x => x.label.indexOf('Medicare') !== -1).rawValue;
  check('take-home SS = 80000*0.062=4960', approx(ss, 4960, 0.01));
  check('take-home Medicare = 80000*0.0145=1160', approx(medicare, 1160, 0.01));

  // Additional medicare tax above 200k single
  const rHigh = c({ annualGrossIncome: 250000, filingStatus: 'single', preTaxDeductions: 0, stateTaxRate: 0 });
  const medicareHigh = rHigh.rows.find(x => x.label.indexOf('Medicare') !== -1).rawValue;
  // 250000*0.0145 + (250000-200000)*0.009 = 3625+450=4075
  check('take-home additional medicare tax applied', approx(medicareHigh, 4075, 0.01), medicareHigh);

  // SS wage base cap
  const rCap = c({ annualGrossIncome: 300000, filingStatus: 'single', preTaxDeductions: 0, stateTaxRate: 0 });
  const ssCap = rCap.rows.find(x => x.label.indexOf('Social Security') !== -1).rawValue;
  check('take-home SS capped at wage base', approx(ssCap, 184500 * 0.062, 0.01), ssCap);

  const rHoh = c({ annualGrossIncome: 80000, filingStatus: 'hoh', preTaxDeductions: 0, stateTaxRate: 0 });
  check('take-home HoH federal tax known = 6348', approx(rHoh.rows.find(x=>x.label==='Federal income tax').rawValue, 6348, 0.01), rHoh.rows);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
