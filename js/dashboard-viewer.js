/**
 * dashboard-viewer.js
 * ---------------------------------------------------------------------------
 * Logic for dashboard.html — the dedicated viewer page.
 *
 * Reads the dashboard id from the URL (dashboard.html?id=3), looks it up in
 * the global `dashboards` array (js/dashboards.js), and:
 *   - Attempts to embed the report in an iframe.
 *   - Shows a loading indicator while it loads.
 *   - Falls back to a friendly "open in new tab" message if the report
 *     doesn't finish loading in time (most commonly because Power BI or the
 *     browser blocked iframe embedding — see the security note below).
 *   - Provides Fullscreen, Open in New Tab, and Back to Dashboards controls.
 *   - Records the dashboard in localStorage as "recently viewed".
 *
 * ---------------------------------------------------------------------------
 * SECURITY NOTE
 * ---------------------------------------------------------------------------
 * This page does not perform, bypass, or interact with Power BI sign-in in
 * any way. Whatever authentication and Row-Level Security a report requires,
 * Power BI itself enforces at the URL configured in js/dashboards.js — this
 * viewer is just an iframe (or new-tab link) pointed at that URL. See
 * README.md for guidance on which embedding approach is appropriate for
 * confidential data.
 * ---------------------------------------------------------------------------
 */

(function () {
  "use strict";

  const RECENTS_KEY = "portal.recents";
  const MAX_RECENTS = 8;
  const EMBED_TIMEOUT_MS = 9000;

  const els = {};

  function cacheEls() {
    els.title = document.getElementById("viewerTitle");
    els.category = document.getElementById("viewerCategory");
    els.frame = document.getElementById("dashboardFrame");
    els.frameWrap = document.getElementById("frameWrap");
    els.loading = document.getElementById("viewerLoading");
    els.fallback = document.getElementById("viewerFallback");
    els.fallbackLink = document.getElementById("fallbackOpenLink");
    els.notFound = document.getElementById("viewerNotFound");
    els.openNewTabBtn = document.getElementById("openNewTabBtn");
    els.fullscreenBtn = document.getElementById("fullscreenBtn");
    els.backBtn = document.getElementById("backBtn");
    els.main = document.getElementById("viewerMain");
  }

  function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("id");
    if (raw === null) return null;
    const asNum = Number(raw);
    return Number.isNaN(asNum) ? raw : asNum;
  }

  function findDashboard(id) {
    const all = Array.isArray(window.dashboards) ? window.dashboards : [];
    return all.find((d) => String(d.id) === String(id));
  }

  function addToRecents(id) {
    let recents = [];
    try {
      recents = JSON.parse(localStorage.getItem(RECENTS_KEY)) || [];
    } catch (e) {
      recents = [];
    }
    recents = recents.filter((r) => String(r.id) !== String(id));
    recents.unshift({ id, ts: Date.now() });
    recents = recents.slice(0, MAX_RECENTS);
    try {
      localStorage.setItem(RECENTS_KEY, JSON.stringify(recents));
    } catch (e) {
      // localStorage unavailable — recents just won't persist this session.
    }
  }

  function showNotFound() {
    if (els.loading) els.loading.hidden = true;
    if (els.frameWrap) els.frameWrap.hidden = true;
    if (els.notFound) els.notFound.hidden = false;
    document.title = "Dashboard not found — Dashboard Portal";
  }

  function showFallback(url) {
    if (els.loading) els.loading.hidden = true;
    if (els.frameWrap) els.frameWrap.hidden = true;
    if (els.fallback) els.fallback.hidden = false;
    if (els.fallbackLink) els.fallbackLink.href = url;
  }

  function showFrame() {
    if (els.loading) els.loading.hidden = true;
    if (els.frameWrap) els.frameWrap.hidden = false;
  }

  function initFullscreen() {
    if (!els.fullscreenBtn || !els.frameWrap) return;
    els.fullscreenBtn.addEventListener("click", () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (els.frameWrap.requestFullscreen) {
        els.frameWrap.requestFullscreen();
      }
    });
    document.addEventListener("fullscreenchange", () => {
      els.frameWrap.classList.toggle("is-fullscreen", !!document.fullscreenElement);
    });
  }

  function init() {
    cacheEls();

    const id = getIdFromUrl();
    const dashboard = id === null ? null : findDashboard(id);

    if (!dashboard) {
      showNotFound();
      return;
    }

    document.title = `${dashboard.name} — Dashboard Portal`;
    if (els.title) els.title.textContent = dashboard.name;
    if (els.category) els.category.textContent = dashboard.category;

    if (els.backBtn) {
      els.backBtn.addEventListener("click", () => {
        window.location.href = "index.html";
      });
    }
    if (els.openNewTabBtn) {
      els.openNewTabBtn.addEventListener("click", () => {
        window.open(dashboard.url, "_blank", "noopener,noreferrer");
      });
    }
    initFullscreen();

    addToRecents(dashboard.id);

    // An explicit `embeddable: false` in dashboards.js skips the iframe
    // attempt entirely for reports the admin already knows block embedding.
    if (dashboard.embeddable === false || !dashboard.url || dashboard.url.includes("YOUR_REPORT_ID_HERE")) {
      showFallback(dashboard.url || "#");
      if (!dashboard.url || dashboard.url.includes("YOUR_REPORT_ID_HERE")) {
        const msg = els.fallback && els.fallback.querySelector("[data-fallback-message]");
        if (msg) msg.textContent = "This dashboard link hasn't been configured yet. Update the \"url\" field in js/dashboards.js.";
      }
      return;
    }

    let settled = false;
    const timeoutId = setTimeout(() => {
      if (settled) return;
      settled = true;
      showFallback(dashboard.url);
    }, EMBED_TIMEOUT_MS);

    els.frame.addEventListener("load", () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      showFrame();
    });

    els.frame.addEventListener("error", () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      showFallback(dashboard.url);
    });

    els.frame.src = dashboard.url;
  }

  document.addEventListener("DOMContentLoaded", init);
})();
