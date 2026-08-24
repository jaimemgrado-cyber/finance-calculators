module.exports = [
  {
    slug: "mortgage-calculator",
    title: "Mortgage Calculator — Estimate Your Monthly Payment",
    metaDescription: "Estimate your monthly mortgage payment, including principal, interest, property tax, and home insurance, with this free U.S. mortgage calculator.",
    h1: "Mortgage Calculator",
    category: "loans",
    jsFile: "mortgage-calculator.js",
    lede: "Estimate your monthly mortgage payment based on the home price, down payment, interest rate, and loan term — plus optional property tax, insurance, and HOA fees.",
    fields: [
      { id: "homePrice", label: "Home price", prefix: "$", min: 0, step: "1000", default: 350000 },
      { id: "downPayment", label: "Down payment", prefix: "$", min: 0, step: "1000", default: 70000 },
      { id: "interestRate", label: "Interest rate (APR)", suffix: "%", min: 0, max: 25, step: "0.01", default: 6.5 },
      { id: "loanTermYears", label: "Loan term", suffix: "years", min: 1, max: 40, step: "1", default: 30 },
      { id: "annualPropertyTax", label: "Property tax (annual)", prefix: "$", min: 0, step: "100", default: 3600, hint: "Optional — enter 0 if unknown" },
      { id: "annualHomeInsurance", label: "Home insurance (annual)", prefix: "$", min: 0, step: "100", default: 1200, hint: "Optional" },
      { id: "monthlyHOA", label: "HOA fees (monthly)", prefix: "$", min: 0, step: "10", default: 0, hint: "Optional" }
    ],
    notIncluded: "This estimate does not include private mortgage insurance (PMI), closing costs, or adjustable-rate changes. It assumes a fixed interest rate for the full loan term.",
    howItWorks: [
      "Your loan amount is the home price minus your down payment. This calculator applies the standard fixed-rate amortization formula to that amount to find your monthly principal-and-interest payment, then adds a monthly share of property tax, home insurance, and HOA fees (if you entered any) to show an estimated total monthly payment.",
      "Amortization means each payment is split between interest (on the remaining balance) and principal (paying down the loan). Early in the loan, more of each payment goes to interest; later, more goes to principal, even though the total payment stays the same."
    ],
    formula: {
      text: "M = P × [ i(1 + i)ⁿ ] / [ (1 + i)ⁿ − 1 ]",
      vars: [
        ["M", "Monthly principal & interest payment"],
        ["P", "Loan principal (home price − down payment)"],
        ["i", "Monthly interest rate (annual rate ÷ 12)"],
        ["n", "Total number of monthly payments (years × 12)"]
      ]
    },
    example: {
      inputs: "Home price $350,000, down payment $70,000, interest rate 6.5%, 30-year term, $3,600/yr property tax, $1,200/yr insurance.",
      result: "Loan amount: $280,000.00. Principal & interest: $1,769.79/mo. Total monthly payment (with tax and insurance): $2,169.79. Total interest over 30 years: $357,124.57."
    },
    faq: [
      { q: "Does this include property taxes and insurance?", a: "Yes, if you enter them — the calculator adds a monthly share of the annual property tax and home insurance amounts you provide on top of the principal-and-interest payment. Leave them at 0 if you'd rather see principal and interest alone." },
      { q: "What isn't included in this estimate?", a: "This calculator does not model private mortgage insurance (PMI), closing costs, adjustable-rate mortgages, or changes in tax and insurance costs over time. Lenders will factor in more of your financial picture, including credit score and debt-to-income ratio." },
      { q: "How does the down payment affect my payment?", a: "A larger down payment reduces your loan principal directly, which lowers both your monthly principal-and-interest payment and the total interest you'll pay over the life of the loan." },
      { q: "Why does the interest rate matter so much?", a: "Interest compounds on the remaining balance every month, so even a small rate difference changes both the monthly payment and the total interest paid over a 15- or 30-year term substantially." }
    ],
    related: ["loan-calculator", "auto-loan-calculator", "personal-loan-calculator"]
  },
  {
    slug: "loan-calculator",
    title: "Loan Calculator — Monthly Payment for Any Fixed-Rate Loan",
    metaDescription: "Calculate the monthly payment, total interest, and total cost for any fixed-rate loan — personal, mortgage, or other installment loans.",
    h1: "Loan Calculator",
    category: "loans",
    jsFile: "loan-calculator.js",
    lede: "Find the monthly payment, total interest, and total repayment amount for any fixed-rate installment loan — useful for personal loans and any other lump-sum loan with a set term.",
    fields: [
      { id: "loanAmount", label: "Loan amount", prefix: "$", min: 0.01, step: "100", default: 15000 },
      { id: "interestRate", label: "Interest rate (APR)", suffix: "%", min: 0, max: 60, step: "0.01", default: 9.5 },
      { id: "loanTermMonths", label: "Loan term", suffix: "months", min: 1, max: 480, step: "1", default: 48 }
    ],
    notIncluded: "This estimate assumes a fixed rate and equal monthly payments (a standard amortizing loan). It doesn't include origination fees or other lender charges.",
    howItWorks: [
      "This calculator uses the same fixed-rate amortization formula lenders use to set equal monthly payments for the life of a loan: each payment covers that month's interest, with the remainder reducing the principal balance.",
      "It works for any loan with a lump-sum amount, a fixed rate, and a fixed term — personal loans, debt consolidation loans, or similar installment loans."
    ],
    formula: {
      text: "M = P × [ i(1 + i)ⁿ ] / [ (1 + i)ⁿ − 1 ]",
      vars: [
        ["M", "Monthly payment"],
        ["P", "Loan amount (principal)"],
        ["i", "Monthly interest rate (annual rate ÷ 12)"],
        ["n", "Number of monthly payments"]
      ]
    },
    example: {
      inputs: "Loan amount $15,000, interest rate 9.5% APR, 48-month term.",
      result: "Monthly payment: $376.85. Total interest paid: $3,088.66. Total of all payments: $18,088.66."
    },
    faq: [
      { q: "What kinds of loans can I use this for?", a: "Any fixed-rate, fixed-term loan where you borrow a lump sum and repay it in equal monthly installments — personal loans, debt consolidation loans, and similar installment loans. For a mortgage or auto loan, the dedicated calculators add relevant extras like taxes or trade-in value." },
      { q: "Does this include fees?", a: "No. Some personal loans include an origination fee deducted from the amount you receive, which effectively raises your real borrowing cost. Check your loan's APR (not just the interest rate) for a fuller picture, and add any fees separately." },
      { q: "What happens if I pay more than the required monthly payment?", a: "Extra payments reduce your principal faster, which lowers the total interest you'll pay and can shorten the loan term — though this calculator shows the standard fixed-payment schedule, not an accelerated one." }
    ],
    related: ["personal-loan-calculator", "mortgage-calculator", "auto-loan-calculator"]
  },
  {
    slug: "auto-loan-calculator",
    title: "Auto Loan Calculator — Monthly Car Payment Estimate",
    metaDescription: "Estimate your monthly auto loan payment and total interest based on vehicle price, down payment, trade-in value, interest rate, and loan term.",
    h1: "Auto Loan Calculator",
    category: "loans",
    jsFile: "auto-loan-calculator.js",
    lede: "Estimate your monthly car payment based on the vehicle price, down payment, trade-in value, interest rate, and loan term.",
    fields: [
      { id: "vehiclePrice", label: "Vehicle price", prefix: "$", min: 0.01, step: "500", default: 32000 },
      { id: "downPayment", label: "Down payment", prefix: "$", min: 0, step: "500", default: 4000 },
      { id: "tradeInValue", label: "Trade-in value", prefix: "$", min: 0, step: "500", default: 0, hint: "Optional" },
      { id: "interestRate", label: "Interest rate (APR)", suffix: "%", min: 0, max: 30, step: "0.01", default: 6.9 },
      { id: "loanTermMonths", label: "Loan term", suffix: "months", min: 1, max: 96, step: "1", default: 60 }
    ],
    notIncluded: "This estimate does not include sales tax, title and registration fees, or dealer add-ons — those vary by state and dealership and change what you actually finance.",
    howItWorks: [
      "The amount you finance is the vehicle price minus your down payment and trade-in value. This calculator applies the standard amortization formula to that amount to find a fixed monthly payment.",
      "Sales tax and fees aren't included here since they vary by state and are often rolled into the amount financed differently depending on the dealer — add them to the vehicle price first if you want them reflected in the loan amount."
    ],
    formula: {
      text: "M = P × [ i(1 + i)ⁿ ] / [ (1 + i)ⁿ − 1 ]",
      vars: [
        ["M", "Monthly payment"],
        ["P", "Amount financed (price − down payment − trade-in)"],
        ["i", "Monthly interest rate (annual rate ÷ 12)"],
        ["n", "Loan term in months"]
      ]
    },
    example: {
      inputs: "Vehicle price $32,000, down payment $4,000, no trade-in, 6.9% APR, 60-month term.",
      result: "Amount financed: $28,000.00. Monthly payment: $553.11. Total interest over the loan: $5,186.81. Total of all payments: $33,186.81."
    },
    faq: [
      { q: "Should I include sales tax in the vehicle price?", a: "If you want the payment to reflect tax and fees, add your estimated sales tax and fees to the vehicle price before entering it, since rates vary by state and sometimes by county." },
      { q: "How does a trade-in affect my payment?", a: "A trade-in reduces the amount you need to finance in the same way a down payment does, which lowers both your monthly payment and total interest paid." },
      { q: "Is a shorter loan term always better?", a: "A shorter term means a higher monthly payment but less total interest paid, since you're borrowing the money for less time. A longer term lowers the monthly payment but increases total interest." }
    ],
    related: ["loan-calculator", "personal-loan-calculator", "debt-payoff-calculator"]
  },
  {
    slug: "compound-interest-calculator",
    title: "Compound Interest Calculator — Future Value of Savings",
    metaDescription: "See how a starting balance and monthly contributions could grow over time with compound interest. Free compound interest calculator for U.S. savers.",
    h1: "Compound Interest Calculator",
    category: "investing",
    jsFile: "compound-interest-calculator.js",
    lede: "See how a starting amount and optional monthly contributions could grow over time, assuming a steady annual return that compounds monthly.",
    fields: [
      { id: "initialAmount", label: "Starting amount", prefix: "$", min: 0, step: "100", default: 5000 },
      { id: "monthlyContribution", label: "Monthly contribution", prefix: "$", min: 0, step: "25", default: 200, hint: "Optional — enter 0 for none" },
      { id: "annualInterestRate", label: "Estimated annual return", suffix: "%", min: 0, max: 30, step: "0.01", default: 7 },
      { id: "years", label: "Time period", suffix: "years", min: 1, max: 60, step: "1", default: 20 }
    ],
    notIncluded: "This is a projection based on a constant rate of return you enter — it is not a guarantee. Real investment returns vary year to year and can be negative.",
    howItWorks: [
      "This calculator assumes your balance compounds monthly at the rate you enter, and that any monthly contribution is added at the end of each month. It combines the growth of your starting amount with the growth of your ongoing contributions to show a projected future value.",
      "A constant annual return is a simplification used to illustrate the mechanics of compounding — actual markets and interest rates fluctuate, sometimes significantly."
    ],
    formula: {
      text: "FV = P(1 + r)ⁿ + C × [ ((1 + r)ⁿ − 1) / r ]",
      vars: [
        ["FV", "Future value"],
        ["P", "Starting principal"],
        ["C", "Monthly contribution"],
        ["r", "Monthly interest rate (annual rate ÷ 12)"],
        ["n", "Number of months"]
      ]
    },
    example: {
      inputs: "Starting amount $5,000, $200/month contribution, 7% estimated annual return, 20 years.",
      result: "Total contributions: $48,000.00. Total interest earned: $71,379.03. Future value: $124,379.03."
    },
    faq: [
      { q: "What return rate should I use?", a: "This calculator doesn't recommend a rate — enter whatever assumption is relevant to your situation, such as a savings account's stated APY or a rate you're modeling for a hypothetical investment. We don't provide or endorse any specific rate of return." },
      { q: "Is compound interest guaranteed?", a: "No. This tool projects growth assuming a constant rate, which is a simplification. Savings accounts and CDs may offer fixed rates, but investment returns fluctuate and can lose value, including the possibility of loss of principal." },
      { q: "What's the difference between this and the Savings Goal Calculator?", a: "This calculator shows what a given contribution grows into. The Savings Goal Calculator works backward from a target amount to tell you the monthly contribution needed to reach it." }
    ],
    related: ["savings-calculator", "investment-calculator", "retirement-calculator"]
  },
  {
    slug: "savings-calculator",
    title: "Savings Goal Calculator — Monthly Contribution Needed",
    metaDescription: "Find out how much you need to save each month to reach a savings goal, based on your timeline, starting balance, and expected interest rate.",
    h1: "Savings Goal Calculator",
    category: "investing",
    jsFile: "savings-calculator.js",
    lede: "Find the monthly contribution needed to reach a savings goal by a target date, based on your starting balance and an estimated interest rate.",
    fields: [
      { id: "goalAmount", label: "Savings goal", prefix: "$", min: 0.01, step: "500", default: 15000 },
      { id: "currentSavings", label: "Current savings", prefix: "$", min: 0, step: "100", default: 2000, hint: "Optional — enter 0 if starting from zero" },
      { id: "annualInterestRate", label: "Estimated annual return", suffix: "%", min: 0, max: 30, step: "0.01", default: 4 },
      { id: "years", label: "Time to reach goal", suffix: "years", min: 1, max: 50, step: "1", default: 3 }
    ],
    notIncluded: "This assumes a constant rate of return and contributions made consistently every month — real accounts and market returns vary.",
    howItWorks: [
      "This calculator first projects what your current savings will grow to on its own over your timeline. It then solves for the fixed monthly contribution needed to close the remaining gap to your goal, assuming monthly compounding.",
      "If your current savings are already projected to reach (or exceed) your goal through growth alone, the required monthly contribution will show as $0."
    ],
    formula: {
      text: "Required monthly = [ Goal − P(1 + r)ⁿ ] ÷ [ ((1 + r)ⁿ − 1) / r ]",
      vars: [
        ["Goal", "Target savings amount"],
        ["P", "Current savings"],
        ["r", "Monthly interest rate (annual rate ÷ 12)"],
        ["n", "Number of months until the goal date"]
      ]
    },
    example: {
      inputs: "Goal $15,000, current savings $2,000, 4% estimated annual return, 3-year timeline.",
      result: "Starting savings grows to: $2,254.54. Required monthly contribution: $333.81. Total you'll contribute: $12,017.22."
    },
    faq: [
      { q: "What if I can't contribute the required amount?", a: "Try a longer timeline or a lower goal amount in the calculator — extending the time period reduces the required monthly contribution, since your money has more time to grow and you're spreading contributions further apart." },
      { q: "Does this account for taxes on interest?", a: "No — this is a pre-tax projection of growth. Interest or investment gains may be taxable depending on the type of account, which would reduce your real accumulated total." },
      { q: "Why is the required contribution not just the goal divided by months?", a: "Because any interest your account earns along the way contributes toward the goal too, so the required monthly amount is typically a bit lower than a simple division would suggest — the gap shrinks as your rate and timeline increase." }
    ],
    related: ["compound-interest-calculator", "retirement-calculator", "debt-payoff-calculator"]
  },
  {
    slug: "credit-card-payoff-calculator",
    title: "Credit Card Payoff Calculator — How Long to Pay Off Debt",
    metaDescription: "Find out how long it will take to pay off a credit card balance and how much interest you'll pay, based on your balance, APR, and monthly payment.",
    h1: "Credit Card Payoff Calculator",
    category: "debt",
    jsFile: "credit-card-payoff-calculator.js",
    lede: "See how long it will take to pay off a credit card balance, and how much interest you'll pay in total, based on your APR and a fixed monthly payment.",
    fields: [
      { id: "currentBalance", label: "Current balance", prefix: "$", min: 0.01, step: "100", default: 6000 },
      { id: "apr", label: "Interest rate (APR)", suffix: "%", min: 0, max: 60, step: "0.01", default: 22 },
      { id: "monthlyPayment", label: "Monthly payment", prefix: "$", min: 0.01, step: "10", default: 250 }
    ],
    notIncluded: "This assumes no new charges are added to the card and that the same payment is made every month without missed payments.",
    howItWorks: [
      "This calculator simulates your balance month by month: each month, interest accrues on the remaining balance at your card's rate, and then your payment is applied — first covering that month's interest, with the rest reducing the balance.",
      "If your monthly payment doesn't exceed the interest charged that month, the balance would never go down, so the calculator will show a message asking you to increase the payment in that case."
    ],
    formula: {
      text: "Each month: interest = balance × (APR ÷ 12); balance = balance + interest − payment",
      vars: [
        ["balance", "Remaining card balance"],
        ["APR", "Annual percentage rate on the card"],
        ["payment", "Fixed monthly payment"]
      ]
    },
    example: {
      inputs: "Balance $6,000, 22% APR, $250/month payment.",
      result: "Time to pay off: 2 years, 8 months (32 payments). Total interest paid: $1,979.05. Total paid: $7,979.05."
    },
    faq: [
      { q: "What if my payment is too low?", a: "If your monthly payment doesn't cover that month's interest, the balance would grow instead of shrink, so this calculator will tell you the payment is too low rather than show a misleading payoff time." },
      { q: "Does this include new purchases I might make?", a: "No — it assumes the balance only goes down, with no new charges added. Continuing to use the card while paying it off will extend the actual payoff time." },
      { q: "Would paying more than the minimum help?", a: "Yes. Paying more than the minimum required amount reduces the principal faster, which lowers both the payoff time and the total interest paid — try entering a higher monthly payment to compare." }
    ],
    related: ["debt-payoff-calculator", "loan-calculator", "savings-calculator"]
  },
  {
    slug: "salary-calculator",
    title: "Salary Calculator — Convert Hourly Wage to Annual Salary",
    metaDescription: "Convert an hourly wage into weekly, biweekly, monthly, and annual gross pay, based on your hours per week and weeks worked per year.",
    h1: "Salary Calculator",
    category: "income",
    jsFile: "salary-calculator.js",
    lede: "Convert an hourly wage into weekly, biweekly, monthly, and annual gross pay, based on your hours per week and weeks worked per year.",
    fields: [
      { id: "hourlyRate", label: "Hourly wage", prefix: "$", min: 0.01, step: "0.25", default: 28 },
      { id: "hoursPerWeek", label: "Hours per week", min: 1, max: 168, step: "1", default: 40 },
      { id: "weeksPerYear", label: "Weeks worked per year", min: 1, max: 52, step: "1", default: 50, hint: "Use 52 for a full year, or fewer to account for unpaid time off" }
    ],
    notIncluded: "These are gross figures — before federal and state income tax, Social Security, Medicare, or any other withholdings and deductions.",
    howItWorks: [
      "This calculator multiplies your hourly wage by your hours per week to find your weekly gross pay, then scales that up to biweekly, monthly, and annual figures based on the number of weeks you actually work in a year.",
      "If you take unpaid time off, entering fewer than 52 weeks will lower the annual and monthly figures to reflect that."
    ],
    formula: {
      text: "Weekly = hourly rate × hours/week;  Annual = weekly × weeks/year;  Monthly = annual ÷ 12",
      vars: [
        ["hourly rate", "Gross pay per hour"],
        ["hours/week", "Typical hours worked per week"],
        ["weeks/year", "Number of paid weeks worked per year"]
      ]
    },
    example: {
      inputs: "Hourly wage $28.00, 40 hours/week, 50 weeks/year.",
      result: "Weekly: $1,120.00. Biweekly: $2,240.00. Monthly: $4,666.67. Annual: $56,000.00 — all gross figures."
    },
    faq: [
      { q: "Why 50 weeks instead of 52?", a: "52 weeks assumes no unpaid time off. Using a lower number, like 50, accounts for roughly two weeks of unpaid vacation or leave — adjust it to match your actual situation." },
      { q: "Does this include overtime?", a: "No — this calculator uses a flat hourly rate for all hours entered. If you regularly work overtime at a higher rate, calculate that portion separately and add it to the result." },
      { q: "Why is this gross pay and not take-home pay?", a: "Gross pay is before taxes and other withholdings, which depend on your filing status, state, and benefit elections — figures that vary too much person-to-person for a general calculator to estimate reliably." }
    ],
    related: ["salary-to-hourly-calculator", "take-home-pay-calculator", "income-tax-calculator"]
  },
  {
    slug: "sales-tax-calculator",
    title: "Sales Tax Calculator — Add Tax to Any Price",
    metaDescription: "Calculate the sales tax and total price for a purchase using any tax rate you enter. Works for any U.S. state, county, or city rate.",
    h1: "Sales Tax Calculator",
    category: "taxes",
    jsFile: "sales-tax-calculator.js",
    lede: "Calculate the sales tax amount and total price for a purchase, using whatever combined state and local tax rate applies where you're shopping.",
    fields: [
      { id: "price", label: "Price before tax", prefix: "$", min: 0, step: "0.01", default: 249.99 },
      { id: "taxRate", label: "Sales tax rate", suffix: "%", min: 0, max: 20, step: "0.01", default: 7.25 }
    ],
    notIncluded: "This calculator does not look up tax rates for you — U.S. sales tax rates vary by state, county, and city, and some categories of goods are taxed differently or exempt.",
    howItWorks: [
      "Enter the price before tax and the combined sales tax rate that applies to your purchase. The calculator multiplies the price by the tax rate to find the tax amount, then adds it to the price for your total."
    ],
    formula: {
      text: "Tax = Price × (Rate ÷ 100);  Total = Price + Tax",
      vars: [
        ["Price", "Price before tax"],
        ["Rate", "Combined sales tax rate, as a percentage"]
      ]
    },
    example: {
      inputs: "Price $249.99, tax rate 7.25%.",
      result: "Sales tax amount: $18.12. Total price: $268.11."
    },
    faq: [
      { q: "What tax rate should I use?", a: "Use the combined state, county, and city rate that applies at the point of sale. Rates vary across the U.S. and change periodically — check your state or local tax authority's website for the current rate in your area." },
      { q: "Are all purchases taxed the same way?", a: "No. Many states exempt or reduce tax on categories like groceries, prescription medication, or clothing, and some apply different rates to services versus goods. This calculator applies a single flat rate to the full price you enter." },
      { q: "Can I use this to back into a pre-tax price from a total?", a: "Not directly — this calculator adds tax to a pre-tax price. To reverse it, divide your total by (1 + rate/100) to estimate the pre-tax price." }
    ],
    related: ["tip-calculator", "discount-calculator", "income-tax-calculator"]
  },
  {
    slug: "tip-calculator",
    title: "Tip Calculator — Calculate Tip and Split the Bill",
    metaDescription: "Calculate how much to tip and split the total bill evenly among any number of people with this free tip calculator.",
    h1: "Tip Calculator",
    category: "everyday",
    jsFile: "tip-calculator.js",
    lede: "Calculate the tip on a bill and split the total evenly among everyone at the table.",
    fields: [
      { id: "billAmount", label: "Bill amount", prefix: "$", min: 0, step: "0.01", default: 64.50 },
      { id: "tipPercent", label: "Tip percentage", suffix: "%", min: 0, max: 100, step: "1", default: 18 },
      { id: "numberOfPeople", label: "Number of people", min: 1, max: 50, step: "1", default: 3 }
    ],
    notIncluded: null,
    howItWorks: [
      "This calculator multiplies your bill by the tip percentage to find the tip amount, adds it to the bill for the total, and then divides everything evenly by the number of people splitting it."
    ],
    formula: {
      text: "Tip = Bill × (Tip % ÷ 100);  Total = Bill + Tip;  Per person = Total ÷ People",
      vars: [
        ["Bill", "Pre-tip bill amount"],
        ["Tip %", "Tip percentage"],
        ["People", "Number of people splitting the bill"]
      ]
    },
    example: {
      inputs: "Bill $64.50, 18% tip, split 3 ways.",
      result: "Tip amount: $11.61. Total bill: $76.11. Total per person: $25.37."
    },
    faq: [
      { q: "Should I tip before or after tax?", a: "Tipping norms vary, but many guides suggest tipping on the pre-tax subtotal. This calculator treats whatever amount you enter as the base — enter the pre-tax subtotal if that's your preference." },
      { q: "What's a standard tip percentage?", a: "Common ranges in the U.S. are roughly 15–20% at sit-down restaurants, though this varies by service type, region, and personal preference. This calculator doesn't recommend a specific percentage — enter whatever you intend to tip." },
      { q: "Does this split the tip evenly even if people ordered different amounts?", a: "Yes, this calculator splits the total bill and tip evenly by headcount. If people want to pay based on what they individually ordered, they'd need to calculate each person's share separately." }
    ],
    related: ["sales-tax-calculator", "discount-calculator"]
  },
  {
    slug: "percentage-calculator",
    title: "Percentage Calculator — Find a Percentage of Any Number",
    metaDescription: "Quickly calculate a percentage of any number, plus that number increased or decreased by the same percentage.",
    h1: "Percentage Calculator",
    category: "everyday",
    jsFile: "percentage-calculator.js",
    lede: "Find a percentage of any number, and see that number increased or decreased by the same percentage.",
    fields: [
      { id: "percent", label: "Percentage", suffix: "%", min: 0, max: 1000, step: "0.01", default: 12 },
      { id: "baseValue", label: "Value", min: 0, step: "0.01", default: 850 }
    ],
    notIncluded: null,
    howItWorks: [
      "This calculator multiplies the value you enter by the percentage (divided by 100) to find the result, and also shows what that value would be if increased or decreased by that same percentage — useful for quick estimates on discounts, raises, or any percentage-based change."
    ],
    formula: {
      text: "Result = Value × (Percent ÷ 100)",
      vars: [
        ["Value", "The number you're taking a percentage of"],
        ["Percent", "The percentage to apply"]
      ]
    },
    example: {
      inputs: "12% of 850.",
      result: "12% of 850 = 102. Value increased by 12% = 952. Value decreased by 12% = 748."
    },
    faq: [
      { q: "How do I find what percentage one number is of another?", a: "Divide the smaller (or partial) number by the total, then multiply by 100. For example, 40 out of 200 is (40 ÷ 200) × 100 = 20%. This calculator's current fields are set up for the reverse operation — finding a percentage of a number — rather than this one." },
      { q: "How do I calculate percentage change?", a: "Subtract the old value from the new value, divide by the old value, then multiply by 100. A positive result is a percentage increase; a negative result is a decrease." },
      { q: "Can I use this for discounts?", a: "Yes — enter the discount percentage and the original price as the value; the 'decreased by' row shows the discounted price." }
    ],
    related: ["sales-tax-calculator", "tip-calculator"]
  },
  {
    slug: "personal-loan-calculator",
    title: "Personal Loan Calculator — Payment, Fees & Total Cost",
    metaDescription: "Estimate your personal loan's monthly payment, origination fee, and total interest — see what you'll actually receive versus what you'll repay.",
    h1: "Personal Loan Calculator",
    category: "loans",
    jsFile: "personal-loan-calculator.js",
    lede: "Estimate your monthly payment on a personal loan, and see how an origination fee affects the amount you actually receive versus what you repay.",
    fields: [
      { id: "loanAmount", label: "Loan amount", prefix: "$", min: 0.01, step: "100", default: 10000 },
      { id: "originationFeePercent", label: "Origination fee", suffix: "%", min: 0, max: 15, step: "0.1", default: 3, hint: "Optional — enter 0 if none" },
      { id: "interestRate", label: "Interest rate (APR)", suffix: "%", min: 0, max: 60, step: "0.01", default: 11.5 },
      { id: "loanTermMonths", label: "Loan term", suffix: "months", min: 1, max: 84, step: "1", default: 36 }
    ],
    notIncluded: "This assumes a single upfront origination fee and no other fees (like late fees or prepayment penalties), and a fixed rate for the full term.",
    howItWorks: [
      "Many personal loans deduct an origination fee from the loan amount before disbursing it — so if you're approved for $10,000 with a 3% fee, you receive $9,700, but you still repay the full $10,000 plus interest.",
      "This calculator applies the standard amortization formula to the full loan amount to find your monthly payment, and separately shows the fee's effect on what you actually receive."
    ],
    formula: {
      text: "M = P × [ i(1 + i)ⁿ ] / [ (1 + i)ⁿ − 1 ];  Received = P − (P × fee%)",
      vars: [
        ["M", "Monthly payment"],
        ["P", "Loan amount (what you repay, before the fee is subtracted)"],
        ["i", "Monthly interest rate (annual rate ÷ 12)"],
        ["n", "Loan term in months"]
      ]
    },
    example: {
      inputs: "Loan amount $10,000, 3% origination fee, 11.5% APR, 36-month term.",
      result: "Amount received: $9,700.00. Monthly payment: $329.76. Total interest paid: $1,871.36."
    },
    faq: [
      { q: "Why is my payment based on $10,000 if I only received $9,700?", a: "The origination fee is taken out of your disbursement, not off your obligation — you still owe and repay the full amount you were approved for, so the fee effectively raises your real cost of borrowing beyond the stated interest rate." },
      { q: "Do all personal loans charge an origination fee?", a: "No — it varies by lender. Enter 0 if your loan doesn't have one. Comparing loans by APR (which factors in fees) rather than just the interest rate gives a more apples-to-apples comparison." },
      { q: "Is a personal loan different from the generic Loan Calculator?", a: "The math is the same amortization formula — this version adds the origination fee, which is common on personal loans specifically and worth seeing separately from the payment itself." }
    ],
    related: ["loan-calculator", "credit-card-payoff-calculator", "debt-payoff-calculator"]
  },
  {
    slug: "investment-calculator",
    title: "Investment Calculator — Future Value & Real Purchasing Power",
    metaDescription: "Project the future value of a lump-sum investment, and see what it's worth in today's purchasing power after accounting for inflation.",
    h1: "Investment Calculator",
    category: "investing",
    jsFile: "investment-calculator.js",
    lede: "Project what a lump-sum investment could grow to, and see that amount in today's purchasing power after accounting for inflation.",
    fields: [
      { id: "initialInvestment", label: "Initial investment", prefix: "$", min: 0.01, step: "500", default: 20000 },
      { id: "expectedAnnualReturn", label: "Expected annual return", suffix: "%", min: 0, max: 30, step: "0.01", default: 8 },
      { id: "expectedInflationRate", label: "Expected inflation rate", suffix: "%", min: 0, max: 20, step: "0.01", default: 3, hint: "Optional — enter 0 to ignore inflation" },
      { id: "years", label: "Time period", suffix: "years", min: 1, max: 60, step: "1", default: 15 }
    ],
    notIncluded: "This is a projection based on constant rates you enter, not a guarantee. It doesn't include taxes on investment gains, fees, or additional contributions.",
    howItWorks: [
      "This calculator compounds your initial investment annually at the return rate you enter. It also shows that future amount in 'today's dollars' by dividing it by the effect of inflation over the same period — a way of estimating real purchasing power, not just the nominal dollar figure.",
      "If your expected return equals your expected inflation rate, the real (inflation-adjusted) value will show no growth, since the investment is only keeping pace with rising prices."
    ],
    formula: {
      text: "Nominal FV = P(1 + r)ⁿ;  Real FV = Nominal FV ÷ (1 + i)ⁿ",
      vars: [
        ["P", "Initial investment"],
        ["r", "Expected annual return"],
        ["i", "Expected annual inflation rate"],
        ["n", "Number of years"]
      ]
    },
    example: {
      inputs: "Initial investment $20,000, 8% expected annual return, 3% expected inflation, 15 years.",
      result: "Future value (nominal): $63,443.38. Future value in today's dollars: $40,721.89."
    },
    faq: [
      { q: "What return rate should I use?", a: "This calculator doesn't recommend a rate — enter whatever assumption fits what you're modeling. We don't endorse or predict any specific rate of return." },
      { q: "Why show a 'today's dollars' figure at all?", a: "A dollar amount decades from now buys less than the same amount today, because prices rise over time. Showing the inflation-adjusted figure gives a more realistic sense of the purchasing power your investment could provide." },
      { q: "How is this different from the Compound Interest Calculator?", a: "Compound Interest focuses on monthly contributions building up over time with monthly compounding. This calculator focuses on a single lump sum with annual compounding, and adds an inflation-adjusted view." }
    ],
    related: ["compound-interest-calculator", "retirement-calculator", "roi-calculator"]
  },
  {
    slug: "retirement-calculator",
    title: "Retirement Calculator — Projected Savings at Retirement Age",
    metaDescription: "Estimate what your retirement savings could grow to by your target retirement age, based on your current savings, contributions, and expected return.",
    h1: "Retirement Calculator",
    category: "investing",
    jsFile: "retirement-calculator.js",
    lede: "Estimate what your retirement savings could grow to by your target retirement age, based on your current age, savings, monthly contributions, and expected return.",
    fields: [
      { id: "currentAge", label: "Current age", min: 1, max: 100, step: "1", default: 30 },
      { id: "retirementAge", label: "Retirement age", min: 1, max: 100, step: "1", default: 65 },
      { id: "currentSavings", label: "Current retirement savings", prefix: "$", min: 0, step: "500", default: 15000 },
      { id: "monthlyContribution", label: "Monthly contribution", prefix: "$", min: 0, step: "25", default: 400 },
      { id: "expectedAnnualReturn", label: "Expected annual return", suffix: "%", min: 0, max: 30, step: "0.01", default: 7 }
    ],
    notIncluded: "This is a projection based on a constant return you enter — not a guarantee. It doesn't include Social Security, employer matching, taxes, or fees.",
    howItWorks: [
      "This calculator projects your retirement balance the same way the Compound Interest Calculator does — monthly compounding, with monthly contributions — but uses your current and target retirement age to determine the time period instead of asking for a raw number of years.",
      "It also shows what that projected balance could support annually using the 4% rule, a commonly cited starting point from retirement research (not personalized advice, and not a guarantee that any balance will last a specific number of years)."
    ],
    formula: {
      text: "Balance = P(1 + r)ⁿ + C × [ ((1 + r)ⁿ − 1) / r ];  Est. income = Balance × 4%",
      vars: [
        ["P", "Current retirement savings"],
        ["C", "Monthly contribution"],
        ["r", "Monthly interest rate (annual return ÷ 12)"],
        ["n", "Months until retirement (years × 12)"]
      ]
    },
    example: {
      inputs: "Current age 30, retirement age 65, $15,000 current savings, $400/month contribution, 7% expected annual return.",
      result: "Projected balance at retirement: $893,014.12. Estimated annual income (4% rule): $35,720.56."
    },
    faq: [
      { q: "What is the 4% rule?", a: "It's a widely referenced guideline from retirement research suggesting that withdrawing about 4% of a portfolio in the first year of retirement, then adjusting for inflation each year after, has historically had a reasonable chance of lasting 30 years. It's a starting point for discussion, not a guarantee or personalized advice — actual sustainable withdrawal rates depend on markets, spending, and how long retirement lasts." },
      { q: "Does this include Social Security?", a: "No. This calculator only projects your own contributions and savings growth. Social Security, pensions, or other income sources would be additional." },
      { q: "What if I don't know what return to expect?", a: "This calculator doesn't recommend a rate — try a few different assumptions to see how sensitive your projection is to the return you use." }
    ],
    related: ["compound-interest-calculator", "savings-calculator", "investment-calculator"]
  },
  {
    slug: "roi-calculator",
    title: "ROI Calculator — Return on Investment & Annualized Return",
    metaDescription: "Calculate your return on investment (ROI) and annualized return (CAGR) from an initial investment and its current or final value.",
    h1: "ROI Calculator",
    category: "investing",
    jsFile: "roi-calculator.js",
    lede: "Calculate your total return on investment and, if you provide a time period, your annualized return (CAGR).",
    fields: [
      { id: "initialInvestment", label: "Initial investment", prefix: "$", min: 0.01, step: "100", default: 10000 },
      { id: "finalValue", label: "Final (or current) value", prefix: "$", min: 0, step: "100", default: 14500 },
      { id: "years", label: "Time held", suffix: "years", min: 0, max: 60, step: "0.1", default: 3, hint: "Optional — leave at 0 to skip annualized return" }
    ],
    notIncluded: null,
    howItWorks: [
      "ROI compares your gain (or loss) to your original investment as a percentage. On its own, ROI doesn't account for how long you held the investment — a 20% return over 1 year is very different from a 20% return over 10 years.",
      "If you enter a time period, this calculator also shows the annualized return (CAGR — compound annual growth rate), which converts your total return into an equivalent steady yearly rate, making it easier to compare investments held for different lengths of time."
    ],
    formula: {
      text: "ROI% = (Final − Initial) / Initial × 100;  CAGR = (Final / Initial)^(1/years) − 1",
      vars: [
        ["Initial", "Initial investment amount"],
        ["Final", "Final or current value"],
        ["years", "Time the investment was held"]
      ]
    },
    example: {
      inputs: "Initial investment $10,000, final value $14,500, held 3 years.",
      result: "Net gain: $4,500.00. ROI: 45%. Annualized return (CAGR): 13.19%."
    },
    faq: [
      { q: "What's the difference between ROI and CAGR?", a: "ROI is your total return over the whole period. CAGR spreads that same total return evenly across each year, so you can compare investments held for different lengths of time on equal footing." },
      { q: "Does ROI account for risk?", a: "No — ROI only measures the return you got, not how much risk was involved in getting it. Two investments with the same ROI can carry very different levels of risk." },
      { q: "Can I use this for an investment I still hold?", a: "Yes — enter its current value as the 'final value' to see your return so far, and how long you've held it for an annualized figure." }
    ],
    related: ["investment-calculator", "compound-interest-calculator", "retirement-calculator"]
  },
  {
    slug: "debt-payoff-calculator",
    title: "Debt Payoff Calculator — Payoff Time & Extra Payment Savings",
    metaDescription: "See how long it will take to pay off any debt, and how much time and interest you could save by paying extra each month.",
    h1: "Debt Payoff Calculator",
    category: "debt",
    jsFile: "debt-payoff-calculator.js",
    lede: "See how long it will take to pay off a debt, and how much time and interest you could save by adding an extra amount to your monthly payment.",
    fields: [
      { id: "currentBalance", label: "Current balance", prefix: "$", min: 0.01, step: "100", default: 8000 },
      { id: "apr", label: "Interest rate (APR)", suffix: "%", min: 0, max: 60, step: "0.01", default: 15 },
      { id: "monthlyPayment", label: "Monthly payment", prefix: "$", min: 0.01, step: "10", default: 250 },
      { id: "extraPayment", label: "Extra monthly payment", prefix: "$", min: 0, step: "10", default: 100, hint: "Optional — enter 0 to skip the comparison" }
    ],
    notIncluded: "Works for any single debt with a fixed rate and payment — it doesn't allocate payments across multiple debts (like a snowball or avalanche strategy across several balances).",
    howItWorks: [
      "This calculator simulates your balance month by month, applying interest and then your payment, the same way the Credit Card Payoff Calculator does. It works for any debt with a balance, interest rate, and monthly payment — not just credit cards.",
      "If you enter an extra monthly payment, it runs the same simulation a second time with that extra amount added, and shows how much sooner you'd be debt-free and how much interest you'd save."
    ],
    formula: {
      text: "Each month: interest = balance × (APR ÷ 12); balance = balance + interest − payment",
      vars: [
        ["balance", "Remaining debt balance"],
        ["APR", "Annual interest rate"],
        ["payment", "Fixed monthly payment"]
      ]
    },
    example: {
      inputs: "Balance $8,000, 15% APR, $250/month payment, plus $100/month extra.",
      result: "Time to pay off: 42 months. With the extra $100/month: 28 months — 14 months sooner, saving $800.24 in interest."
    },
    faq: [
      { q: "What kinds of debt can I use this for?", a: "Any debt with a balance, a fixed interest rate, and a regular payment — personal loans, medical debt, or credit cards. For a loan with a truly fixed term (like a mortgage or auto loan), the dedicated loan calculators may be more precise." },
      { q: "Should I pay off multiple debts with this?", a: "This calculator handles one balance at a time. If you have several debts, common strategies include paying off the highest-rate balance first (saves the most interest) or the smallest balance first (a quick psychological win) — apply this calculator to whichever debt you're focusing extra payments on." },
      { q: "Does extra payment amount matter more early or late in the payoff?", a: "Extra payments made earlier reduce the balance interest accrues on sooner, generally producing more total interest savings than the same extra amount applied later — though this calculator assumes a consistent extra payment every month rather than a one-time lump sum." }
    ],
    related: ["credit-card-payoff-calculator", "loan-calculator", "savings-calculator"]
  },
  {
    slug: "salary-to-hourly-calculator",
    title: "Salary to Hourly Calculator — Convert Annual Pay to Hourly Rate",
    metaDescription: "Convert an annual salary into an equivalent hourly wage, based on your typical hours per week and weeks worked per year.",
    h1: "Salary to Hourly Calculator",
    category: "income",
    jsFile: "salary-to-hourly-calculator.js",
    lede: "Convert an annual salary into an equivalent hourly wage, based on your typical hours per week and weeks worked per year.",
    fields: [
      { id: "annualSalary", label: "Annual salary", prefix: "$", min: 0.01, step: "500", default: 65000 },
      { id: "hoursPerWeek", label: "Hours per week", min: 1, max: 168, step: "1", default: 40 },
      { id: "weeksPerYear", label: "Weeks worked per year", min: 1, max: 52, step: "1", default: 52 }
    ],
    notIncluded: "These are gross figures — before taxes, benefits, or other withholdings.",
    howItWorks: [
      "This calculator divides your annual salary by the total number of hours you work in a year (hours per week times weeks per year) to find an equivalent hourly rate — useful for comparing a salaried offer to hourly pay, or estimating the value of your time."
    ],
    formula: {
      text: "Hourly rate = Annual salary ÷ (Hours/week × Weeks/year)",
      vars: [
        ["Annual salary", "Gross yearly pay"],
        ["Hours/week", "Typical hours worked per week"],
        ["Weeks/year", "Number of paid weeks worked per year"]
      ]
    },
    example: {
      inputs: "Annual salary $65,000, 40 hours/week, 52 weeks/year.",
      result: "Total hours worked per year: 2,080. Equivalent hourly rate: $31.25."
    },
    faq: [
      { q: "Why does this matter for a salaried job?", a: "Salaried positions don't pay by the hour, but breaking the salary down this way can help you compare offers, value your time, or estimate what unpaid overtime is actually costing you." },
      { q: "Should I use 52 weeks or fewer?", a: "Use 52 if you want the rate based on a full year. If you want to account for unpaid time off, use a lower number — that spreads the same salary over fewer working weeks, raising the calculated hourly rate." },
      { q: "Is this the inverse of the Salary Calculator?", a: "Yes — the Salary Calculator converts an hourly wage up to weekly/monthly/annual pay; this one converts an annual salary back down to an hourly rate." }
    ],
    related: ["salary-calculator", "take-home-pay-calculator", "income-tax-calculator"]
  },
  {
    slug: "take-home-pay-calculator",
    title: "Take-Home Pay Calculator — Estimate Your Net Pay",
    metaDescription: "Estimate your net take-home pay after federal income tax, Social Security, Medicare, and state tax, using current 2026 federal tax figures.",
    h1: "Take-Home Pay Calculator",
    category: "income",
    jsFile: "take-home-pay-calculator.js",
    extraTaxData: true,
    lede: "Estimate your net take-home pay after federal income tax, Social Security, Medicare, and state income tax, using 2026 federal tax figures.",
    fields: [
      { id: "annualGrossIncome", label: "Annual gross income", prefix: "$", min: 0, step: "500", default: 80000 },
      { id: "filingStatus", label: "Filing status", type: "select", default: "single", options: [
        { value: "single", label: "Single" },
        { value: "mfj", label: "Married filing jointly" },
        { value: "hoh", label: "Head of household" }
      ] },
      { id: "preTaxDeductions", label: "Pre-tax deductions (401k, etc.)", prefix: "$", min: 0, step: "100", default: 0, hint: "Optional — annual amount" },
      { id: "stateTaxRate", label: "State income tax rate", suffix: "%", min: 0, max: 15, step: "0.01", default: 5, hint: "Optional — enter 0 for no-income-tax states" }
    ],
    notIncluded: "Uses 2026 federal brackets, standard deduction, and Social Security/Medicare rates for Single, Married Filing Jointly, and Head of Household — Married Filing Separately isn't covered. State tax uses a flat rate you provide, not your actual state's bracket structure. Doesn't include local taxes, W-4 elections, or benefits like health insurance premiums.",
    howItWorks: [
      "This calculator estimates federal income tax using the 2026 IRS standard deduction and marginal tax brackets, then adds Social Security tax (6.2%, up to the 2026 wage base of $184,500) and Medicare tax (1.45%, plus an additional 0.9% above $200,000 single / $250,000 joint).",
      "State income tax is calculated using the flat rate you enter, since actual state tax systems vary widely — some states have no income tax, others have their own brackets. This is a simplification, not a substitute for your actual state's rules."
    ],
    formula: {
      text: "Take-home = Gross − Pre-tax deductions − Federal tax − Social Security − Medicare − State tax",
      vars: [
        ["Federal tax", "2026 IRS brackets applied to (gross − deductions − standard deduction)"],
        ["Social Security", "6.2% of gross, up to the $184,500 wage base"],
        ["Medicare", "1.45% of gross, plus 0.9% above the threshold for your filing status"]
      ]
    },
    example: {
      inputs: "Annual gross income $80,000, single, no pre-tax deductions, 5% state tax rate.",
      result: "Federal income tax: $8,770.00. Social Security: $4,960.00. Medicare: $1,160.00. State tax: $4,000.00. Estimated take-home pay: $61,110.00."
    },
    faq: [
      { q: "Why is my actual paycheck different from this estimate?", a: "Real paycheck withholding depends on your W-4 elections, actual state and local tax rules, health insurance and other benefit deductions, and how your employer calculates withholding — all of which this simplified calculator doesn't fully model." },
      { q: "What if my state has no income tax?", a: "Enter 0 for the state tax rate." },
      { q: "Where do the federal tax figures come from?", a: "The 2026 IRS standard deduction and tax brackets (IRS Revenue Procedure 2025-32) and the 2026 Social Security wage base published by the Social Security Administration. These figures update annually — recheck them for future tax years." }
    ],
    related: ["income-tax-calculator", "salary-calculator", "salary-to-hourly-calculator"]
  },
  {
    slug: "income-tax-calculator",
    title: "Income Tax Calculator — Estimate Your Federal Tax (2026)",
    metaDescription: "Estimate your federal income tax liability, marginal tax bracket, and effective tax rate using 2026 IRS tax brackets and the standard deduction.",
    h1: "Income Tax Calculator",
    category: "taxes",
    jsFile: "income-tax-calculator.js",
    extraTaxData: true,
    lede: "Estimate your federal income tax liability, marginal tax bracket, and effective tax rate, using 2026 IRS tax brackets and the standard deduction.",
    fields: [
      { id: "grossIncome", label: "Annual gross income", prefix: "$", min: 0, step: "500", default: 80000 },
      { id: "filingStatus", label: "Filing status", type: "select", default: "single", options: [
        { value: "single", label: "Single" },
        { value: "mfj", label: "Married filing jointly" },
        { value: "hoh", label: "Head of household" }
      ] },
      { id: "otherDeductions", label: "Other deductions", prefix: "$", min: 0, step: "100", default: 0, hint: "Optional — beyond the standard deduction" }
    ],
    notIncluded: "Covers Single, Married Filing Jointly, and Head of Household — Married Filing Separately isn't included. Uses the standard deduction (not itemized deductions), and doesn't include tax credits, self-employment tax, or state tax.",
    howItWorks: [
      "This calculator subtracts the 2026 IRS standard deduction (and any other deductions you enter) from your gross income to find taxable income, then applies the 2026 marginal tax brackets to that amount.",
      "Marginal brackets are progressive: only the income within each bracket is taxed at that bracket's rate, not your entire income. Your effective tax rate — total tax divided by gross income — is always lower than your marginal (top) bracket rate."
    ],
    formula: {
      text: "Taxable income = Gross income − Standard deduction − Other deductions; Tax = sum of (income in each bracket × that bracket's rate)",
      vars: [
        ["Standard deduction (2026)", "$16,100 single / $32,200 married filing jointly"],
        ["Brackets (2026)", "10%, 12%, 22%, 24%, 32%, 35%, 37% — see the table below"]
      ]
    },
    example: {
      inputs: "Annual gross income $80,000, single filer, no additional deductions.",
      result: "Taxable income: $63,900.00. Marginal tax bracket: 22%. Effective tax rate: 10.96%. Estimated federal tax owed: $8,770.00."
    },
    faq: [
      { q: "Where do these tax brackets come from?", a: "The 2026 tax year brackets and standard deduction published by the IRS in Revenue Procedure 2025-32 (announced October 2025). Tax brackets are adjusted for inflation annually, so these figures are specific to income earned in 2026." },
      { q: "What's the difference between my marginal and effective tax rate?", a: "Your marginal rate is the rate on your last dollar of taxable income — the top bracket you reach. Your effective rate is your total tax divided by your income, which is always lower, since earlier dollars are taxed at lower bracket rates first." },
      { q: "Does this include state income tax?", a: "No — this calculator only estimates federal income tax. Use the Take-Home Pay Calculator to include an estimated state tax rate alongside federal tax and FICA." },
      { q: "Why isn't Married Filing Separately included?", a: "We only publish figures we've directly verified against a primary source, and we haven't yet confirmed the exact Married Filing Separately thresholds against one. We'll add that status once we have." }
    ],
    related: ["take-home-pay-calculator", "sales-tax-calculator", "salary-calculator"]
  },
  {
    slug: "discount-calculator",
    title: "Discount Calculator — Calculate Sale Price and Savings",
    metaDescription: "Calculate how much you'll save and what you'll pay after a percentage-off discount is applied to any price.",
    h1: "Discount Calculator",
    category: "everyday",
    jsFile: "discount-calculator.js",
    lede: "Calculate how much you'll save and what you'll actually pay after a percentage-off discount.",
    fields: [
      { id: "originalPrice", label: "Original price", prefix: "$", min: 0, step: "0.01", default: 120 },
      { id: "discountPercent", label: "Discount", suffix: "%", min: 0, max: 100, step: "1", default: 25 }
    ],
    notIncluded: null,
    howItWorks: [
      "This calculator multiplies the original price by the discount percentage to find your savings, then subtracts that from the original price for the final amount you'd pay — before any sales tax."
    ],
    formula: {
      text: "Savings = Price × (Discount % ÷ 100);  Final price = Price − Savings",
      vars: [
        ["Price", "Original price before the discount"],
        ["Discount %", "The percentage taken off"]
      ]
    },
    example: {
      inputs: "Original price $120, 25% discount.",
      result: "You save: $30.00. Final price: $90.00."
    },
    faq: [
      { q: "Does this include sales tax?", a: "No — this shows the discounted price only. Use the Sales Tax Calculator afterward if you want to add tax to the final price." },
      { q: "How do I stack two discounts, like 20% off plus an extra 10% off?", a: "Apply them one at a time rather than adding the percentages together: run this calculator with the first discount, then use that result as the starting price for the second discount. Two 10% discounts stacked equal about 19% off total, not 20%." }
    ],
    related: ["sales-tax-calculator", "percentage-calculator", "tip-calculator"]
  },
  {
    slug: "inflation-calculator",
    title: "Inflation Calculator — Future Cost of Today's Money",
    metaDescription: "See what a dollar amount today could cost in the future, based on an inflation rate you choose.",
    h1: "Inflation Calculator",
    category: "everyday",
    jsFile: "inflation-calculator.js",
    lede: "See what a dollar amount today could cost in the future, based on an inflation rate you choose.",
    fields: [
      { id: "amount", label: "Amount today", prefix: "$", min: 0, step: "100", default: 10000 },
      { id: "annualInflationRate", label: "Annual inflation rate", suffix: "%", min: 0, max: 30, step: "0.01", default: 3, hint: "Your assumption — see \u201cHow It Works\u201d below" },
      { id: "years", label: "Time period", suffix: "years", min: 1, max: 60, step: "1", default: 10 }
    ],
    notIncluded: "This calculator uses an inflation rate you provide, not historical Consumer Price Index (CPI) data — actual inflation varies year to year and isn't predictable over long periods.",
    howItWorks: [
      "This calculator compounds an amount forward at the inflation rate you enter, showing what an equivalent purchase might cost in the future — the same math as compound interest, applied to rising prices instead of growing savings.",
      "We intentionally don't hardcode a specific inflation rate or historical CPI data here, since actual inflation changes over time and by category of spending. For historical U.S. inflation data, the Bureau of Labor Statistics publishes the Consumer Price Index (CPI), which you can use to inform the rate you enter."
    ],
    formula: {
      text: "Future cost = Amount × (1 + Inflation rate ÷ 100)ⁿ",
      vars: [
        ["Amount", "Today's dollar amount"],
        ["Inflation rate", "Your assumed annual inflation rate"],
        ["n", "Number of years"]
      ]
    },
    example: {
      inputs: "$10,000 today, 3% assumed annual inflation, 10 years.",
      result: "Additional cost from inflation: $3,439.16. Equivalent cost in 10 years: $13,439.16 — a 34.39% total increase."
    },
    faq: [
      { q: "What inflation rate should I use?", a: "This calculator doesn't recommend one. You might use a recent CPI figure from the Bureau of Labor Statistics, the Federal Reserve's long-run target (commonly cited as 2%), or your own assumption — the result is only as reliable as the rate you choose." },
      { q: "Why doesn't this use real historical inflation data?", a: "Historical CPI data is real, published data, but hardcoding it here would go stale and wouldn't reflect future inflation anyway. Letting you enter the rate keeps the calculator honest about being a projection, not a lookup of the past." },
      { q: "Can I use this to see what a past price would cost today?", a: "This calculator projects forward from today. To adjust a past amount into today's dollars, you'd need historical CPI data for the specific years involved — the BLS inflation calculator is built for that specific use case." }
    ],
    related: ["compound-interest-calculator", "investment-calculator", "percentage-calculator"]
  }
];
