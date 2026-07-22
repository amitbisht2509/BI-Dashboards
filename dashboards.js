/* ===========================================================================
   style.css — Dashboard Portal
   ---------------------------------------------------------------------------
   All colors, spacing, and branding live in the CSS variables at the top of
   this file (":root"). To rebrand the portal, you generally only need to
   change the values in that block — see README.md, section "How to change
   colors and branding".
=========================================================================== */

:root {
  /* --- Brand colors ---------------------------------------------------
     Matched to honorvettech.com: dark charcoal header/footer + orange CTA
     accent. ------------------------------------------------------------ */
  --color-primary: #1c1c1c;       /* Primary brand color (sidebar, buttons) */
  --color-primary-dark: #0d0d0d;
  --color-primary-light: #fdece3;
  --color-accent: #ee612c;        /* HonorVet orange accent (highlights, badges, CTAs) */
  --color-accent-dark: #d14f1f;

  /* --- Neutrals ------------------------------------------------------ */
  --color-bg: #f5f5f6;
  --color-surface: #ffffff;
  --color-border: #e4e4e5;
  --color-text: #262626;
  --color-text-muted: #6b6b6b;
  --color-text-inverse: #ffffff;

  /* --- Status ---------------------------------------------------------- */
  --color-danger: #dc2626;
  --color-danger-bg: #fef2f2;
  --color-success: #16a34a;

  /* --- Layout ---------------------------------------------------------- */
  --sidebar-width: 264px;
  --topbar-height: 68px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --shadow-sm: 0 1px 2px rgba(16, 24, 40, 0.06);
  --shadow-md: 0 4px 16px rgba(16, 24, 40, 0.08);
  --shadow-lg: 0 12px 32px rgba(16, 24, 40, 0.14);
  --transition-fast: 150ms ease;
  --transition-base: 220ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===========================================================================
   Reset & base
=========================================================================== */
*, *::before, *::after { box-sizing: border-box; }

/* The [hidden] attribute must always win over component display rules
   (e.g. .state-panel { display: flex }) regardless of cascade order. */
[hidden] { display: none !important; }

html, body {
  height: 100%;
}

body {
  margin: 0;
  font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
  background: var(--color-bg);
  color: var(--color-text);
  -webkit-font-smoothing: antialiased;
}

body.no-scroll { overflow: hidden; }

h1, h2, h3, h4, p { margin: 0; }

a { color: inherit; text-decoration: none; }

button {
  font: inherit;
  color: inherit;
  background: none;
  border: none;
  cursor: pointer;
}

ul { list-style: none; margin: 0; padding: 0; }

img, svg { display: block; max-width: 100%; }

.icon { width: 20px; height: 20px; flex-shrink: 0; }

input {
  font: inherit;
  color: inherit;
}

:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* ===========================================================================
   App shell
=========================================================================== */
.app-shell {
  display: flex;
  min-height: 100vh;
}

/* ---------------------------------------------------------------------
   Sidebar (desktop) / Drawer content shared styles
--------------------------------------------------------------------- */
.sidebar {
  width: var(--sidebar-width);
  flex-shrink: 0;
  background: var(--color-surface);
  color: var(--color-text);
  border-right: 1px solid var(--color-border);
  display: none;
  flex-direction: column;
  padding: 24px 16px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  padding: 4px 8px 20px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 16px;
  transition: opacity var(--transition-fast);
}

a.brand:hover { opacity: 0.82; }

.brand__logo {
  width: 100%;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand__logo img { width: 100%; height: auto; object-fit: contain; }

.brand__text h1 {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-text);
}

.brand__text p {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav__item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.nav__item:hover {
  background: var(--color-bg);
  color: var(--color-text);
}

.nav__item.is-active {
  background: var(--color-primary-light);
  color: var(--color-accent-dark);
}

.nav__item .icon { color: inherit; }

.nav__badge {
  margin-left: auto;
  background: var(--color-accent);
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 999px;
}

.nav__divider {
  margin: 18px 0 6px;
  padding: 0 12px;
}

.nav__divider span {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  font-weight: 700;
}

.nav__empty {
  padding: 6px 12px;
  font-size: 13px;
  color: var(--color-text-muted);
}

.sidebar__footer {
  margin-top: auto;
  padding: 16px 12px 4px;
  font-size: 11px;
  color: var(--color-text-muted);
  border-top: 1px solid var(--color-border);
}

.sidebar__footer p { margin-bottom: 6px; }

.sidebar__footer-link {
  display: inline-block;
  color: var(--color-accent);
  font-weight: 600;
  transition: color var(--transition-fast);
}

.sidebar__footer-link:hover { color: var(--color-accent-dark); text-decoration: underline; }

/* ---------------------------------------------------------------------
   Mobile drawer
--------------------------------------------------------------------- */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 14, 26, 0.5);
  z-index: 40;
  opacity: 0;
  transition: opacity var(--transition-base);
}

.drawer-overlay.is-visible { opacity: 1; }

.mobile-drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: min(84vw, 300px);
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: var(--shadow-lg);
  z-index: 50;
  transform: translateX(-100%);
  transition: transform var(--transition-base);
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
  overflow-y: auto;
}

.mobile-drawer.is-open { transform: translateX(0); }

.drawer-close {
  align-self: flex-end;
  color: var(--color-text-muted);
  padding: 6px;
  border-radius: 999px;
}

.drawer-close:hover { background: var(--color-bg); }

/* ===========================================================================
   Main content
=========================================================================== */
.main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 20px;
  height: var(--topbar-height);
}

.hamburger {
  display: flex;
  padding: 8px;
  border-radius: var(--radius-sm);
  color: var(--color-text);
}

