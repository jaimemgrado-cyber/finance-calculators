const fs = require("fs");
const path = require("path");
const C = require("./components.js");
const site = require("./site-data.js");
const calculators = require("./data/calculators.js");
const seoPages = require("./data/seo-pages.js");
const { renderCategoryIcon } = require("./icons.js");

const SRC = path.join(__dirname, "..", "src");
const DIST = path.join(__dirname, "..", "dist");

function write(relPath, content) {
  const full = path.join(DIST, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
}

const calculatorsBySlug = Object.fromEntries(
  calculators.map((c) => [c.slug, c])
);

const categoriesWithCalcs = site.categories.map((cat) => ({
  ...cat,
  calcs: calculators.filter((c) => c.category === cat.slug)
}));

// ---------------------------------------------------------------------
// Home page
// ---------------------------------------------------------------------
function render404() {
  const body = `<main class="container article" style="padding-top:4rem;padding-bottom:5rem;text-align:center">
    <p class="hero__eyebrow">404</p>
    <h1>Page not found</h1>
    <p class="lede">The page you are looking for does not exist or may have moved.</p>
    <p><a class="button" href="/">Back to ClearSum</a> &nbsp; <a href="/calculators/">Browse all calculators</a></p>
  </main>`;
  return C.pageShell({
    title: `Page Not Found — ${site.siteName}`,
    description: `The requested page could not be found on ${site.siteName}.`,
    canonicalPath: "/404.html",
    bodyHtml: body,
    robots: "noindex, nofollow"
  });
}

function renderHome() {
  // "Popular" is a curated, honest pick of one flagship calculator per
  // category (not an unverifiable traffic ranking) so every category is
  // represented from the very first screen.
  const popular = categoriesWithCalcs
    .map((cat) => cat.calcs[0])
    .filter(Boolean);

  const heroHtml = `<section class="hero container">
  <p class="hero__eyebrow">100% Free &middot; No Sign-Up &middot; Runs in Your Browser</p>
  <h1>Clear numbers for every money decision</h1>
  <p class="hero__sub">${calculators.length} free calculators for mortgages, loans, investing, debt payoff, income, and taxes — with visual results and plain-English explanations, not just a number.</p>
  <form class="search-form" action="/search/" method="get" role="search" aria-label="Search calculators">
    <label class="visually-hidden" for="calc-search">Search calculators</label>
    <input type="search" id="calc-search" placeholder="Search calculators, e.g. \u2018mortgage\u2019" data-calc-search>
    <button type="submit">Search</button>
  </form>
  <p class="search-empty" data-search-empty>No calculators match your search yet.</p>
  <div class="hero-stats">
    <div class="hero-stats__item"><span class="hero-stats__num">${calculators.length}</span><span class="hero-stats__label">Calculators</span></div>
    <div class="hero-stats__item"><span class="hero-stats__num">${site.categories.length}</span><span class="hero-stats__label">Categories</span></div>
    <div class="hero-stats__item"><span class="hero-stats__num">$0</span><span class="hero-stats__label">Cost, ever</span></div>
  </div>
</section>`;

  const popularHtml = `<section class="section">
  <div class="container">
    <div class="section__head"><h2>Popular calculators</h2></div>
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

  const categoryIconGridHtml = `<section class="section" aria-label="Browse by category">
  <div class="container">
    <div class="section__head"><h2>Browse by category</h2></div>
    <div class="cat-icon-grid">
      ${categoriesWithCalcs
        .map(
          (cat) => `<a class="cat-icon-card" href="/category/${cat.slug}/">
        <span class="cat-icon cat-icon--${cat.accent}" aria-hidden="true">${renderCategoryIcon(cat.icon)}</span>
        <span>
          <h3>${C.esc(cat.name)}</h3>
          <p>${C.esc(cat.desc)}</p>
          <span class="cat-icon-card__count">${cat.calcs.length} calculator${cat.calcs.length === 1 ? "" : "s"}</span>
        </span>
      </a>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>`;

  const categorySectionsHtml = categoriesWithCalcs
    .map(
      (cat) => `<section class="section" id="${cat.slug}">
  <div class="container">
    <div class="section__head">
      <span class="cat-icon cat-icon--${cat.accent}" aria-hidden="true" style="width:36px;height:36px;">${renderCategoryIcon(cat.icon)}</span>
      <h2 style="margin-left:10px;">${C.esc(cat.name)}</h2>
    </div>
    <div class="calc-grid">
      ${cat.calcs
        .map(
          (calc) => `<a class="calc-card" href="/${calc.slug}/" data-searchable="${C.esc([calc.h1, calc.lede, calc.slug, cat.name].join(" "))}">
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

  const directoryHtml = `<section class="section">
  <div class="container">
    <div class="section__head"><h2>All calculators</h2></div>
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

  const adHtml = `<div class="container">${C.renderAdSlot(
    "leaderboard",
    "Ad space (leaderboard)"
  )}</div>`;

  const body =
    heroHtml +
    popularHtml +
    categoryIconGridHtml +
    adHtml +
    categorySectionsHtml +
    directoryHtml;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.domain}/#website`,
    name: site.siteName,
    url: site.domain + "/",
    publisher: { "@id": `${site.domain}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: site.domain + "/search/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return C.pageShell({
    title: `${site.siteName} — Free U.S. Financial Calculators`,
    description:
      "Free, accurate financial calculators for mortgages, loans, savings, debt payoff, salary, sales tax, and everyday money math. Built for U.S. users.",
    canonicalPath: "/",
    bodyHtml: body,
    jsonLd
  });
}

// ---------------------------------------------------------------------
// Search page
// ---------------------------------------------------------------------
function renderSearchPage() {
  const cards = calculators
    .map((calc) => {
      const cat = site.categories.find((c) => c.slug === calc.category);
      const searchable = [calc.h1, calc.lede, calc.slug, cat.name].join(" ");
      return `<article class="search-result" data-searchable="${C.esc(searchable)}">
  <a href="/${calc.slug}/">
    <span class="calc-card__cat">${C.esc(cat.name)}</span>
    <h2>${C.esc(calc.h1)}</h2>
    <p>${C.esc(calc.lede)}</p>
  </a>
</article>`;
    })
    .join("\n");

  const body = `<div class="container calc-page-head">
  <h1>Search calculators</h1>
  <p class="lede">Find a ClearSum calculator by name, topic, or what you are trying to calculate.</p>
  <form class="search-form search-form--page" action="/search/" method="get" role="search" aria-label="Search calculators">
    <label class="visually-hidden" for="search-page-input">Search calculators</label>
    <input type="search" id="search-page-input" name="q" placeholder="Try mortgage, refinance, salary, debt, savings..." autocomplete="off" data-calc-search-page>
    <button type="submit">Search</button>
  </form>
  <p class="search-status" data-search-status aria-live="polite">Showing all ${calculators.length} calculators.</p>
</div>
<div class="container">
  <div class="search-results" data-search-results>
    ${cards}
  </div>
  <p class="search-empty search-empty--page" data-search-empty-page>No calculators match your search. Try a broader term such as mortgage, loan, savings, debt, salary, or tax.</p>
</div>`;

  return C.pageShell({
    title: `Search Financial Calculators — ${site.siteName}`,
    description: `Search ${site.siteName}'s free financial calculators by topic, name, or financial task.`,
    canonicalPath: "/search/",
    bodyHtml: body,
    robots: "noindex, follow"
  });
}

// ---------------------------------------------------------------------
// Calculator page
// ---------------------------------------------------------------------
function renderCalculatorPage(calc) {
  const cat = site.categories.find((c) => c.slug === calc.category);

  const breadcrumb = [
    { label: "Home", href: "/" },
    { label: cat.name, href: "/category/" + cat.slug + "/" },
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
    .map(
      ([sym, desc]) =>
        `<li><strong>${C.esc(sym)}</strong> — ${C.esc(desc)}</li>`
    )
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
<div class="container">${C.renderAdSlot(
    "inline",
    "Ad space (in-content)"
  )}</div>`;

  const body = head + shell + article;

  const scripts = [`/js/calculators/_lib.js`];

  if (calc.extraTaxData) {
    scripts.push(`/js/calculators/_tax-data.js`);
  }

  scripts.push(`/js/calculators/${calc.jsFile}`);

  return C.pageShell({
    title: calc.title,
    description: calc.metaDescription,
    canonicalPath: `/${calc.slug}/`,
    bodyHtml: body,
    breadcrumb,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${site.domain}/${calc.slug}/#webpage`,
        name: calc.title,
        url: `${site.domain}/${calc.slug}/`,
        isPartOf: { "@id": `${site.domain}/#website` },
        about: { "@type": "WebApplication", name: calc.h1, applicationCategory: "FinanceApplication", operatingSystem: "Web" }
      },
      C.faqJsonLd(calc.faq),
      C.breadcrumbJsonLd(breadcrumb)
    ],
    extraScripts: scripts
  });
}

