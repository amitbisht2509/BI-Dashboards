/**
 * app.js
 * ---------------------------------------------------------------------------
 * Home page logic for the Dashboard Portal:
 *   - Renders category navigation from dashboards.js
 *   - Renders dashboard cards
 *   - Real-time search (name, description, category)
 *   - Category filtering ("All Dashboards" + one per category)
 *   - Favorites (stored in localStorage)
 *   - Recently Viewed (stored in localStorage, updated by dashboard-viewer.js)
 *   - Mobile navigation drawer
 *   - Loading / empty / error states
 *
 * This file reads its data from the global `dashboards` array defined in
 * dashboards.js. It never needs to be edited to add/remove a dashboard.
 * ---------------------------------------------------------------------------
 */

(function () {
  "use strict";

  // ---------------------------------------------------------------------
  // Storage keys
  // ---------------------------------------------------------------------
  const FAVORITES_KEY = "portal.favorites";
  const RECENTS_KEY = "portal.recents";
  const MAX_RECENTS = 8;

  // ---------------------------------------------------------------------
  // Simple inline icon library (original, hand-drawn SVG paths).
  // Add new keywords here if you want dashboards.js to reference more icons.
  // ---------------------------------------------------------------------
  const ICONS = {
    users: '<path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M14.5 14.2c2.9.4 5.5 2.8 5.5 5.8"/>',
    chart: '<path d="M4 20V10"/><path d="M11 20V4"/><path d="M18 20v-7"/><path d="M2 20h20"/>',
    dollar: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10"/><path d="M9.5 9.5c0-1.4 1.2-2.5 2.7-2.5s2.6.9 2.6 2.1c0 2.8-5.3 1.6-5.3 4.4 0 1.2 1.1 2.1 2.6 2.1s2.7-1.1 2.7-2.5"/>',
    briefcase: '<rect x="2.5" y="7" width="19" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M2.5 13h19"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    trending: '<path d="M3 17l6-6 4 4 7-8"/><path d="M14 7h6v6"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 8h1M12 8h1M16 8h1M8 12h1M12 12h1M16 12h1M8 16h1M12 16h1M16 16h1"/><path d="M10 21v-4h4v4"/>',
    shield: '<path d="M12 2l8 3.5v6c0 5-3.4 8.4-8 10.5-4.6-2.1-8-5.5-8-10.5v-6L12 2Z"/>',
    calendar: '<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9.5h18"/><path d="M8 2.5v4M16 2.5v4"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><rect x="8.5" y="2" width="7" height="4" rx="1"/><path d="M8.5 12h7M8.5 16h7"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9s1.3-6.5 3.8-9Z"/>',
    database: '<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    default: '<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>',
    star: '<path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5-4.8-4.6 6.6-.9 2.9-6Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    "alert-triangle": '<path d="M12 3.5l9.5 16.5H2.5L12 3.5Z"/><path d="M12 10v4"/><path d="M12 17.2v.1"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5 9-5Z"/><path d="M3 13l9 5 9-5"/>',
  };

  function iconSvg(name, extraClass) {
    const path = ICONS[name] || ICONS.default;
    return `<svg class="icon ${extraClass || ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
  }

  // ---------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------
  let activeView = { type: "all" }; // { type: "all" } | { type: "category", value } | { type: "favorites" } | { type: "recent" }
  let searchTerm = "";

  // ---------------------------------------------------------------------
  // localStorage helpers (wrapped in try/catch — localStorage can throw in
  // locked-down browser contexts, e.g. some corporate policies or private
  // browsing modes; the portal should degrade gracefully, not crash).
  // ---------------------------------------------------------------------
  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // Storage unavailable — favorites/recents simply won't persist.
    }
  }

  function getFavorites() {
    return readJSON(FAVORITES_KEY, []);
  }

  function toggleFavorite(id) {
    const favs = getFavorites();
    const idx = favs.indexOf(id);
    if (idx === -1) favs.push(id);
    else favs.splice(idx, 1);
    writeJSON(FAVORITES_KEY, favs);
    render();
  }

  function getRecents() {
    return readJSON(RECENTS_KEY, []); // [{id, ts}]
  }

  // ---------------------------------------------------------------------
  // Data helpers
  // ---------------------------------------------------------------------
  function getDashboards() {
    return Array.isArray(window.dashboards) ? window.dashboards : [];
  }

  function getCategories() {
    const all = getDashboards();
    const set = new Set(all.map((d) => d.category).filter(Boolean));
    return Array.from(set).sort();
  }

  function matchesSearch(d, term) {
    if (!term) return true;
    const t = term.toLowerCase();
    return (
      (d.name || "").toLowerCase().includes(t) ||
      (d.description || "").toLowerCase().includes(t) ||
      (d.category || "").toLowerCase().includes(t)
    );
  }

  function getVisibleDashboards() {
    const all = getDashboards();
    let list = all;

    if (activeView.type === "category") {
      list = list.filter((d) => d.category === activeView.value);
    } else if (activeView.type === "favorites") {
      const favs = getFavorites();
      list = list.filter((d) => favs.includes(d.id));
    } else if (activeView.type === "recent") {
      const recents = getRecents();
      const order = recents.map((r) => r.id);
      list = list
        .filter((d) => order.includes(d.id))
        .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
    }

    return list.filter((d) => matchesSearch(d, searchTerm));
  }

  // ---------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------
  const els = {};

  function cacheEls() {
    els.grid = document.getElementById("dashboardGrid");
    els.emptyState = document.getElementById("emptyState");
    els.loadingState = document.getElementById("loadingState");
    els.errorState = document.getElementById("errorState");
    els.sectionTitle = document.getElementById("sectionTitle");
    els.resultCount = document.getElementById("resultCount");
    els.searchInput = document.getElementById("searchInput");
    els.searchInputMobile = document.getElementById("searchInputMobile");
    els.navList = document.getElementById("navCategoryList");
    els.navListMobile = document.getElementById("navCategoryListMobile");
    els.hamburger = document.getElementById("hamburgerBtn");
    els.drawer = document.getElementById("mobileDrawer");
    els.drawerOverlay = document.getElementById("drawerOverlay");
    els.drawerClose = document.getElementById("drawerCloseBtn");
    els.recentSection = document.getElementById("recentSection");
    els.recentRow = document.getElementById("recentRow");
  }

  function viewLabel() {
    if (activeView.type === "all") return "All Dashboards";
    if (activeView.type === "favorites") return "Favorites";
    if (activeView.type === "recent") return "Recently Viewed";
    return activeView.value;
  }

  function cardTemplate(d, opts) {
    opts = opts || {};
    const favs = getFavorites();
    const isFav = favs.includes(d.id);
    const compact = opts.compact ? " card--compact" : "";
    return `
      <article class="card${compact}" data-id="${d.id}">
        <div class="card__top">
          <div class="card__icon">${iconSvg(d.icon)}</div>
          <button class="card__fav ${isFav ? "is-active" : ""}" data-fav-id="${d.id}" aria-pressed="${isFav}" title="${isFav ? "Remove from favorites" : "Add to favorites"}">
            ${iconSvg("star")}
          </button>
        </div>
        <h3 class="card__title">${escapeHtml(d.name)}</h3>
        <p class="card__desc">${escapeHtml(d.description)}</p>
        <span class="card__category">${escapeHtml(d.category)}</span>
        <a class="card__button" href="dashboard.html?id=${encodeURIComponent(d.id)}">
          Open Dashboard
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>
        </a>
      </article>`;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function renderNav() {
    const categories = getCategories();
    const favCount = getFavorites().length;

    const staticItems = [
      { type: "all", label: "All Dashboards", icon: "layers" },
      { type: "favorites", label: "Favorites", icon: "star", badge: favCount },
      { type: "recent", label: "Recently Viewed", icon: "clock" },
    ];

    function itemHtml(item) {
      const isActive =
        (item.type === activeView.type && item.type !== "category") ||
        (item.type === "category" && activeView.type === "category" && activeView.value === item.value);
      return `
        <button class="nav__item ${isActive ? "is-active" : ""}" data-nav-type="${item.type}" data-nav-value="${item.value || ""}">
          ${iconSvg(item.icon || "default")}
          <span>${escapeHtml(item.label)}</span>
          ${item.badge ? `<span class="nav__badge">${item.badge}</span>` : ""}
        </button>`;
    }

    const categoryItems = categories.map((c) => ({ type: "category", value: c, label: c, icon: "default" }));
    const html = staticItems.map(itemHtml).join("") +
      `<div class="nav__divider"><span>Categories</span></div>` +
      (categoryItems.length
        ? categoryItems.map(itemHtml).join("")
        : `<p class="nav__empty">No categories yet</p>`);

    if (els.navList) els.navList.innerHTML = html;
    if (els.navListMobile) els.navListMobile.innerHTML = html;
  }

  function renderRecentRow() {
    const recents = getRecents();
    const all = getDashboards();
    const order = recents.map((r) => r.id);
    const items = all
      .filter((d) => order.includes(d.id))
      .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
      .slice(0, 6);

    if (!els.recentSection) return;

    if (activeView.type !== "all" || !items.length) {
      els.recentSection.hidden = true;
      return;
    }
    els.recentSection.hidden = false;
    els.recentRow.innerHTML = items.map((d) => cardTemplate(d, { compact: true })).join("");
  }

  function render() {
    renderNav();
    renderRecentRow();

    const list = getVisibleDashboards();

    if (els.sectionTitle) els.sectionTitle.textContent = viewLabel();
    if (els.resultCount) {
      els.resultCount.textContent = `${list.length} dashboard${list.length === 1 ? "" : "s"}`;
    }

    if (!els.grid) return;

    if (!list.length) {
      els.grid.innerHTML = "";
      els.emptyState.hidden = false;
      els.emptyState.querySelector("[data-empty-message]").textContent = emptyMessage();
    } else {
      els.emptyState.hidden = true;
      els.grid.innerHTML = list.map((d) => cardTemplate(d)).join("");
    }

    attachCardEvents();
  }

  function emptyMessage() {
    if (getDashboards().length === 0) {
      return "No dashboards have been configured yet. Add one in js/dashboards.js to get started.";
    }
    if (activeView.type === "favorites") {
      return "You haven't favorited any dashboards yet. Click the star on a dashboard card to add it here.";
    }
    if (activeView.type === "recent") {
      return "You haven't opened any dashboards yet. Recently viewed dashboards will appear here.";
    }
    if (searchTerm) {
      return `No dashboards match "${searchTerm}".`;
    }
    return "No dashboards match the current filter.";
  }

  function attachCardEvents() {
    document.querySelectorAll("[data-fav-id]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const id = normalizeId(btn.getAttribute("data-fav-id"));
        toggleFavorite(id);
      });
    });
  }

  function normalizeId(rawId) {
    const asNum = Number(rawId);
    return Number.isNaN(asNum) ? rawId : asNum;
  }

  // ---------------------------------------------------------------------
  // Event wiring
  // ---------------------------------------------------------------------
  function setActiveView(view) {
    activeView = view;
    closeDrawer();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function wireNavClicks(container) {
    if (!container) return;
    container.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-nav-type]");
      if (!btn) return;
      const type = btn.getAttribute("data-nav-type");
      const value = btn.getAttribute("data-nav-value");
      setActiveView(type === "category" ? { type, value } : { type });
    });
  }

  function wireSearch(input) {
    if (!input) return;
    input.addEventListener("input", (e) => {
      searchTerm = e.target.value.trim();
      syncSearchInputs(searchTerm);
      render();
    });
  }

  function syncSearchInputs(value) {
    if (els.searchInput && els.searchInput.value !== value) els.searchInput.value = value;
    if (els.searchInputMobile && els.searchInputMobile.value !== value) els.searchInputMobile.value = value;
  }

  function openDrawer() {
    if (!els.drawer) return;
    els.drawer.classList.add("is-open");
    els.drawerOverlay.hidden = false;
    requestAnimationFrame(() => els.drawerOverlay.classList.add("is-visible"));
    document.body.classList.add("no-scroll");
  }

  function closeDrawer() {
    if (!els.drawer) return;
    els.drawer.classList.remove("is-open");
    els.drawerOverlay.classList.remove("is-visible");
    document.body.classList.remove("no-scroll");
    setTimeout(() => {
      if (!els.drawer.classList.contains("is-open")) els.drawerOverlay.hidden = true;
    }, 250);
  }

  function wireMobileNav() {
    if (els.hamburger) els.hamburger.addEventListener("click", openDrawer);
    if (els.drawerClose) els.drawerClose.addEventListener("click", closeDrawer);
    if (els.drawerOverlay) els.drawerOverlay.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
    });
  }

  // ---------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------
  function init() {
    cacheEls();

    try {
      if (!Array.isArray(window.dashboards)) {
        throw new Error("dashboards.js did not define a `dashboards` array.");
      }
      wireNavClicks(els.navList);
      wireNavClicks(els.navListMobile);
      wireSearch(els.searchInput);
      wireSearch(els.searchInputMobile);
      wireMobileNav();

      // Brief, honest loading state: gives the skeleton a moment to show and
      // guards the UI in case dashboards.js is ever swapped for something
      // slower (e.g. a future fetch()-based config) without other changes.
      if (els.loadingState) els.loadingState.hidden = false;
      if (els.grid) els.grid.hidden = true;

      setTimeout(() => {
        if (els.loadingState) els.loadingState.hidden = true;
        if (els.grid) els.grid.hidden = false;
        render();
      }, 250);
    } catch (err) {
      console.error(err);
      if (els.loadingState) els.loadingState.hidden = true;
      if (els.errorState) {
        els.errorState.hidden = false;
        const msgEl = els.errorState.querySelector("[data-error-message]");
        if (msgEl) msgEl.textContent = err.message;
      }
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
