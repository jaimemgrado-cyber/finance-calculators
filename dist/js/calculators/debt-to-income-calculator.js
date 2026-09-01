/*
 * Debt-to-Income (DTI) Ratio Calculator — compute module.
 * front-end DTI = housing payment / gross monthly income
 * back-end DTI = (housing payment + other monthly debt payments) / gross monthly income
 * Both ratios are plain division — the math is exact. What the resulting
 * percentage *means* for loan approval is a lending guideline, not a law:
 * this calculator cites the commonly used reference points rather than
 * presenting them as a pass/fail test.
 */
(function (global) {
  "use strict";
  var lib = (typeof module !== "undefined" && module.exports)
    ? require("./_lib.js")
    : { fmtCurrency: fmtCurrency, fmtPercent: fmtPercent, fmtNumber: fmtNumber, isSafe: isSafe };

  function compute(v) {
    var income = v.monthlyGrossIncome;
    var housing = v.monthlyHousingPayment || 0;
    var otherDebts = v.otherMonthlyDebtPayments || 0;

    if (income <= 0) {
      return { error: "Monthly gross income must be greater than zero." };
    }

    var frontEndDTI = (housing / income) * 100;
    var backEndDTI = ((housing + otherDebts) / income) * 100;

    return {
      rows: [
        { label: "Front-end DTI (housing only)", value: lib.fmtNumber(frontEndDTI) + "%", rawValue: frontEndDTI },
        { label: "Back-end DTI (housing + other debts)", value: lib.fmtNumber(backEndDTI) + "%", rawValue: backEndDTI, isTotal: true }
      ],
      note: "Both ratios are exact math from the numbers you entered — gross income, not take-home pay, is the standard denominator lenders use.",
      scale: {
        label: "Back-end debt-to-income ratio",
        min: 0,
        max: 60,
        value: backEndDTI,
        valueDisplay: lib.fmtNumber(backEndDTI) + "%",
        lowLabel: "0%",
        highLabel: "60%",
        kind: "guideline",
        interpretation: backEndDTI <= 36
          ? "At " + lib.fmtNumber(backEndDTI) + "%, your back-end DTI is at or below the 36% level many lenders treat as a comfortable benchmark."
          : backEndDTI <= 43
          ? "At " + lib.fmtNumber(backEndDTI) + "%, your back-end DTI is above the commonly cited 36% comfort benchmark but at or below the 43% ceiling used for most Qualified Mortgages."
          : "At " + lib.fmtNumber(backEndDTI) + "%, your back-end DTI is above the 43% level used as the standard Qualified Mortgage ceiling — some loan programs allow higher, but approval and terms become harder to secure.",
        source: "36% and 43% are widely cited reference points (43% is the CFPB's Ability-to-Repay/Qualified Mortgage back-end DTI ceiling for most loans) — not a universal rule, and not personalized lending advice."
      }
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = compute;
  } else {
    global.CalcCompute = compute;
  }
})(typeof window !== "undefined" ? window : globalThis);
