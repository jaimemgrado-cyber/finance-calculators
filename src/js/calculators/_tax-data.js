/*
 * _tax-data.js — shared 2026 federal tax constants.
 * Sources (fetched directly, not inferred):
 *   - IRS, "IRS releases tax inflation adjustments for tax year 2026..." (IR-2025-103,
 *     Oct. 9, 2025), irs.gov — Single/MFJ bracket thresholds and standard deduction
 *     (fetched directly from irs.gov).
 *   - IRS Revenue Procedure 2025-32 Head of Household table, cross-checked across
 *     multiple independent secondary sources that each cite Rev. Proc. 2025-32
 *     directly (a TIAA quick tax reference PDF, and others) — not fetched from
 *     irs.gov itself, so treat with slightly more caution than the Single/MFJ figures.
 *   - Social Security Administration, "What is the current maximum amount of taxable
 *     earnings for Social Security?", ssa.gov — 2026 wage base ($184,500) and rate
 *     (fetched directly from ssa.gov).
 * Married Filing Separately is intentionally left out — its thresholds weren't
 * independently verified against a primary source, so rather than guess, that
 * status simply isn't offered.
 * These figures apply to tax year 2026 only and will need updating for future years.
 */
(function (global) {
  "use strict";

  var STANDARD_DEDUCTION = {
    single: 16100,
    mfj: 32200,
    hoh: 24150
  };

  // Each bracket: taxed portion of income from `from` up to (not including) `to`.
  // `to: null` means no upper bound.
  var BRACKETS = {
    single: [
      { rate: 0.10, from: 0, to: 12400 },
      { rate: 0.12, from: 12400, to: 50400 },
      { rate: 0.22, from: 50400, to: 105700 },
      { rate: 0.24, from: 105700, to: 201775 },
      { rate: 0.32, from: 201775, to: 256225 },
      { rate: 0.35, from: 256225, to: 640600 },
      { rate: 0.37, from: 640600, to: null }
    ],
    mfj: [
      { rate: 0.10, from: 0, to: 24800 },
      { rate: 0.12, from: 24800, to: 100800 },
      { rate: 0.22, from: 100800, to: 211400 },
      { rate: 0.24, from: 211400, to: 403550 },
      { rate: 0.32, from: 403550, to: 512450 },
      { rate: 0.35, from: 512450, to: 768700 },
      { rate: 0.37, from: 768700, to: null }
    ],
    hoh: [
      { rate: 0.10, from: 0, to: 17700 },
      { rate: 0.12, from: 17700, to: 67450 },
      { rate: 0.22, from: 67450, to: 105700 },
      { rate: 0.24, from: 105700, to: 201775 },
      { rate: 0.32, from: 201775, to: 256225 },
      { rate: 0.35, from: 256225, to: 640600 },
      { rate: 0.37, from: 640600, to: null }
    ]
  };

  var FICA = {
    socialSecurityRate: 0.062,
    socialSecurityWageBase: 184500,
    medicareRate: 0.0145,
    additionalMedicareRate: 0.009,
    additionalMedicareThreshold: { single: 200000, mfj: 250000, hoh: 200000 }
  };

  function bracketTax(taxableIncome, filingStatus) {
    var brackets = BRACKETS[filingStatus];
    if (!brackets || taxableIncome <= 0) return 0;
    var tax = 0;
    for (var idx = 0; idx < brackets.length; idx++) {
      var b = brackets[idx];
      var upper = b.to === null ? Infinity : b.to;
      if (taxableIncome <= b.from) break;
      var taxedInThisBracket = Math.min(taxableIncome, upper) - b.from;
      tax += taxedInThisBracket * b.rate;
    }
    return tax;
  }

  function marginalRate(taxableIncome, filingStatus) {
    var brackets = BRACKETS[filingStatus];
    if (!brackets) return 0;
    var rate = brackets[0].rate;
    for (var idx = 0; idx < brackets.length; idx++) {
      var b = brackets[idx];
      if (taxableIncome > b.from) rate = b.rate;
    }
    return rate;
  }

  var api = {
    STANDARD_DEDUCTION: STANDARD_DEDUCTION,
    BRACKETS: BRACKETS,
    FICA: FICA,
    bracketTax: bracketTax,
    marginalRate: marginalRate
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    global.ClearSumTaxData = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