// ---------------------------------------------------------------------
// SEO content pages
// ---------------------------------------------------------------------
function renderSeoPage(page) {
  const relatedCalculator = page.relatedCalculator
    ? calculatorsBySlug[page.relatedCalculator]
    : null;

  const breadcrumb = [
    { label: "Home", href: "/" },
    { label: page.h1 }
  ];

  const sectionsHtml = (page.sections || [])
    .map(
      (section) => `
<h2>${C.esc(section.heading)}</h2>
${(section.paragraphs || [])
  .map((paragraph) => `<p>${C.esc(paragraph)}</p>`)
  .join("\n")}
`
    )
    .join("\n");

  const relatedHtml = relatedCalculator
    ? `
<section class="section">
  <div class="container">
    <div class="cat-card">
      <span class="cat-card__label">Related Calculator</span>
      <h2>${C.esc(relatedCalculator.h1)}</h2>
      <p>${C.esc(
        page.ctaDescription || relatedCalculator.lede
      )}</p>
      <p>
        <a class="button" href="/${relatedCalculator.slug}/">
          ${C.esc(
            page.ctaText || `Use the ${relatedCalculator.h1}`
          )}
        </a>
      </p>
    </div>
  </div>
</section>
`
    : "";

  const adHtml = `<div class="container">${C.renderAdSlot(
    "inline",
    "Ad space (in-content)"
  )}</div>`;

  const body = `
<div class="container calc-page-head">
  <h1>${C.esc(page.h1)}</h1>
  <p class="lede">${C.esc(page.intro)}</p>
</div>

${adHtml}

<div class="container">
  <article class="article">
    ${sectionsHtml}
  </article>
</div>

${relatedHtml}

<div class="container">
  <p class="disclaimer-note">
    This content is provided for informational and educational purposes only.
    It is not financial, tax, legal, or investment advice.
  </p>
</div>
`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.h1,
    description: page.metaDescription,
    url: `${site.domain}/${page.slug}/`,
    publisher: {
      "@type": "Organization",
      name: site.siteName
    }
  };

  return C.pageShell({
    title: page.title,
    description: page.metaDescription,
    canonicalPath: `/${page.slug}/`,
    bodyHtml: body,
    breadcrumb,
    jsonLd: [jsonLd, C.breadcrumbJsonLd(breadcrumb)]
  });
}

