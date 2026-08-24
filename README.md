# ClearSum — Financial Calculators Site

Static, framework-free multi-page site. No build step is required to run it —
`dist/` is the finished, deployable site. `src/` and `build/` are the source
you'd edit to add more calculators or change content.

## Project structure

```
dist/         ← deploy this folder as-is to any static host (Netlify, Vercel,
                S3 + CloudFront, GitHub Pages, nginx, etc.) — no server-side
                code, no build step needed at deploy time
  index.html, <calculator-slug>/index.html, about/, contact/, ...
  css/styles.css
  js/calc-runtime.js, js/calculators/*.js
  assets/       ← logo, favicons, social-share image
  sitemap.xml, robots.txt, site.webmanifest

src/          ← source files the build script reads from
  css/, js/, assets/

build/        ← the static site generator (plain Node, no dependencies)
  build.js, components.js, site-data.js, data/calculators.js

tests/        ← Node test suites for every calculator's math (no dependencies)

package.json  ← `npm run build` / `npm test` convenience scripts
README.md     ← this file
```

To deploy: upload the contents of `dist/` to any static host. To make
changes: edit `src/` or `build/`, then run `node build/build.js` (or
`npm run build`) to regenerate `dist/`.

## Branding

All brand info — site name, tagline, domain, meta description, theme color,
and every logo/icon file path — is centralized in one file:
`build/site-data.js`. Nothing else references these values directly; every
page pulls from that one config at build time. To rebrand later (new name,
new domain, swapped logo), edit that file and re-run `node build/build.js`
— you never need to touch individual pages.

**Logo:** an abstract mark built from two asymmetric rounded bars — read as
an "=" (equals), the universal symbol of a calculation resolving to an
answer, and a quiet nod to the name "ClearSum." Deliberately not a dollar
sign, coin, or stack of cash. It's two-tone (ink navy + teal, the site's
own accent colors) at header size, and a light-on-navy variant for
favicons so it stays legible on browser tab bars and app icon grids.

- `src/assets/logo-mark.svg` — the master file. The build script reads
  this directly and inlines it into every page's header at build time, so
  changing this one file updates the logo site-wide with no other edits
  and no extra HTTP request.
- `src/assets/favicon.svg` — the filled-background variant, used for the
  scalable favicon most modern browsers now support.
- `src/assets/favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`,
  `apple-touch-icon.png` (180×180), `android-chrome-192x192.png`,
  `android-chrome-512x512.png` — raster fallbacks for browsers/platforms
  that don't support SVG favicons, generated from `favicon.svg`. If you
  change the mark, regenerate these (any SVG-to-PNG tool works — the
  build script doesn't do this automatically, to keep `build.js`
  dependency-free).
- `src/assets/og-image.png` (1200×630) — the social-share preview image,
  referenced by the Open Graph/Twitter Card tags every page now includes.
- `dist/site.webmanifest` — generated at build time from `site-data.js`,
  so its name/description/theme color always match the rest of the site.

## What's included

**All 20 calculators from your original list, live and tested, across all 6 categories:**

- Loans: Mortgage, Loan (generic), Auto Loan, Personal Loan
- Investing: Compound Interest, Savings Goal, Investment, Retirement, ROI
- Debt: Credit Card Payoff, Debt Payoff (with extra-payment comparison)
- Income: Salary, Salary to Hourly, Take-Home Pay
- Taxes: Sales Tax, Income Tax
- Everyday Finance: Tip, Percentage, Discount, Inflation

One consolidation: your list included both "Salary Calculator" and "Hourly
to Salary Calculator" as separate items. Those are the same calculation
(hourly wage → weekly/monthly/annual pay), so building both would have meant
two near-identical pages, which your brief explicitly asked to avoid.
"Salary Calculator" covers that conversion; "Salary to Hourly Calculator"
covers the genuinely different reverse direction.

Each calculator has its own URL, unique title/meta description/H1, formula
explanation, worked example, FAQ (with FAQPage schema), related-calculator
links, and a "not included" callout where relevant. Every internal link in
the site resolves to a real page.

## On the tax-related calculators specifically

Income Tax Calculator and Take-Home Pay Calculator use **real, sourced 2026
figures**, not invented tax law:

- Federal tax brackets and standard deduction: IRS, "IRS releases tax
  inflation adjustments for tax year 2026" (Revenue Procedure 2025-32),
  fetched directly from irs.gov.
- Social Security wage base and rate: Social Security Administration,
  ssa.gov, fetched directly.