.hamburger:hover { background: var(--color-bg); }

.topbar__logo-mobile {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 15px;
  transition: opacity var(--transition-fast);
}

a.topbar__logo-mobile:hover { opacity: 0.75; }

.topbar__logo-mobile img { height: 26px; width: auto; }

.topbar__logo-mobile span { display: none; }

@media (min-width: 380px) {
  .topbar__logo-mobile span { display: inline; }
}

.search-box {
  flex: 1;
  max-width: 480px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0 12px;
  height: 42px;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.search-box:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.search-box .icon { color: var(--color-text-muted); }

.search-box input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  height: 100%;
}

.search-box input:focus { outline: none; }

.topbar__spacer { margin-left: auto; }

.content {
  flex: 1;
  padding: 24px 28px 60px;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.content__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.content__header h2 {
  font-size: 22px;
  font-weight: 700;
}

.content__count {
  font-size: 13px;
  color: var(--color-text-muted);
}

/* ---------------------------------------------------------------------
   Recently viewed strip
--------------------------------------------------------------------- */
.recent-section {
  margin-bottom: 28px;
}

.recent-section h3 {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 12px;
}

.recent-row {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(220px, 260px);
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 6px;
}

/* ===========================================================================
   Dashboard grid & cards
=========================================================================== */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
}

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base);
  animation: cardIn var(--transition-base) both;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: #d4d4d5;
}

.card--compact { padding: 16px; gap: 8px; }

@keyframes cardIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.card__icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: var(--color-primary-light);
  color: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card__icon .icon { width: 22px; height: 22px; }

.card__fav {
  padding: 6px;
  border-radius: 999px;
  color: var(--color-text-muted);
  transition: color var(--transition-fast), transform var(--transition-fast);
}

.card__fav:hover { color: #f59e0b; transform: scale(1.1); }

.card__fav .icon { width: 18px; height: 18px; }

.card__fav.is-active {
  color: #f59e0b;
}

.card__fav.is-active .icon {
  fill: currentColor;
}

.card__title {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
}

.card__desc {
  font-size: 13.5px;
  color: var(--color-text-muted);
  line-height: 1.5;
  flex: 1;
}

.card__category {
  align-self: flex-start;
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-accent-dark);
  background: var(--color-primary-light);
  padding: 4px 10px;
  border-radius: 999px;
}

.card__button {
  margin-top: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--color-accent);
  color: #fff;
  font-weight: 600;
  font-size: 13.5px;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  transition: background var(--transition-fast), transform var(--transition-fast);
}

.card__button:hover {
  background: var(--color-accent-dark);
  transform: translateX(1px);
}

/* ===========================================================================
   States: loading / empty / error
=========================================================================== */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
}

.skeleton-card {
  height: 200px;
  border-radius: var(--radius-lg);
  background: linear-gradient(100deg, #eef1f8 30%, #e4e8f4 45%, #eef1f8 60%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {
  0% { background-position: 120% 0; }
  100% { background-position: -20% 0; }
}

.state-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  padding: 60px 24px;
  color: var(--color-text-muted);
  background: var(--color-surface);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
}

.state-panel .icon {
  width: 40px;
  height: 40px;
  color: var(--color-text-muted);
}

.state-panel h3 {
  font-size: 16px;
  color: var(--color-text);
  font-weight: 700;
}

.state-panel p {
  max-width: 420px;
  font-size: 14px;
}

.state-panel--error .icon { color: var(--color-danger); }
.state-panel--error { border-color: #fecaca; background: var(--color-danger-bg); }

/* ===========================================================================
   Dashboard viewer page (dashboard.html)
=========================================================================== */
.viewer-body {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.viewer-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 20px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  flex-wrap: wrap;
}

.viewer-header__title {
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-right: auto;
}

.viewer-header__title h1 {
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.viewer-header__title span {
  font-size: 12px;
  color: var(--color-text-muted);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border-radius: var(--radius-sm);
  font-size: 13.5px;
  font-weight: 600;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  transition: background var(--transition-fast), border-color var(--transition-fast);
  white-space: nowrap;
}

.btn:hover { background: var(--color-bg); border-color: #d4d4d5; }

.btn--primary {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #fff;
}

.btn--primary:hover { background: var(--color-accent-dark); border-color: var(--color-accent-dark); }

.btn .icon { width: 16px; height: 16px; }

.viewer-main {
  flex: 1;
  position: relative;
  background: var(--color-bg);
  overflow: hidden;
}

.frame-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fff;
}

.frame-wrap iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.frame-wrap.is-fullscreen iframe { background: #fff; }

.viewer-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  background: var(--color-surface);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.viewer-loading p {
  font-size: 14px;
  color: var(--color-text-muted);
}

.viewer-state {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.viewer-state .state-panel { max-width: 480px; }

.viewer-state .btn { margin-top: 4px; }

/* ===========================================================================
   Responsive breakpoints
=========================================================================== */

/* Tablet and up: show search full width still, but tighten paddings */
@media (max-width: 767px) {
  .content { padding: 18px 16px 48px; }
  .topbar { padding: 0 14px; gap: 10px; }
  .search-box { max-width: none; }
}

/* Desktop: reveal persistent sidebar, hide hamburger/mobile logo */
@media (min-width: 1024px) {
  .sidebar { display: flex; }
  .hamburger,
  .topbar__logo-mobile { display: none; }
}

@media (max-width: 1023px) {
  .content__header h2 { font-size: 19px; }
}

@media (max-width: 480px) {
  .grid { grid-template-columns: 1fr; }
  .viewer-header { padding: 10px 14px; }
  .viewer-header__title h1 { font-size: 14px; }
}