// ---------------------------------------------------------------------
// Legal / static pages
// ---------------------------------------------------------------------
function legalPage({ title, description, canonicalPath, h1, bodyHtml }) {
  const body = `<div class="container legal-article">
  <h1>${C.esc(h1)}</h1>
  <p class="legal-updated">Last updated: ${C.esc(
    site.legal.lastUpdated
  )}</p>
  <div class="legal-identification">
    <h2>Site operator</h2>
    <p><strong>Responsible party:</strong> ${C.esc(site.legal.legalEntityName)}</p>
    <p><strong>NIF:</strong> ${C.esc(site.legal.taxId)}</p>
    <p><strong>Address:</strong> ${C.esc(site.legal.mailingAddress)}</p>
    <p><strong>Email:</strong> <a href="mailto:${C.esc(site.legal.contactEmail)}">${C.esc(site.legal.contactEmail)}</a></p>
  </div>
  ${bodyHtml}
</div>`;

  return C.pageShell({
    title,
    description,
    canonicalPath,
    bodyHtml: body,
    breadcrumb: [
      { label: "Home", href: "/" },
      { label: h1 }
    ]
  });
}

function renderAbout() {
  return legalPage({
    title: `About — ${site.siteName}`,
    description: `Learn about ${site.siteName} and the free financial calculators we offer.`,
    canonicalPath: "/about/",
    h1: "About",
    bodyHtml: `
<p>${C.esc(site.siteName)} provides free financial calculators designed to help users estimate common financial figures quickly and understand the calculations behind them.</p>

<p>Our calculators cover topics such as mortgages, loans, savings, debt payoff, salary, taxes, and other everyday financial calculations. Each calculator is designed around established mathematical or financial formulas and provides an explanation of how the calculation works.</p>

<p>The results produced by our calculators are estimates for informational and educational purposes. Actual financial results can vary depending on individual circumstances, financial products, tax rules, fees, rates, and other factors.</p>

<p>${C.esc(site.siteName)} does not provide personalized financial, investment, tax, or legal advice. Users should consult an appropriately qualified professional when they need advice specific to their circumstances.</p>

<p>For questions, corrections, suggestions, or other inquiries, please use the contact information provided on our Contact page.</p>`
  });
}

