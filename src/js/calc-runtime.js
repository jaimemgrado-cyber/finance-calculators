/*
 * calc-runtime.js
 * Shared across every calculator page. Presentation/validation only —
 * each calculator supplies its own pure `window.CalcCompute(values)`
 * function (loaded from /js/calculators/<slug>.js), so the math is
 * separated from the UI and independently testable in Node.
 */
(function () {
  "use strict";

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  var currencyFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
  var currencyFmtWhole = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  var numberFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
  var percentFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2, style: "percent" });

  window.ClearSumFormat = {
    currency: function (n) { return currencyFmt.format(n); },
    currencyWhole: function (n) { return currencyFmtWhole.format(n); },
    number: function (n) { return numberFmt.format(n); },
    percent: function (n) { return percentFmt.format(n / 100); }
  };

  function isBlank(v) { return v === null || v === undefined || String(v).trim() === ""; }

  function validateField(control) {
    if (control.tagName === "SELECT") return null;
    var raw = control.value;
    var min = control.hasAttribute("min") ? parseFloat(control.min) : null;
    var max = control.hasAttribute("max") ? parseFloat(control.max) : null;

    if (isBlank(raw)) {
      return "Enter a value.";
    }
    var num = Number(raw);
    if (!isFinite(num) || isNaN(num)) {
      return "Enter a valid number.";
    }
    if (min !== null && num < min) {
      return min === 0 ? "Must be 0 or greater." : "Must be at least " + min + ".";
    }
    if (max !== null && num > max) {
      return "That's larger than this calculator supports (max " + numberFmt.format(max) + ").";
    }
    return null;
  }

  function setFieldError(field, message) {
    var control = field.querySelector("input, select");
    var errorEl = $(".field-error", field);
    if (message) {
      control.setAttribute("aria-invalid", "true");
      errorEl.textContent = message;
    } else {
      control.removeAttribute("aria-invalid");
      errorEl.textContent = "";
    }
  }

  function renderEmptyTape(tape) {
    tape.innerHTML = '<p class="tape-empty">Fill in the fields and select Calculate to see your results here.</p>';
  }

  function renderErrorTape(tape, message) {
    tape.innerHTML = '<p class="tape-empty" role="alert">' + escapeHtml(message) + "</p>";
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function renderTape(tape, rows) {
    var html = "";
    rows.forEach(function (row) {
      var rowClass = row.isTotal ? "tape__row tape__row--total" : "tape__row";
      var labelClass = row.isTotal ? "tape__label tape__label--total" : "tape__label";
      var valueClass = row.isTotal ? "tape__value tape__value--total" : "tape__value";
      html += '<div class="' + rowClass + '">' +
        '<span class="' + labelClass + '">' + escapeHtml(row.label) + "</span>" +
        '<span class="' + valueClass + '">' + escapeHtml(row.value) + "</span>" +
        "</div>";
    });
    tape.innerHTML = html;
  }

  function initCalculator(root) {
    var form = $("#calculator-form", root);
    if (!form) return;
    var tape = $("[data-tape]", root);
    var resetBtn = $("[data-reset]", root);
    var defaults = {};

    $all("input, select", form).forEach(function (input) {
      defaults[input.name] = input.value;
    });

    function runValidationAndMaybeCompute() {
      var values = {};
      var hasError = false;

      $all(".field", form).forEach(function (field) {
        var control = field.querySelector("input, select");
        var message = validateField(control);
        setFieldError(field, message);
        if (message) hasError = true;
        values[control.name] = control.tagName === "SELECT" ? control.value : Number(control.value);
      });

      if (hasError) {
        renderEmptyTape(tape);
        return;
      }

      if (typeof window.CalcCompute !== "function") {
        renderErrorTape(tape, "This calculator isn't available right now. Please try again later.");
        return;
      }

      var result;
      try {
        result = window.CalcCompute(values);
      } catch (e) {
        result = { error: "We couldn't calculate a result with these values. Double-check your inputs." };
      }

      if (!result || result.error) {
        renderErrorTape(tape, (result && result.error) || "We couldn't calculate a result with these values.");
        return;
      }

      var safeRows = (result.rows || []).map(function (row) {
        var v = row.rawValue;
        if (typeof v === "number" && (!isFinite(v) || isNaN(v))) {
          return { label: row.label, value: "\u2014", isTotal: row.isTotal };
        }
        return row;
      });

      renderTape(tape, safeRows);

      if (result.note) {
        var noteEl = $("[data-result-note]", root);
        if (noteEl) noteEl.textContent = result.note;
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      runValidationAndMaybeCompute();
    });

    $all("input, select", form).forEach(function (input) {
      input.addEventListener("blur", function () {
        var field = input.closest(".field");
        setFieldError(field, validateField(input));
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        $all("input, select", form).forEach(function (input) {
          input.value = defaults[input.name];
          setFieldError(input.closest(".field"), null);
        });
        renderEmptyTape(tape);
        var noteEl = $("[data-result-note]", root);
        if (noteEl) noteEl.textContent = "";
        form.querySelector("input, select").focus();
      });
    }

    renderEmptyTape(tape);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.querySelector("[data-calculator-root]");
    if (root) initCalculator(root);

    // Mobile nav toggle
    var toggle = document.querySelector(".nav-toggle");
    var header = document.querySelector(".site-header");
    if (toggle && header) {
      toggle.addEventListener("click", function () {
        var isOpen = header.classList.toggle("site-header--open");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });
    }

    // Directory / calculator search filter (home page)
    var searchInput = document.querySelector("[data-calc-search]");
    if (searchInput) {
      var cards = $all("[data-searchable]");
      var empty = document.querySelector("[data-search-empty]");
      searchInput.addEventListener("input", function () {
        var q = searchInput.value.trim().toLowerCase();
        var visibleCount = 0;
        cards.forEach(function (card) {
          var text = card.getAttribute("data-searchable").toLowerCase();
          var match = text.indexOf(q) !== -1;
          card.style.display = match ? "" : "none";
          if (match) visibleCount++;
        });
        if (empty) empty.style.display = q && visibleCount === 0 ? "block" : "none";
      });
    }
  });
})();
