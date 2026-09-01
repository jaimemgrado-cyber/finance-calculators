module.exports = {
  siteName: "ClearSum",
  tagline: "Free Financial Calculators",
  description:
    "Free, accurate financial calculators for mortgages, loans, savings, debt payoff, salary, sales tax, and everyday money math. Built for U.S. users.",

  // Production domain
  domain: "https://finance-calculators-sooty.vercel.app",

  themeColor: "#101B33",

  logo: {
    logoMarkFile: "logo-mark.svg",
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
    {
      slug: "loans",
      name: "Loans",
      desc: "Mortgages, auto loans, and personal loans.",
      accent: "sky",
      icon: "loans"
    },
    {
      slug: "investing",
      name: "Investing",
      desc: "Compound growth, savings goals, and returns.",
      accent: "mint",
      icon: "investing"
    },
    {
      slug: "debt",
      name: "Debt",
      desc: "Payoff timelines for cards and other balances.",
      accent: "peach",
      icon: "debt"
    },
    {
      slug: "income",
      name: "Income",
      desc: "Convert pay between hourly, weekly, and annual.",
      accent: "lavender",
      icon: "income"
    },
    {
      slug: "taxes",
      name: "Taxes",
      desc: "Sales tax on everyday purchases.",
      accent: "sand",
      icon: "taxes"
    },
    {
      slug: "everyday",
      name: "Everyday Finance",
      desc: "Tips, splits, and quick percentages.",
      accent: "mint",
      icon: "everyday"
    }
  ],

  legal: {
    legalEntityName: "ClearSum",
    contactEmail: "",
    // Optional: a form-backend endpoint (e.g. from Formspree, Getform, or
    // similar) so the Contact page can submit a real message with zero
    // backend code and zero fixed cost. Leave blank to fall back to the
    // mailto: link above (once contactEmail is set) or a "no method
    // configured yet" notice — the page never publishes a personal inbox.
    contactFormAction: "",
    mailingAddress: "United States",
    lastUpdated: "August 24, 2026"
  }
};