These cover **Single, Married Filing Jointly, and Head of Household**. The
Single/MFJ figures were fetched directly from irs.gov and ssa.gov. The Head
of Household bracket thresholds were cross-checked across several
independent sources that each cite IRS Revenue Procedure 2025-32 directly
(rather than fetched from irs.gov itself), and the resulting math was
hand-verified against a worked example ($80,000 gross, HoH → $55,850
taxable → $6,348 federal tax, confirmed bracket-by-bracket). Married Filing
Separately still isn't included — its thresholds weren't independently
verified, so it's left out rather than guessed, and the FAQ says so
directly. State income tax uses a flat rate the user supplies (same
pattern as the Sales Tax Calculator), since state tax rules vary too widely
to hardcode. All of this is stated on the pages themselves, not just here —
see each page's "How It Works" and "Not included" sections.

**These figures are specific to tax year 2026 and will need updating in
`src/js/calculators/_tax-data.js` when the IRS publishes 2027 figures**
(typically each October).

## Why this architecture (plain HTML/CSS/JS, no framework)

Given the priority order you set — accuracy, usability, speed, SEO,
accessibility, design — a static, dependency-free site was the safest
default: every page is real, pre-rendered HTML (best possible SEO and Core
Web Vitals), there's no framework runtime to download, and there's nothing
to break silently when a dependency updates.

- `build/site-data.js` — the single source of truth for brand identity
  (name, tagline, domain, description, theme color, and every logo/icon
  path — see "Branding" above). Every other file reads from here.
- `build/data/calculators.js` — all page content and field config, in one
  place. Adding a calculator means adding one entry here.
- `src/js/calculators/<slug>.js` — the math for one calculator, as a pure
  function. Nothing about validation, formatting, or HTML lives in these
  files, so each is independently testable (see `Testing` below).
- `src/js/calculators/_tax-data.js` — shared, sourced tax constants used by
  both tax calculators, so they can't drift out of sync with each other.
- `src/js/calc-runtime.js` — the one shared script that handles form
  validation (including a `select` field type for filing status), calls
  the calculator's compute function, and renders the result.
- `build/components.js` + `build/build.js` — generates every static HTML
  page from the data above, so header/footer/FAQ/related-links markup is
  never duplicated by hand across pages.

To regenerate the site after editing anything in `src/` or `build/`, run:
```
node build/build.js
```
or
```
npm run build
```
This writes the full site to `dist/`, which is what you deploy.

## Testing

Test files live in `tests/` and have no dependencies beyond Node itself:
```
node tests/run-all.js
```
or
```
npm test
```

Every calculator's math was checked in Node against known correct values
before being wired into any page — 36 checks total, covering things like:
a $240,000 loan at 6% APR over 30 years producing a $1,438.92 monthly
payment, a $63,900 single-filer taxable income producing exactly $8,770 in
federal tax under the 2026 brackets (hand-verified bracket-by-bracket), a
Head of Household worked example ($80,000 gross → $55,850 taxable →
$6,348 federal tax, also hand-verified), the 2026 Social Security wage
base cap kicking in correctly above $184,500, and the Additional Medicare
Tax applying only above its threshold.

It was also exercised in a real Chromium browser (via Playwright): form
validation, error messages, the reset button (including resetting a
`<select>` back to its default), the filing-status dropdown, the "payment
too low to ever pay off this balance" edge case, and an invalid-ages edge
case on the Retirement Calculator (retirement age before current age).

## Decisions made where the brief left something open

- **Domain and brand name:** invented as placeholders (`ClearSum`,
  `www.clearsum-example.com`) since none were provided. Swap the domain in
  `build/site-data.js` and re-run the build.
- **Logo:** designed fresh for this brief (see "Branding" above) rather
  than using a generic dollar-sign or money-stack icon, per your
  instruction to avoid financial clichés.
- **Legal pages (About, Contact, Privacy Policy, Terms, Disclaimer):**
  written as real page structures with clearly marked `[bracketed
  placeholders]` for your legal name, address, and email — no fictional
  company details were presented as real. These are not a substitute for a
  lawyer's review.
- **Design direction:** a paper-and-ink palette with a single teal accent,
  and a "ledger tape" styled result readout as the one distinctive visual
  element — grounded in the site being a calculator tool.
- **AdSense:** slots are placed and styled (leaderboard, in-content,
  sidebar) but contain no ad code yet, per your instructions not to add
  placeholder/fake ads.
- **4% retirement withdrawal rule:** presented explicitly as "a commonly
  referenced starting point," not a recommendation, per your instruction
  not to overstate authority.

## Known gaps to flag before launch

- No real domain, analytics, or ad code is wired in.
- Legal pages need your actual business details and a real legal review.
- Married Filing Separately still isn't covered by the two tax calculators
  (Head of Household now is — see above).
- The 2026 tax figures need a yearly refresh — they will not update
  themselves.
- Fonts are loaded from Google Fonts by CDN link; if you want zero
  third-party requests, self-host the three font files instead.