function renderContact() {
  const hasForm = !!site.legal.contactFormAction;
  const hasEmail = !!site.legal.contactEmail;

  const formHtml = hasForm
    ? `<form class="contact-form" action="${C.esc(site.legal.contactFormAction)}" method="POST">
  <div class="field">
    <label for="contact-name">Name</label>
    <div class="field-input-wrap"><input type="text" id="contact-name" name="name" required></div>
  </div>
  <div class="field">
    <label for="contact-email">Your email</label>
    <div class="field-input-wrap"><input type="email" id="contact-email" name="email" required></div>
  </div>
  <div class="field">
    <label for="contact-message">Message</label>
    <div class="field-input-wrap"><textarea id="contact-message" name="message" rows="6" required></textarea></div>
  </div>
  <div class="calc-actions"><button type="submit" class="btn btn-primary">Send message</button></div>
</form>`
    : hasEmail
    ? `<p><a href="mailto:${C.esc(site.legal.contactEmail)}">${C.esc(site.legal.contactEmail)}</a></p>`
    : `<div class="callout"><strong>Contact form coming soon.</strong> This site doesn't have a monitored inbox configured yet — check back shortly, or look for an updated contact method on this page.</div>`;

  return legalPage({
    title: `Contact — ${site.siteName}`,
    description: `Get in touch with the ${site.siteName} team.`,
    canonicalPath: "/contact/",
    h1: "Contact",
    bodyHtml: `
<p>Found an error in a calculator, have a question, or want to suggest a new tool? Send us a message below — we read every one, though we can't guarantee a personal reply to every message.</p>

${formHtml}

<p class="result-note">Messages sent to the contact address are used to respond to inquiries, corrections, and suggestions relating to the website.</p>`
  });
}

