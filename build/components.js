const fs = require("fs");
const path = require("path");
const site = require("./site-data.js");

// Read the master logo mark once at build time — this is the single place
// the header's inline SVG comes from. Edit src/assets/logo-mark.svg to
// change the mark everywhere it appears inline.
const LOGO_MARK_SVG = fs.readFileSync(
  path.join(__dirname, "..", "src", "assets", site.logo.logoMarkFile),
  "utf8"
);

function esc(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function pageShell({ title, description, canonicalPath, bodyHtml, activePath, breadcrumb, jsonLd, extraScripts }) {
  const canonical = site.domain + canonicalPath;
  const desc = description || site.description;
  const ogImage = site.domain + site.logo.ogImage;
  const jsonLdBlock = jsonLd
    ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd])
        .filter(Boolean)
        .map((obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`)
        .join("\n")
    : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="google-site-verification" content="5uhdB1e1ufSh3UdBy8zC56w5zHmp941j2htDhl9l2GM">
<meta name="google-adsense-account" content="ca-pub-5422820182709667">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:site_name" content="${esc(site.siteName)}">
<meta property="og:image" content="${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${ogImage}">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="${site.themeColor}">
<link rel="icon" href="${site.logo.faviconSvg}" type="image/svg+xml">
<link rel="alternate icon" href="${site.logo.faviconIco}">
<link rel="icon" sizes="32x32" href="${site.logo.favicon32}">
<link rel="icon" sizes="16x16" href="${site.logo.favicon16}">
<link rel="apple-touch-icon" href="${site.logo.appleTouchIcon}">
<link rel="manifest" href="${site.logo.manifest}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/styles.css">
${jsonLdBlock}
</head>
<body>
<a class="skip-link" href="#main">Skip to main content</a>
${renderHeader(activePath)}
<main id="main">
${breadcrumb ? renderBreadcrumb(breadcrumb) : ""}
${bodyHtml}
</main>
${renderFooter()}
<script src="/js/calc-runtime.js"></script>
${(extraScripts || []).map((s) => `<script src="${s}"></script>`).join("\n")}
</body>
</html>`;
}

function renderHeader() {
  return `<header class="site-header">
  <div class="container site-header__bar">
    <a class="brand" href="/">
      <span class="brand__mark" aria-hidden="true">${LOGO_MARK_SVG}</span>${esc(site.siteName)}
    </a>
    <button class="nav-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Toggle menu">&#9776;</button>
    <nav class="main-nav" id="main-nav" aria-label="Primary">
      ${site.categories.map((c) => `<a href="/#${c.slug}">${esc(c.name)}</a>`).join("\n      ")}
      <a href="/about/">About</a>
    </nav>
  </div>
</header>`;
}

function renderFooter() {
  const col1 = site.categories.slice(0, 3);
  const col2 = site.categories.slice(3, 6);
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <h4>${esc(site.siteName)}</h4>
        <p>Free, ad-supported financial calculators for U.S. households. Estimates only — not financial, tax, or legal advice.</p>
      </div>
      <div>
        <h4>Categories</h4>
        <ul>${col1.map((c) => `<li><a href="/#${c.slug}">${esc(c.name)}</a></li>`).join("")}</ul>
      </div>
      <div>
        <h4>&nbsp;</h4>
        <ul>${col2.map((c) => `<li><a href="/#${c.slug}">${esc(c.name)}</a></li>`).join("")}</ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="/about/">About</a></li>
          <li><a href="/contact/">Contact</a></li>
          <li><a href="/privacy-policy/">Privacy Policy</a></li>
          <li><a href="/terms-of-service/">Terms of Service</a></li>
          <li><a href="/disclaimer/">Disclaimer</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; ${new Date().getFullYear()} ${esc(site.siteName)}. All rights reserved.</span>
      <span>Estimates for informational purposes only.</span>
    </div>
  </div>
</footer>`;
}

function renderBreadcrumb(items) {
  const parts = items
    .map((item, i) => {
      const isLast = i === items.length - 1;
      const inner = isLast || !item.href ? esc(item.label) : `<a href="${item.href}">${esc(item.label)}</a>`;
      const sep = isLast ? "" : '<span aria-hidden="true">/</span>';
      return inner + sep;
    })
    .join(" ");
  return `<nav class="container breadcrumb" aria-label="Breadcrumb">${parts}</nav>`;
}

function renderField(f) {
  if (f.type === "select") {
    const opts = f.options
      .map((o) => `<option value="${esc(o.value)}"${o.value === f.default ? " selected" : ""}>${esc(o.label)}</option>`)
      .join("\n      ");
    return `<div class="field">
  <label for="${f.id}">${esc(f.label)}</label>
  ${f.hint ? `<span class="hint">${esc(f.hint)}</span>` : ""}
  <select id="${f.id}" name="${f.id}" data-type="select">
      ${opts}
  </select>
  <span class="field-error" id="${f.id}-error" role="status"></span>
</div>`;
  }
  const prefix = f.prefix ? `<span class="affix">${esc(f.prefix)}</span>` : "";
  const suffix = f.suffix ? `<span class="affix affix--suffix">${esc(f.suffix)}</span>` : "";
  const inputClass = f.suffix ? "has-suffix" : "";
  const sliderHtml = f.slider && f.max !== undefined
    ? `<input type="range" class="field-slider" id="${f.id}-slider" data-slider-for="${f.id}" min="${f.min}" max="${f.max}" step="${f.step || 1}" value="${f.default}" aria-label="${esc(f.label)} (slider)">`
    : "";
  return `<div class="field${f.slider ? " field--slider" : ""}">
  <label for="${f.id}">${esc(f.label)}</label>
  ${f.hint ? `<span class="hint">${esc(f.hint)}</span>` : ""}
  <div class="field-input-wrap">
    ${prefix}
    <input
      type="number"
      id="${f.id}"
      name="${f.id}"
      class="${inputClass}"
      value="${f.default}"
      min="${f.min}"
      ${f.max !== undefined ? `max="${f.max}"` : ""}
      step="${f.step || "any"}"
      inputmode="decimal"
      aria-describedby="${f.id}-error"
      required>
    ${suffix}
  </div>
  ${sliderHtml}
  <span class="field-error" id="${f.id}-error" role="status"></span>
</div>`;
}

function renderCalculator(calc) {
  return `<div class="calculator" data-calculator-root>
  <h2>Calculator</h2>
  <form id="calculator-form" novalidate>
    <div class="field-grid">
      ${calc.fields.map(renderField).join("\n      ")}
    </div>
    <div class="calc-actions">
      <button type="submit" class="btn btn-primary">Calculate</button>
      <button type="button" class="btn btn-secondary" data-reset>Reset</button>
    </div>
  </form>
  <div class="tape" data-tape aria-live="polite"></div>
  <p class="result-note" data-result-note></p>
  <div class="insight-scale" data-insight-scale aria-live="polite">
    <div class="insight-scale__head">
      <span class="insight-scale__label" data-scale-label></span>
      <span class="insight-scale__value" data-scale-value></span>
    </div>
    <div class="insight-scale__track">
      <div class="insight-scale__marker" data-scale-marker></div>
    </div>
    <div class="insight-scale__ticks">
      <span data-scale-tick-low></span>
      <span data-scale-tick-high></span>
    </div>
    <p class="insight-scale__interpretation" data-scale-interpretation></p>
    <p class="insight-scale__source" data-scale-source></p>
  </div>
  <div class="result-chart" data-result-chart></div>
</div>`;
}

function renderAdSlot(variant, label) {
  const cls = variant ? `ad-slot ad-slot--${variant}` : "ad-slot";
  return `<div class="${cls}" aria-hidden="true">${label || "Ad space"}</div>`;
}

function renderSidebar(calc, calculatorsBySlug) {
  const related = (calc.related || [])
    .map((slug) => calculatorsBySlug[slug])
    .filter(Boolean);
  return `<aside class="sidebar">
  ${renderAdSlot("sidebar", "Ad space")}
  ${related.length ? `<div class="related-box">
    <h3>Related calculators</h3>
    <ul>
      ${related.map((r) => `<li><a href="/${r.slug}/">${esc(r.title)}</a></li>`).join("\n      ")}
    </ul>
  </div>` : ""}
</aside>`;
}

function renderFAQ(faq) {
  if (!faq || !faq.length) return "";
  return `<h2>Frequently Asked Questions</h2>
<div>
${faq.map((f) => `  <details class="faq-item">
    <summary>${esc(f.q)}</summary>
    <p>${f.a}</p>
  </details>`).join("\n")}
</div>`;
}

function faqJsonLd(faq) {
  if (!faq || !faq.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.aPlain || f.a.replace(/<[^>]+>/g, "") }
    }))
  };
}

// Builds BreadcrumbList structured data from the same `breadcrumb` array
// already used to render the visible breadcrumb nav, so the two never
// drift out of sync.
function breadcrumbJsonLd(breadcrumb) {
  if (!breadcrumb || breadcrumb.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: item.href ? site.domain + item.href : undefined
    }))
  };
}

module.exports = {
  esc,
  pageShell,
  renderHeader,
  renderFooter,
  renderBreadcrumb,
  renderField,
  renderCalculator,
  renderAdSlot,
  renderSidebar,
  renderFAQ,
  faqJsonLd,
  breadcrumbJsonLd,
  site
};
