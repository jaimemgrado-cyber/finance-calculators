module.exports = {
  siteName: "ClearSum",
  tagline: "Free Financial Calculators",
  description: "Free, accurate financial calculators for mortgages, loans, savings, debt payoff, salary, sales tax, and everyday money math. Built for U.S. users.",
  // Placeholder — replace with your real production domain before launch.
  domain: "https://www.clearsum-example.com",
  themeColor: "#14213D",
  // Single source of truth for branding assets. The header mark is read
  // directly from `logoMarkFile` at build time and inlined as SVG (no
  // extra HTTP request, crisp at any size) — edit that one file to change
  // the logo everywhere it appears inline. The other paths are files
  // copied as-is into dist/assets/ and referenced by <link>/<meta> tags.
  logo: {
    logoMarkFile: "logo-mark.svg", // inlined into every page's header
    faviconSvg: "/assets/favicon.svg",
    faviconIco: "/assets/favicon.ico",
    favicon16: "/assets/favicon-16x16.png",
    favicon32: "/assets/favicon-32x32.png",
    appleTouchIcon: "/assets/apple-touch-icon.png",
    androidChrome192: "/assets/android-chrome-192x192.png",
    androidChrome512: "/assets/android-chrome-512x512.png",
    ogImage: "/assets/og-image.png",
    manifest: "/site.webmanifest"
  },
  categories: [
    { slug: "loans", name: "Loans", desc: "Mortgages, auto loans, and personal loans." },
    { slug: "investing", name: "Investing", desc: "Compound growth, savings goals, and returns." },
    { slug: "debt", name: "Debt", desc: "Payoff timelines for cards and other balances." },
    { slug: "income", name: "Income", desc: "Convert pay between hourly, weekly, and annual." },
    { slug: "taxes", name: "Taxes", desc: "Sales tax on everyday purchases." },
    { slug: "everyday", name: "Everyday Finance", desc: "Tips, splits, and quick percentages." }
  ],
  legal: {
    // Clearly-marked placeholders — the user must supply real values before launch.
    legalEntityName: "[Your Company Legal Name]",
    contactEmail: "[your-contact-email@example.com]",
    mailingAddress: "[Your Business Mailing Address]",
    lastUpdated: "[Insert launch date]"
  }
};
