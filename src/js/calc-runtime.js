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

  // Renders the optional "insight scale" — a visual low-to-high gauge that
  // places the result in context. `scale` (when provided by a calculator's
  // compute() function) has the shape:
  //   {
  //     label: "Interest paid vs. balance",
  //     min: 0, max: 100, value: 37,           // value clamped into [min,max]
  //     valueDisplay: "37%",
  //     lowLabel: "Low", highLabel: "High",
  //     interpretation: "Human-readable sentence explaining the result.",
  //     kind: "computed" | "guideline",         // computed = pure math from your inputs;
  //                                              // guideline = based on a named financial rule of thumb
  //     source: "Optional citation for the guideline, e.g. 'CFPB — 28% front-end DTI guideline'"
  //   }
  function renderScale(root, scale) {
    var box = $("[data-insight-scale]", root);
    if (!box) return;
    if (!scale || typeof scale.value !== "number" || !isFinite(scale.value)) {
      box.setAttribute("data-active", "false");
      return;
    }
    var min = typeof scale.min === "number" ? scale.min : 0;
    var max = typeof scale.max === "number" ? scale.max : 100;
    var clamped = Math.min(Math.max(scale.value, min), max);
    var pct = max > min ? ((clamped - min) / (max - min)) * 100 : 0;

    var labelEl = $("[data-scale-label]", box);
    var badgeHtml = scale.kind === "guideline"
      ? '<span class="insight-scale__badge insight-scale__badge--guideline">Guideline</span>'
      : '<span class="insight-scale__badge insight-scale__badge--computed">Computed</span>';
    if (labelEl) labelEl.innerHTML = escapeHtml(scale.label || "") + badgeHtml;

    var valueEl = $("[data-scale-value]", box);
    if (valueEl) valueEl.textContent = scale.valueDisplay || String(scale.value);

    var marker = $("[data-scale-marker]", box);
    if (marker) marker.style.left = pct + "%";

    var lowTick = $("[data-scale-tick-low]", box);
    if (lowTick) lowTick.textContent = scale.lowLabel || "Low";
    var highTick = $("[data-scale-tick-high]", box);
    if (highTick) highTick.textContent = scale.highLabel || "High";

    var interp = $("[data-scale-interpretation]", box);
    if (interp) interp.textContent = scale.interpretation || "";

    var sourceEl = $("[data-scale-source]", box);
    if (sourceEl) sourceEl.textContent = scale.source || "";
    if (sourceEl) sourceEl.style.display = scale.source ? "" : "none";

    box.setAttribute("data-active", "true");
  }

  var CHART_COLORS = ["#12A48C", "#2C6CB0", "#C77A4A", "#6E5DC6"];

  // Renders an optional line chart — pure inline SVG, no dependencies.
  // `chart` (from a calculator's compute() result) has the shape:
  //   {
  //     title: "Balance over time",
  //     labels: ["Yr 0", "Yr 5", ...],        // x-axis tick labels, one per data point
  //     series: [ { name: "Balance", data: [n, n, ...] } ],
  //     referenceLine: { value: n, label: "Goal" }   // optional horizontal dashed line
  //   }
  function renderChart(root, chart) {
    var box = $("[data-result-chart]", root);
    if (!box) return;
    if (!chart || !chart.series || !chart.series.length || !chart.labels || chart.labels.length < 2) {
      box.setAttribute("data-active", "false");
      box.innerHTML = "";
      return;
    }

    var W = 600, H = 220, padL = 44, padR = 12, padT = 10, padB = 22;
    var plotW = W - padL - padR;
    var plotH = H - padT - padB;
    var n = chart.labels.length;

    var allValues = [];
    chart.series.forEach(function (s) { allValues = allValues.concat(s.data); });
    if (chart.referenceLine) allValues.push(chart.referenceLine.value);
    var maxV = Math.max.apply(null, allValues.concat([0]));
    var minV = Math.min.apply(null, allValues.concat([0]));
    if (maxV === minV) maxV = minV + 1;

    function x(i) { return padL + (n === 1 ? 0 : (i / (n - 1)) * plotW); }
    function y(v) { return padT + plotH - ((v - minV) / (maxV - minV)) * plotH; }

    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + escapeHtml(chart.title || "Chart") + '">';

    // gridlines + y ticks (4 bands)
    var bands = 4;
    for (var b = 0; b <= bands; b++) {
      var v = minV + ((maxV - minV) * b) / bands;
      var gy = y(v);
      svg += '<line class="result-chart__gridline" x1="' + padL + '" x2="' + (W - padR) + '" y1="' + gy + '" y2="' + gy + '"></line>';
      svg += '<text class="result-chart__tick" x="2" y="' + (gy + 3) + '">' + escapeHtml(compactNumber(v)) + "</text>";
    }
    svg += '<line class="result-chart__axis-line" x1="' + padL + '" x2="' + padL + '" y1="' + padT + '" y2="' + (H - padB) + '"></line>';
    svg += '<line class="result-chart__axis-line" x1="' + padL + '" x2="' + (W - padR) + '" y1="' + (H - padB) + '" y2="' + (H - padB) + '"></line>';

    // x ticks — show at most ~6 to avoid crowding
    var xStep = Math.max(1, Math.ceil(n / 6));
    for (var i = 0; i < n; i += xStep) {
      svg += '<text class="result-chart__tick" text-anchor="middle" x="' + x(i) + '" y="' + (H - padB + 13) + '">' + escapeHtml(chart.labels[i]) + "</text>";
    }
    // always show the last label
    if ((n - 1) % xStep !== 0) {
      svg += '<text class="result-chart__tick" text-anchor="middle" x="' + x(n - 1) + '" y="' + (H - padB + 13) + '">' + escapeHtml(chart.labels[n - 1]) + "</text>";
    }

    if (chart.referenceLine) {
      var ry = y(chart.referenceLine.value);
      svg += '<line class="result-chart__ref-line" x1="' + padL + '" x2="' + (W - padR) + '" y1="' + ry + '" y2="' + ry + '"></line>';
      svg += '<text class="result-chart__ref-label" x="' + (W - padR) + '" y="' + (ry - 4) + '" text-anchor="end">' + escapeHtml(chart.referenceLine.label || "") + "</text>";
    }

    chart.series.forEach(function (s, si) {
      var color = s.color || CHART_COLORS[si % CHART_COLORS.length];
      var d = "";
      s.data.forEach(function (v, i) {
        d += (i === 0 ? "M" : "L") + x(i).toFixed(1) + "," + y(v).toFixed(1) + " ";
      });
      svg += '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"></path>';
    });

    svg += "</svg>";

    var legend = chart.series.length > 1 ? ('<div class="result-chart__legend">' +
      chart.series.map(function (s, si) {
        var color = s.color || CHART_COLORS[si % CHART_COLORS.length];
        return '<span class="result-chart__legend-item"><span class="result-chart__swatch" style="background:' + color + '"></span>' + escapeHtml(s.name) + "</span>";
      }).join("") + "</div>") : "";

    var title = chart.title ? '<div class="result-chart__title">' + escapeHtml(chart.title) + "</div>" : "";
    box.innerHTML = title + svg + legend;
    box.setAttribute("data-active", "true");
  }

  function compactNumber(v) {
    var abs = Math.abs(v);
    if (abs >= 1000000) return (v / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (abs >= 1000) return (v / 1000).toFixed(0) + "k";
    return String(Math.round(v));
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

    $all("input:not([type=range]), select", form).forEach(function (input) {
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
        renderScale(root, null);
        renderChart(root, null);
        return;
      }

      if (typeof window.CalcCompute !== "function") {
        renderErrorTape(tape, "This calculator isn't available right now. Please try again later.");
        renderScale(root, null);
        renderChart(root, null);
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
        renderScale(root, null);
        renderChart(root, null);
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

      renderScale(root, result.scale);

      renderChart(root, result.chart);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      runValidationAndMaybeCompute();
    });

    $all("input:not([type=range]), select", form).forEach(function (input) {
      input.addEventListener("blur", function () {
        var field = input.closest(".field");
        setFieldError(field, validateField(input));
      });
    });

    // Sliders: keep the paired number input in sync in both directions,
    // and recompute live as the slider is dragged (no need to press
    // Calculate) — this is the one interaction where instant feedback
    // clearly helps; plain typed inputs still use the Calculate button.
    $all(".field-slider", form).forEach(function (slider) {
      var targetId = slider.getAttribute("data-slider-for");
      var numberInput = form.querySelector('[name="' + targetId + '"]');
      if (!numberInput) return;
      slider.addEventListener("input", function () {
        numberInput.value = slider.value;
        setFieldError(numberInput.closest(".field"), validateField(numberInput));
        runValidationAndMaybeCompute();
      });
      numberInput.addEventListener("input", function () {
        var num = Number(numberInput.value);
        if (isFinite(num)) slider.value = num;
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        $all("input:not([type=range]), select", form).forEach(function (input) {
          input.value = defaults[input.name];
          setFieldError(input.closest(".field"), null);
        });
        $all(".field-slider", form).forEach(function (slider) {
          var targetId = slider.getAttribute("data-slider-for");
          var numberInput = form.querySelector('[name="' + targetId + '"]');
          if (numberInput) slider.value = numberInput.value;
        });
        renderEmptyTape(tape);
        var noteEl = $("[data-result-note]", root);
        if (noteEl) noteEl.textContent = "";
        renderScale(root, null);
        renderChart(root, null);
        form.querySelector("input, select").focus();
      });
    }

    renderEmptyTape(tape);
    renderScale(root, null);
    renderChart(root, null);
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