function renderPrivacyPolicy() {
  return legalPage({
    title: `Privacy Policy — ${site.siteName}`,
    description: `How ${site.siteName} handles data, cookies, and advertising.`,
    canonicalPath: "/privacy-policy/",
    h1: "Privacy Policy",
    bodyHtml: `
<p>This Privacy Policy explains how ${C.esc(
      site.siteName
    )} handles information when you visit and use this website.</p>

<h2>Information We Collect</h2>
<p>The financial calculators on this website are designed to perform calculations in your web browser. The numerical values you enter into a calculator are not required to be submitted to our servers in order for the calculator to produce its result.</p>

<p>Depending on how the website is operated and which services are enabled, limited technical information may be processed automatically, such as your IP address, browser type, device information, approximate location, referring page, and information about how the website is accessed. This information may be used for security, technical operation, performance measurement, and website improvement.</p>

<h2>Cookies and Similar Technologies</h2>
<p>${C.esc(
      site.siteName
    )} may use cookies and similar technologies that are necessary for the operation of the website, to remember preferences, measure website usage, or support advertising services.</p>

<p>Cookies may be placed by third-party services used by the website. You can control or delete cookies through your browser settings. Disabling certain cookies may affect some website functionality.</p>

<h2>Advertising</h2>
<p>This website may display advertising provided by third-party advertising services, including Google AdSense. Advertising providers may use cookies or similar technologies to deliver, measure, and personalize advertisements in accordance with their own policies and applicable privacy requirements.</p>

<p>Where required by applicable law, the website may request your consent before using certain cookies or similar technologies for personalized advertising or other purposes that require consent.</p>

<h2>Third-Party Services</h2>
<p>Third-party services used by this website may process information in accordance with their own privacy policies. These services may include hosting, analytics, advertising, security, and other technical providers necessary to operate the website.</p>

<h2>Your Privacy Choices</h2>
<p>You may manage cookies through your browser settings. Where applicable, you may also use the privacy or consent controls provided on the website to manage your choices regarding cookies and personalized advertising.</p>

<p>You may also have additional privacy rights under the laws applicable to you, depending on your location. These rights may include rights to access, correct, delete, restrict, or object to certain processing of personal information.</p>

<h2>Children's Privacy</h2>
<p>This website is not intended to knowingly collect personal information from children. If you believe that a child has provided personal information to us, please contact us so that the information can be reviewed and, where appropriate, removed.</p>

<h2>Changes to This Privacy Policy</h2>
<p>This Privacy Policy may be updated from time to time to reflect changes to the website, the services we use, or applicable legal requirements. The updated version will be published on this page with a revised update date.</p>

<h2>Contact</h2>
<p>If you have questions about this Privacy Policy or the way information is handled on this website, please use the Contact page.</p>`
  });
}

function renderTerms() {
  return legalPage({
    title: `Terms of Service — ${site.siteName}`,
    description: `The terms governing use of ${site.siteName}.`,
    canonicalPath: "/terms-of-service/",
    h1: "Terms of Service",
    bodyHtml: `
<p>These Terms of Service govern your use of ${C.esc(
      site.siteName
    )}. By accessing or using this website, you agree to these terms.</p>

<h2>Use of This Site</h2>
<p>${C.esc(
      site.siteName
    )} provides financial calculators and related information for general informational and educational purposes.</p>

<p>You may use the calculators for lawful personal or informational purposes. You are responsible for reviewing the information produced by the calculators and determining whether it is appropriate for your circumstances.</p>

<h2>Calculator Results</h2>
<p>The calculators provide estimates based on the information entered by the user and the formulas implemented by the website. Results are not guarantees of actual financial outcomes.</p>

<p>Actual results may differ because of factors including, but not limited to, interest rates, fees, taxes, credit terms, lender requirements, market conditions, individual financial circumstances, and changes in applicable laws or regulations.</p>

<h2>No Professional Advice</h2>
<p>The information and calculations provided by this website are not financial, investment, tax, accounting, or legal advice. Nothing on this website creates a professional advisory relationship between ${C.esc(
      site.siteName
    )} and the user.</p>

<p>For decisions involving significant financial, tax, investment, or legal consequences, you should consider consulting an appropriately qualified professional.</p>

<h2>Accuracy and Availability</h2>
<p>We aim to keep the website and its calculators useful and accurate, but we do not guarantee that all information, calculations, content, or services will always be complete, current, accurate, or available without interruption.</p>

<h2>Third-Party Services and Advertising</h2>
<p>The website may contain advertisements, links, or services provided by third parties. Third-party services operate under their own terms and privacy policies. ${C.esc(
      site.siteName
    )} is not responsible for the content, availability, or practices of third-party websites or services.</p>

<h2>Intellectual Property</h2>
<p>Unless otherwise stated, the content, design, branding, graphics, and original materials on this website are owned by or licensed to ${C.esc(
      site.siteName
    )} and may not be reproduced, distributed, or modified without appropriate permission, except where permitted by applicable law.</p>

<h2>Limitation of Liability</h2>
<p>To the extent permitted by applicable law, ${C.esc(
      site.siteName
    )} will not be responsible for losses or damages arising from reliance on calculator results, website content, temporary unavailability of the website, or the use of third-party services accessed through the website.</p>

<h2>Changes to These Terms</h2>
<p>These Terms of Service may be updated from time to time. Changes will become effective when the revised terms are published on this page. Your continued use of the website after changes are published constitutes acceptance of the updated terms to the extent permitted by applicable law.</p>

<h2>Contact</h2>
<p>For questions about these Terms of Service, please use the Contact page.</p>`
  });
}

