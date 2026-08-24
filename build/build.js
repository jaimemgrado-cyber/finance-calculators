const fs = require("fs");
const path = require("path");
const C = require("./components.js");
const site = require("./site-data.js");
const calculators = require("./data/calculators.js");

const SRC = path.join(__dirname, "..", "src");
const DIST = path.join(__dirname, "..", "dist");

function write(relPath, content) {
  const full = path.join(DIST, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
}

const calculatorsBySlug = Object.fromEntries(calculators.map((c) => [c.slug, c]));
const categoriesWithCalcs = site.categories.map((cat) => ({
  ...cat,
  calcs: calculators.filter((c) => c.category === cat.slug)
}));

// ---------------------------------------------------------------------
// Home page
// ---------------------------------------------------------------------
function renderHome() {
  const popular = calculators.slice(0, 6);

  const heroHtml = `<section class="hero container">
  <p class="hero__eyebrow">100% Free &middot; No Sign-Up</p>
  <h1>Free Financial Calculators</h1>
  <p class="hero__sub">Fast, accurate tools for mortgages, loans, savings, debt payoff, taxes, and everyday money math — built for U.S. dollars and U.S. users.</p>
  <form class="search-form" role="search" aria-label="Search calculators">
    <label class="visually-hidden" for="calc-search">Search calculators</label>
    <input type="search" id="calc-search" placeholder="Search calculators, e.g. \u2018mortgage\u2019" data-calc-search>
    <button type="submit">Search</button>
  </form>
  <p class="search-empty" data-search-empty>No calculators match your search yet.</p>
</section>`;

  const categorySectionsHtml = categoriesWithCalcs
    .map(
      (cat) => `<section class="section" id="${cat.slug}">
  <div class="container">
    <div class="section__head">
      <h2>${C.esc(cat.name)}</h2>
    </div>
    <div class="calc-grid">
      ${cat.calcs
        .map(
          (calc) => `<a class="calc-card" href="/${calc.slug}/" data-searchable="${C.esc(calc.h1 + " " + cat.name)}">
        <span class="calc-card__cat">${C.esc(cat.name)}</span>
        <span class="calc-card__title">${C.esc(calc.h1)}</span>
        <p class="calc-card__desc">${C.esc(calc.lede)}</p>
      </a>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>`
    )
    .join("\n");

  const popularHtml = `<section class="section">
  <div class="container">
    <div class="section__head"><h2>Popular Calculators</h2></div>
    <div class="cat-grid">
      ${popular
        .map(
          (calc) => `<a class="cat-card" href="/${calc.slug}/">
        <span class="cat-card__label">${C.esc(site.categories.find((c) => c.slug === calc.category).name)}</span>
        <h3>${C.esc(calc.h1)}</h3>
        <p>${C.esc(calc.lede)}</p>
      </a>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>`;

  const directoryHtml = `<section class="section">
  <div class="container">
    <div class="section__head"><h2>All Calculators</h2></div>
    ${categoriesWithCalcs
      .map(
        (cat) => `<div class="directory-group">
      <h3>${C.esc(cat.name)}</h3>
      <ul class="directory-list">
        ${cat.calcs.map((calc) => `<li><a href="/${calc.slug}/">${C.esc(calc.h1)}</a></li>`).join("\n        ")}
      </ul>
    </div>`
      )
      .join("\n    ")}
  </div>
</section>`;

  const adHtml = `<div class="container">${C.renderAdSlot("leaderboard", "Ad space (leaderboard)")}</div>`;

  const body = heroHtml + adHtml + categorySectionsHtml + popularHtml + directoryHtml;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.siteName,
    url: site.domain + "/",
    potentialAction: {
      "@type": "SearchAction",
      target: site.domain + "/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return C.pageShell({
    title: `${site.siteName} — Free U.S. Financial Calculators`,
    description: "Free, accurate financial calculators for mortgages, loans, savings, debt payoff, salary, sales tax, and everyday money math. Built for U.S. users.",
    canonicalPath: "/",
    bodyHtml: body,
    jsonLd
  });
}

// ---------------------------------------------------------------------
// Calculator page
// ---------------------------------------------------------------------
function renderCalculatorPage(calc) {
  const cat = site.categories.find((c) => c.slug === calc.category);
  const breadcrumb = [
    { label: "Home", href: "/" },
    { label: cat.name, href: "/#" + cat.slug },
    { label: calc.h1 }
  ];

  const head = `<div class="container calc-page-head">
  <h1>${C.esc(calc.h1)}</h1>
  <p class="lede">${C.esc(calc.lede)}</p>
</div>`;

  const shell = `<div class="container calc-shell">
  ${C.renderCalculator(calc)}
  ${C.renderSidebar(calc, calculatorsBySlug)}
</div>`;

  const notIncluded = calc.notIncluded
    ? `<div class="callout"><strong>Not included:</strong> ${calc.notIncluded}</div>`
    : "";

  const howItWorks = `<h2>How It Works</h2>
${calc.howItWorks.map((p) => `<p>${p}</p>`).join("\n")}
${notIncluded}`;

  const formulaVarsHtml = calc.formula.vars
    .map(([sym, desc]) => `<li><strong>${C.esc(sym)}</strong> — ${C.esc(desc)}</li>`)
    .join("\n      ");

  const formula = `<h2>Formula</h2>
<div class="formula-box">${C.esc(calc.formula.text)}</div>
<ul>
      ${formulaVarsHtml}
</ul>`;

  const example = `<h2>Example</h2>
<div class="example-box">
  <p><strong>Example inputs:</strong> ${calc.example.inputs}</p>
  <p><strong>Result:</strong> ${calc.example.result}</p>
</div>`;

  const faq = C.renderFAQ(calc.faq);

  const disclaimer = `<p class="disclaimer-note">This calculator provides estimates for informational purposes only and should not be considered financial, tax, or legal advice.</p>`;

  const article = `<div class="container"><article class="article">
${howItWorks}
${formula}
${example}
${faq}
${disclaimer}
</article></div>
<div class="container">${C.renderAdSlot("inline", "Ad space (in-content)")}</div>`;

  const body = head + shell + article;

  const scripts = [`/js/calculators/_lib.js`];
  if (calc.extraTaxData) scripts.push(`/js/calculators/_tax-data.js`);
  scripts.push(`/js/calculators/${calc.jsFile}`);

  return C.pageShell({
    title: calc.title,
    description: calc.metaDescription,
    canonicalPath: `/${calc.slug}/`,
    bodyHtml: body,
    breadcrumb,
    jsonLd: C.faqJsonLd(calc.faq),
    extraScripts: scripts
  });
}

// ---------------------------------------------------------------------
// Legal / static pages
// ---------------------------------------------------------------------
function legalPage({ title, description, canonicalPath, h1, bodyHtml }) {
  const body = `<div class="container legal-article">
  <h1>${C.esc(h1)}</h1>
  <p class="legal-updated">Last updated: <span class="placeholder">${C.esc(site.legal.lastUpdated)}</span></p>
  ${bodyHtml}
</div>`;
  return C.pageShell({
    title,
    description,
    canonicalPath,
    bodyHtml: body,
    breadcrumb: [{ label: "Home", href: "/" }, { label: h1 }]
  });
}

function renderAbout() {
  return legalPage({
    title: `About — ${site.siteName}`,
    description: `Learn about ${site.siteName} and the free financial calculators we offer.`,
    canonicalPath: "/about/",
    h1: "About",
    bodyHtml: `
<p>${C.esc(site.siteName)} builds free, straightforward calculators for common financial questions — mortgages, loans, savings, debt payoff, and everyday money math. Every calculator uses standard, publicly documented formulas, which are shown on each calculator's page alongside a worked example.</p>
<p>We don't offer personalized financial, tax, or legal advice, and we don't claim any results are guaranteed. Each calculator page explains what its formula does and doesn't account for, so you can judge how well it fits your situation.</p>
<p><strong>Company:</strong> <span class="placeholder">${C.esc(site.legal.legalEntityName)}</span></p>
<p><em>This page is a placeholder. Replace this text with real information about your company before launch.</em></p>`
  });
}

function renderContact() {
  return legalPage({
    title: `Contact — ${site.siteName}`,
    description: `Get in touch with the ${site.siteName} team.`,
    canonicalPath: "/contact/",
    h1: "Contact",
    bodyHtml: `
<p>Have a question, spotted an error, or want to suggest a new calculator? We'd like to hear from you.</p>
<p><strong>Email:</strong> <span class="placeholder">${C.esc(site.legal.contactEmail)}</span></p>
<p><strong>Mailing address:</strong> <span class="placeholder">${C.esc(site.legal.mailingAddress)}</span></p>
<p><em>This page is a placeholder. Replace the bracketed details with your real contact information before launch.</em></p>`
  });
}

function renderPrivacyPolicy() {
  return legalPage({
    title: `Privacy Policy — ${site.siteName}`,
    description: `How ${site.siteName} handles data, cookies, and advertising.`,
    canonicalPath: "/privacy-policy/",
    h1: "Privacy Policy",
    bodyHtml: `
<p><em>This is a placeholder privacy policy. Replace it with a policy reviewed for your business before launch — the sections below outline what a site like this typically needs to cover, but are not legal advice.</em></p>
<h2>Information we collect</h2>
<p><span class="placeholder">[Describe what you collect: analytics, cookies, form submissions, etc.]</span> The calculators on this site run entirely in your browser — the numbers you enter into a calculator are not sent to our servers to produce a result.</p>
<h2>Advertising</h2>
<p>This site is designed to display advertising, which may use cookies or similar technologies to personalize ads. <span class="placeholder">[Add specifics once an ad provider, such as Google AdSense, is integrated, including a link to that provider's own privacy disclosures.]</span></p>
<h2>Cookies</h2>
<p><span class="placeholder">[Describe cookie usage once analytics/ad providers are integrated.]</span></p>
<h2>Your choices</h2>
<p><span class="placeholder">[Describe opt-out options, e.g. browser settings, ad personalization controls.]</span></p>
<h2>Contact</h2>
<p>Questions about this policy can be sent to <span class="placeholder">${C.esc(site.legal.contactEmail)}</span>.</p>`
  });
}

function renderTerms() {
  return legalPage({
    title: `Terms of Service — ${site.siteName}`,
    description: `The terms governing use of ${site.siteName}.`,
    canonicalPath: "/terms-of-service/",
    h1: "Terms of Service",
    bodyHtml: `
<p><em>This is a placeholder terms of service document. Replace it with terms reviewed for your business before launch — this is not legal advice.</em></p>
<h2>Use of this site</h2>
<p>The calculators on this site are provided for informational purposes only. By using this site, you agree that results are estimates, not guarantees, and not a substitute for professional financial, tax, or legal advice.</p>
<h2>No warranty</h2>
<p>This site and its calculators are provided "as is," without warranties of any kind, express or implied. <span class="placeholder">[Add your business's specific liability limitations here.]</span></p>
<h2>Changes to these terms</h2>
<p><span class="placeholder">[Describe how and when these terms may be updated.]</span></p>
<h2>Contact</h2>
<p>Questions about these terms can be sent to <span class="placeholder">${C.esc(site.legal.contactEmail)}</span>.</p>`
  });
}

function renderDisclaimer() {
  return legalPage({
    title: `Disclaimer — ${site.siteName}`,
    description: `Important information about the limitations of the calculators on ${site.siteName}.`,
    canonicalPath: "/disclaimer/",
    h1: "Disclaimer",
    bodyHtml: `
<p>The calculators on ${C.esc(site.siteName)} are for informational and educational purposes only. They are not financial, tax, legal, or investment advice, and results should not be relied on as the sole basis for any financial decision.</p>
<p>Every calculator's page describes the formula it uses and what it does not account for. Real-world outcomes depend on factors these calculators can't know — your credit profile, exact loan terms, tax situation, and market conditions among them.</p>
<p>We do not guarantee the accuracy of any result and are not liable for decisions made based on this site. Consider speaking with a qualified financial professional for advice specific to your situation.</p>`
  });
}

// ---------------------------------------------------------------------
// Sitemap & robots
// ---------------------------------------------------------------------
function renderSitemap() {
  const staticPaths = ["/", "/about/", "/contact/", "/privacy-policy/", "/terms-of-service/", "/disclaimer/"];
  const calcPaths = calculators.map((c) => `/${c.slug}/`);
  const all = [...staticPaths, ...calcPaths];
  const urls = all
    .map((p) => `  <url>\n    <loc>${site.domain}${p}</loc>\n  </url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function renderRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${site.domain}/sitemap.xml\n`;
}

function renderManifest() {
  return JSON.stringify(
    {
      name: site.siteName + " — " + site.tagline,
      short_name: site.siteName,
      description: site.description,
      start_url: "/",
      display: "standalone",
      background_color: "#FAFAF8",
      theme_color: site.themeColor,
      icons: [
        { src: site.logo.androidChrome192, sizes: "192x192", type: "image/png" },
        { src: site.logo.androidChrome512, sizes: "512x512", type: "image/png" }
      ]
    },
    null,
    2
  );
}

// ---------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------
function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dest);
    else fs.copyFileSync(src, dest);
  }
}

function build() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  copyDir(path.join(SRC, "css"), path.join(DIST, "css"));
  copyDir(path.join(SRC, "js"), path.join(DIST, "js"));
  copyDir(path.join(SRC, "assets"), path.join(DIST, "assets"));

  write("index.html", renderHome());
  calculators.forEach((calc) => write(`${calc.slug}/index.html`, renderCalculatorPage(calc)));

  write("about/index.html", renderAbout());
  write("contact/index.html", renderContact());
  write("privacy-policy/index.html", renderPrivacyPolicy());
  write("terms-of-service/index.html", renderTerms());
  write("disclaimer/index.html", renderDisclaimer());

  write("sitemap.xml", renderSitemap());
  write("robots.txt", renderRobots());
  write("site.webmanifest", renderManifest());

  console.log(`Built ${calculators.length} calculator pages + 6 static pages to dist/`);
}

build();
