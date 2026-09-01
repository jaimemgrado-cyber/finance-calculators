/*
 * icons.js — minimalist flat-vector category icons.
 * Hand-coded inline SVG (no external files, no network dependency), in the
 * same clean/pastel/editorial style requested for illustrations: simple
 * shapes, thin strokes, generous negative space, no text.
 * Each icon sits on a pastel circle sized by CSS (.cat-icon), colored via
 * the category's `accent` token from site-data.js.
 */

const ICONS = {
  // House + small key — loans / mortgages
  loans: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M10 24 L24 12 L38 24" />
    <path d="M14 22 V36 H34 V22" />
    <path d="M20 36 V27 H28 V36" />
    <circle cx="33" cy="14" r="2.6" />
    <path d="M35.5 14 L40 14 M38 14 V17" />
  </svg>`,

  // Upward line + coins — investing
  investing: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 32 L19 22 L26 28 L39 13" />
    <path d="M31 13 H39 V21" />
    <circle cx="13" cy="37" r="3.4" />
    <circle cx="23" cy="37" r="3.4" />
    <circle cx="33" cy="37" r="3.4" />
  </svg>`,

  // Card + descending arrows — debt
  debt: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <rect x="8" y="14" width="26" height="18" rx="2.5" />
    <path d="M8 20 H34" />
    <path d="M13 27 H20" />
    <path d="M38 16 L38 30 M33 25 L38 30 L43 25" />
  </svg>`,

  // Payslip + coin — income
  income: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <rect x="10" y="9" width="22" height="28" rx="2" />
    <path d="M15 16 H27 M15 22 H27 M15 28 H22" />
    <circle cx="34" cy="33" r="6.5" />
    <path d="M34 30 V36 M31.5 33 H36.5" />
  </svg>`,

  // Document + calculator — taxes
  taxes: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11 8 H27 L33 14 V40 H11 Z" />
    <path d="M27 8 V14 H33" />
    <rect x="16" y="20" width="12" height="14" rx="1.5" />
    <path d="M19 24 H25 M19 28 H25 M19 31 H22" />
  </svg>`,

  // Wallet + coins — everyday finance
  everyday: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 16 H36 V34 H8 Z" />
    <path d="M8 16 L12 10 H32" />
    <circle cx="30" cy="25" r="3" />
    <path d="M36 21 H40 V29 H36" />
  </svg>`
};

function renderCategoryIcon(slug) {
  return ICONS[slug] || ICONS.everyday;
}

module.exports = { renderCategoryIcon };