function renderDisclaimer() {
  return legalPage({
    title: `Disclaimer — ${site.siteName}`,
    description: `Important information about the limitations of the calculators on ${site.siteName}.`,
    canonicalPath: "/disclaimer/",
    h1: "Disclaimer",
    bodyHtml: `
<p>The calculators on ${C.esc(
      site.siteName
    )} are for informational and educational purposes only. They are not financial, tax, legal, or investment advice, and results should not be relied on as the sole basis for any financial decision.</p>

<p>Every calculator's page describes the formula it uses and what it does not account for. Real-world outcomes depend on factors these calculators can't know — your credit profile, exact loan terms, tax situation, and market conditions among them.</p>

<p>We do not guarantee the accuracy of any result and are not liable for decisions made based on this site. Consider speaking with a qualified financial professional for advice specific to your situation.</p>`
  });
}


// ---------------------------------------------------------------------
// Directory and category pages
// ---------------------------------------------------------------------
function renderCalculatorsDirectory() {
  const body = `<div class="container calc-page-head">
  <h1>All Financial Calculators</h1>
  <p class="lede">Browse all ${calculators.length} free ClearSum calculators by category.</p>
</div>
<div class="container">
  ${categoriesWithCalcs.map((cat) => `<section class="section" aria-labelledby="dir-${cat.slug}">
    <div class="section__head"><h2 id="dir-${cat.slug}">${C.esc(cat.name)}</h2></div>
    <div class="calc-grid">${cat.calcs.map((calc) => `<a class="calc-card" href="/${calc.slug}/"><span class="calc-card__cat">${C.esc(cat.name)}</span><span class="calc-card__title">${C.esc(calc.h1)}</span><p class="calc-card__desc">${C.esc(calc.lede)}</p></a>`).join("\n")}</div>
  </section>`).join("\n")}
</div>`;
  return C.pageShell({
    title: `All Financial Calculators — ${site.siteName}`,
    description: `Browse all ${calculators.length} free financial calculators from ${site.siteName}.`,
    canonicalPath: "/calculators/",
    bodyHtml: body,
    breadcrumb: [{label:"Home",href:"/"},{label:"All Calculators"}],
    jsonLd: [{
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${site.domain}/calculators/#collection`,
      name: "All Financial Calculators",
      url: `${site.domain}/calculators/`,
      isPartOf: { "@id": `${site.domain}/#website` },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: calculators.length,
        itemListElement: calculators.map((calc, i) => ({
          "@type": "ListItem", position: i + 1, name: calc.h1, item: `${site.domain}/${calc.slug}/`
        }))
      }
    }]
  });
}

