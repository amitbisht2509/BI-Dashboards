# Dashboard Portal

A lightweight, static internal website that gives employees one central place
to find and open the company's Power BI dashboards. No build tools, no
frameworks, no server-side code, no database — just HTML, CSS, and vanilla
JavaScript.

---

## Table of contents

1. [How to run the website locally](#1-how-to-run-the-website-locally)
2. [How to add a new Power BI dashboard](#2-how-to-add-a-new-power-bi-dashboard)
3. [How to remove a dashboard](#3-how-to-remove-a-dashboard)
4. [How to change a dashboard link](#4-how-to-change-a-dashboard-link)
5. [How to create a new category](#5-how-to-create-a-new-category)
6. [How to change the company logo](#6-how-to-change-the-company-logo)
7. [How to change colors and branding](#7-how-to-change-colors-and-branding)
8. [How to deploy the website](#8-how-to-deploy-the-website)
9. [Publish to web vs. secure embed vs. direct link](#9-publish-to-web-vs-secure-embed-vs-direct-link)
10. [Security considerations](#10-security-considerations)
11. [Folder structure](#11-folder-structure)
12. [Pre-production checklist](#12-pre-production-checklist)

---

## 1. How to run the website locally

This is a static website — there is nothing to install or build. The only
requirement is to serve the files over `http://`, rather than opening them
directly as `file://`, because the browser needs a real origin for
`localStorage` (favorites/recents) and the iframe viewer to work reliably.

Pick any one of these options:

**Option A — VS Code Live Server (easiest for non-developers)**
1. Open the `dashboard-portal` folder in VS Code.
2. Install the "Live Server" extension.
3. Right-click `index.html` → "Open with Live Server".

**Option B — Python (already installed on most machines)**
```bash
cd dashboard-portal
python -m http.server 8080
```
Then open `http://localhost:8080` in your browser.

**Option C — Node.js `npx serve`** (only if Node is already available; not required)
```bash
cd dashboard-portal
npx serve .
```

There is no build step, no `npm install`, and no environment configuration
required for any of these.

---

## 2. How to add a new Power BI dashboard

All dashboards are defined in **`js/dashboards.js`**. This is the only file
you need to edit — the home page, navigation, and category filters are all
generated from it automatically.

1. Open `js/dashboards.js`.
2. Copy an existing object inside the `dashboards` array, for example:
   ```js
   {
     id: 8,
     name: "Marketing Dashboard",
     description: "Campaign performance and lead generation metrics.",
     category: "Marketing",
     url: "https://app.powerbi.com/view?r=YOUR_REPORT_ID_HERE",
     icon: "chart",
   },
   ```
3. Give it a unique `id` (any number not already used in the file).
4. Update `name`, `description`, `category`, and `url`.
5. Set `icon` to one of the supported keywords: `users`, `chart`, `dollar`,
   `briefcase`, `target`, `trending`, `building`, `shield`, `calendar`,
   `clipboard`, `globe`, `database`. Any other value falls back to a generic
   dashboard icon automatically — nothing breaks if you typo it.
6. Save the file and refresh the browser. The new dashboard card appears
   immediately — no other file needs to change.

> Tip: if you already know a specific report blocks iframe embedding, you can
> add `embeddable: false` to that dashboard's object so the viewer sends
> users straight to "open in new tab" instead of attempting to embed it.

---

## 3. How to remove a dashboard

Open `js/dashboards.js` and delete that dashboard's entire object — including
its surrounding `{ ... }` and the comma after it. Save the file. The card
disappears from the home page, search, filters, and navigation automatically.

---

## 4. How to change a dashboard link

Open `js/dashboards.js`, find the dashboard, and update its `url` field to
the new Power BI link. Save the file — no other changes needed.

---

## 5. How to create categories

There is no separate list of categories to maintain. Category filters (in
the sidebar, mobile menu, and search) are generated automatically from
whatever text appears in the `category` field of each dashboard in
`js/dashboards.js`.

To create a brand-new category, simply type a new category name for any
dashboard, e.g. `category: "Marketing"`. It will appear as a new filter
option the next time the page loads. To remove a category, make sure no
remaining dashboard uses that category name.

---

## 6. How to change the company logo

1. Replace `assets/images/logo-placeholder.svg` with your own logo file.
   - You can keep the filename `logo-placeholder.svg` (just replace its
     contents) so you don't need to edit any HTML, **or**
   - Use a different filename/format (e.g. `logo.png`) and update the three
     `<img src="assets/images/logo-placeholder.svg" ...>` references: one in
     `index.html` (desktop sidebar), one in `index.html` (mobile drawer),
     one in `index.html` (mobile topbar), and one in `dashboard.html` if you
     add a logo there too.
2. For best results, use a square image (recommended 80×80px or an SVG) —
   it's displayed in a 40×40px rounded box.

---

## 7. How to change colors and branding

Open `css/style.css` and edit the CSS variables at the very top of the file,
inside the `:root { ... }` block:

```css
:root {
  --color-primary: #1e3a8a;       /* Sidebar background, buttons, links */
  --color-primary-dark: #16296b;  /* Hover state for primary buttons */
  --color-primary-light: #e8edfb; /* Category tags, icon backgrounds */
  --color-accent: #38bdf8;        /* Badges, focus highlight */

  --color-bg: #f4f6fb;            /* Page background */
  --color-surface: #ffffff;       /* Card / panel background */
  --color-text: #1a2233;          /* Main text color */
  --color-text-muted: #6b7385;    /* Secondary text */
}
```

Change the hex values to match your company's brand colors — every button,
card accent, and nav highlight on the site references these variables, so a
single edit re-themes the whole portal. The portal title text itself
("Dashboard Portal", "Company Analytics Hub") is in the `<div class="brand">`
blocks in `index.html` — edit the text directly there.

---

## 8. How to deploy the website

This portal is a static site: only HTML, CSS, and JS files. It can be hosted
anywhere that serves static files.

### Free / low-cost external hosting

**GitHub Pages** (free, good if your company already uses GitHub)

*Option A — no command line, upload through the GitHub website:*
1. Go to [github.com/new](https://github.com/new) and create a new repository
   (e.g. `dashboard-portal`). Public or private both work with GitHub Pages
   on a paid plan; on a free personal account, Pages requires a **public**
   repository.
2. On the new repository's page, click **"uploading an existing file"**.
3. Drag in every file and folder from inside `dashboard-portal/` (`index.html`,
   `dashboard.html`, `README.md`, `.nojekyll`, and the `css/`, `js/`, and
   `assets/` folders) — **not** the `dashboard-portal` folder itself, its
   *contents*. Commit the upload.
4. Go to **Settings → Pages**. Under "Build and deployment", set **Source**
   to "Deploy from a branch", branch `main`, folder `/ (root)`. Save.
5. Wait 1–2 minutes, then GitHub shows your live URL, typically
   `https://<your-username>.github.io/dashboard-portal/`.

*Option B — command line with git:*
1. `cd dashboard-portal`
2. `git init` (skip if already a repo)
3. `git add .`
4. `git commit -m "Initial dashboard portal"`
5. `git remote add origin https://github.com/<your-username>/dashboard-portal.git`
6. `git push -u origin main`
7. Then follow step 4–5 above (Settings → Pages) to turn it on.

The included `.nojekyll` file tells GitHub Pages to serve the site exactly
as-is, skipping its default Jekyll processing step — not required for this
site, but a safe default for any static HTML/CSS/JS project.

**Netlify / Vercel / Cloudflare Pages** (free tiers available)
1. Drag-and-drop the `dashboard-portal` folder into their web dashboard, or
   connect the repository.
2. No build command is needed — publish directory is the project root.

> Note: if your dashboards contain confidential data, consider whether a
> public hosting URL is appropriate at all, even though Power BI itself
> still requires sign-in — see the [Security considerations](#10-security-considerations)
> section below.

### Internal company web server

If your company already runs an internal web server (IIS, Apache, Nginx, or
a SharePoint document library):

- **IIS**: copy the `dashboard-portal` folder into `C:\inetpub\wwwroot\` (or
  a subfolder), and create a new Site/Application pointing at it in IIS
  Manager. No special configuration or app pool settings are required since
  there's no server-side code.
- **Apache/Nginx**: copy the folder into the web root (e.g. `/var/www/html/`)
  and it will be served as-is.
- **Intranet share**: some browsers restrict `localStorage` and iframes when
  files are opened via a `file://` or `\\network\share` path — for full
  functionality (favorites, recents, dashboard embedding), serve it via
  `http://` from an actual web server rather than a raw file share.

---

## 9. Publish to web vs. secure embed vs. direct link

Power BI reports can be shared several different ways. Choosing the right
one for the `url` field in `js/dashboards.js` matters a lot for security:

| Method | Authentication | Row-Level Security | Appropriate for |
|---|---|---|---|
| **Publish to web** | None. Anyone with the link, anywhere on the internet, can view it. | Not supported. | Only genuinely public data (e.g. a public marketing stat page). **Never** confidential company data. |
| **Standard report link** (`app.powerbi.com/...`) opened directly | Requires Power BI / Microsoft Entra ID sign-in. | Enforced, if configured in the semantic model. | Most internal company dashboards. This is what this portal is designed around. |
| **Secure embed** (Power BI Embedded, "embed for your organization", or an app with proper auth tokens) | Requires your app to obtain a valid embed token per user. | Enforced, if configured. | Larger organizations wanting a fully seamless in-app experience without a Power BI login prompt. Requires additional setup outside the scope of this static portal (typically an Azure AD app registration and, often, a small backend to mint embed tokens). |

This portal's iframe viewer works with any of these — it just points an
iframe (or new-tab link) at whatever `url` you provide. It does not perform
authentication itself in any case.

---

## 10. Security considerations

- **This portal does not handle login, authentication, or licensing for
  Power BI.** Every dashboard `url` in `js/dashboards.js` is exactly what a
  user's browser is sent to. Power BI's own sign-in and licensing rules
  apply exactly as if the user had navigated there directly.
- **This portal does not implement Row-Level Security (RLS).** If a report
  needs to show different data to different users, that RLS must already be
  configured inside the Power BI semantic model, and you must use a linking
  method that honors signed-in identity (a standard report link or a proper
  secure embed) — never "Publish to web".
- **Never use "Publish to web" for confidential or sensitive data.** It
  removes all authentication and RLS and makes the report visible to anyone
  with the link, indefinitely, regardless of your organization's other
  security settings.
- **Iframe embedding failures are expected, not bugs.** Power BI and modern
  browsers may block a report from loading inside an iframe (e.g. due to
  `X-Frame-Options`, tenant embed-code settings, or conditional access
  policies). The viewer detects this and shows a friendly fallback with an
  "Open in New Tab" button — this is working as intended, not an error to
  fix in the portal's code.
- **Favorites and recently viewed are local to each user's browser**
  (stored in `localStorage`), not synced anywhere, and contain no
  information beyond dashboard IDs and timestamps.
- Serve the portal over HTTPS in production so that traffic between the
  employee's browser and both the portal and Power BI is encrypted.

---

## 11. Folder structure

```
dashboard-portal/
├── index.html                  Home page (dashboard grid, search, filters)
├── dashboard.html               Dashboard viewer page (iframe / fallback)
├── css/
│   └── style.css                All styling, layout, and CSS variables
├── js/
│   ├── dashboards.js             ← EDIT THIS FILE to add/remove dashboards
│   ├── app.js                    Home page logic (rendering, search, filters,
│   │                              favorites, recents, mobile nav)
│   └── dashboard-viewer.js       Viewer page logic (iframe load/fallback,
│                                  fullscreen, recents tracking)
├── assets/
│   └── images/
│       └── logo-placeholder.svg  Company logo (replace with your own)
└── README.md                     This file
```

---

## 12. Pre-production checklist

Before rolling the portal out company-wide, confirm:

- [ ] Every dashboard in `js/dashboards.js` has a real `url` (no
      `YOUR_REPORT_ID_HERE` placeholders left).
- [ ] No confidential dashboard uses a "Publish to web" link.
- [ ] Row-Level Security is configured in the Power BI semantic model for
      any report where different users should see different data.
- [ ] The company logo has been replaced (`assets/images/logo-placeholder.svg`).
- [ ] Brand colors updated in `css/style.css` (`:root` variables), if desired.
- [ ] Portal title / subtitle text updated in `index.html` (`.brand` blocks).
- [ ] Tested on desktop (sidebar visible) and mobile width (hamburger menu
      opens the drawer, search and filters work).
- [ ] Tested search by name, description, and category.
- [ ] Tested each category filter, "All Dashboards", "Favorites" (after
      starring a card), and "Recently Viewed" (after opening a dashboard).
- [ ] Opened at least one real dashboard end-to-end: iframe loads, or the
      fallback "Open in New Tab" message appears correctly if embedding is
      blocked.
- [ ] Tested Fullscreen and "Open in New Tab" buttons on the viewer page.
- [ ] Confirmed the empty-state message appears correctly if
      `js/dashboards.js` is temporarily emptied (`const dashboards = [];`).
- [ ] Site is served over `http://` or `https://` (not opened as a raw
      `file://` path) so `localStorage` and iframes behave reliably.
- [ ] Deployed to the chosen hosting location and reachable by employees.