function renderCategoryPage(cat) {
  const calcs = categoriesWithCalcs.find((c) => c.slug === cat.slug).calcs;
  const body = `<div class="container calc-page-head">
  <h1>${C.esc(cat.name)} Calculators</h1>
  <p class="lede">${C.esc(cat.desc)} Browse ${calcs.length} free ${C.esc(cat.name.toLowerCase())} calculators from ClearSum.</p>
</div>
<div class="container">
  <div class="calc-grid">${calcs.map((calc) => `<a class="calc-card" href="/${calc.slug}/"><span class="calc-card__cat">${C.esc(cat.name)}</span><span class="calc-card__title">${C.esc(calc.h1)}</span><p class="calc-card__desc">${C.esc(calc.lede)}</p></a>`).join("\n")}</div>
</div>`;
  return C.pageShell({
    title: `${cat.name} Calculators — ${site.siteName}`,
    description: `Free ${cat.name.toLowerCase()} calculators from ${site.siteName}.`,
    canonicalPath: `/category/${cat.slug}/`,
    bodyHtml: body,
    breadcrumb: [{label:"Home",href:"/"},{label:cat.name}],
    jsonLd: [{
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${site.domain}/category/${cat.slug}/#collection`,
      name: `${cat.name} Calculators`,
      url: `${site.domain}/category/${cat.slug}/`,
      isPartOf: { "@id": `${site.domain}/#website` },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: calcs.length,
        itemListElement: calcs.map((calc, i) => ({
          "@type": "ListItem", position: i + 1, name: calc.h1, item: `${site.domain}/${calc.slug}/`
        }))
      }
    }]
  });
}

// ---------------------------------------------------------------------
// Sitemap & robots
// ---------------------------------------------------------------------
function renderSitemap() {
  const staticPaths = [
    "/",
    "/about/",
    "/contact/",
    "/privacy-policy/",
    "/terms-of-service/",
    "/disclaimer/",
    "/calculators/",
    ...site.categories.map((c) => `/category/${c.slug}/`)
  ];

  const calcPaths = calculators.map((c) => `/${c.slug}/`);

  const seoPaths = seoPages.map((page) => `/${page.slug}/`);

  const all = [...staticPaths, ...calcPaths, ...seoPaths];

  const unique = [...new Set(all)];

  const urls = unique
    .map(
      (p) =>
        `  <url>\n    <loc>${site.domain}${p}</loc>\n  </url>`
    )
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
        {
          src: site.logo.androidChrome192,
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: site.logo.androidChrome512,
          sizes: "512x512",
          type: "image/png"
        }
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

    if (entry.isDirectory()) {
      copyDir(src, dest);
    } else {
      fs.copyFileSync(src, dest);
    }
  }
}

function build() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  copyDir(path.join(SRC, "css"), path.join(DIST, "css"));
  copyDir(path.join(SRC, "js"), path.join(DIST, "js"));
  copyDir(path.join(SRC, "assets"), path.join(DIST, "assets"));

  write("index.html", renderHome());
  write("404.html", render404());
  write("calculators/index.html", renderCalculatorsDirectory());
  write("search/index.html", renderSearchPage());
  site.categories.forEach((cat) => write(`category/${cat.slug}/index.html`, renderCategoryPage(cat)));

  calculators.forEach((calc) => {
    write(`${calc.slug}/index.html`, renderCalculatorPage(calc));
  });

  seoPages.forEach((page) => {
    write(`${page.slug}/index.html`, renderSeoPage(page));
  });

  write("about/index.html", renderAbout());
  write("contact/index.html", renderContact());
  write("privacy-policy/index.html", renderPrivacyPolicy());
  write("terms-of-service/index.html", renderTerms());
  write("disclaimer/index.html", renderDisclaimer());

  write("sitemap.xml", renderSitemap());
  write("robots.txt", renderRobots());
  write("site.webmanifest", renderManifest());
  write("ads.txt", "google.com, pub-5422820182709667, DIRECT, f08c47fec0942fa0\n");

  console.log(
    `Built ${calculators.length} calculator pages + ${seoPages.length} SEO pages + 8 static pages + ${site.categories.length} category pages to dist/`
  );
}

build();
