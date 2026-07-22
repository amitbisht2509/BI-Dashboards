/**
 * dashboards.js
 * ---------------------------------------------------------------------------
 * DASHBOARD CONFIGURATION FILE
 * ---------------------------------------------------------------------------
 * This is the ONLY file you need to edit to add, remove, or update dashboards
 * on the portal. You do not need to touch any HTML, CSS, or other JS files.
 *
 * HOW TO ADD A DASHBOARD
 *   1. Copy one of the objects below.
 *   2. Give it a unique "id" (any number or string not already used).
 *   3. Fill in "name", "description", "category", "url", and "icon".
 *   4. Save the file. Refresh the website — the new dashboard card appears
 *      automatically, on the home page and in the category filters.
 *
 * HOW TO REMOVE A DASHBOARD
 *   Delete its entire object (including the surrounding { ... }) from the
 *   array below. Save the file. The card disappears automatically.
 *
 * HOW TO CHANGE A DASHBOARD LINK
 *   Edit the "url" value for that dashboard.
 *
 * HOW TO CREATE A NEW CATEGORY
 *   Just type a new category name in the "category" field of any dashboard.
 *   The category filter list on the site is generated automatically from
 *   whatever category names appear in this file — there is nothing else to
 *   configure.
 *
 * FIELD REFERENCE
 *   id          (required) Unique identifier. Number or string.
 *   name        (required) Dashboard title shown on the card.
 *   description (required) One or two sentence summary shown on the card.
 *   category    (required) Category label. Used for filtering.
 *   url         (required) The Power BI report link (see README.md for the
 *               difference between "Publish to web", secure embed links,
 *               and direct app.powerbi.com report links).
 *   icon        (required) One of the icon keywords supported by the portal:
 *               "users", "chart", "dollar", "briefcase", "target",
 *               "trending", "building", "shield", "calendar", "clipboard",
 *               "globe", "database". If you use an unrecognized keyword,
 *               a generic dashboard icon is shown automatically.
 *   embeddable  (optional) true/false. Set to false if you already know a
 *               report blocks iframe embedding, so the portal skips the
 *               embed attempt and sends users straight to a new tab.
 *               Defaults to true (the portal will still auto-detect
 *               embedding failures either way).
 *
 * ---------------------------------------------------------------------------
 * SECURITY NOTE — READ BEFORE PUBLISHING REAL DASHBOARDS
 * ---------------------------------------------------------------------------
 * - This portal does NOT handle authentication, authorization, or licensing.
 *   All access control for these reports is handled entirely by Power BI
 *   (Microsoft Entra ID / Power BI login) at the "url" you provide.
 * - This portal does NOT implement Row-Level Security (RLS). If a report
 *   requires RLS, that RLS must already be configured inside the Power BI
 *   semantic model itself, and the embedding method you use ("url" below)
 *   must be one that honors signed-in user identity (e.g. a standard
 *   app.powerbi.com report link opened while signed into Power BI), NOT
 *   "Publish to web".
 * - Never put a "Publish to web" link in this file for confidential,
 *   internal, or sensitive company data. "Publish to web" makes a report
 *   PUBLICLY accessible to anyone on the internet with the link, with NO
 *   authentication and NO RLS, regardless of your organization's tenant
 *   settings. Only use "Publish to web" for genuinely public information.
 * ---------------------------------------------------------------------------
 */

var dashboards = [
  {
    id: 1,
    name: "Executive Overview",
    description: "Company-wide KPIs, revenue trends, and strategic performance summary for leadership.",
    category: "Executive",
    url: "https://app.powerbi.com/view?r=YOUR_REPORT_ID_HERE",
    icon: "trending",
  },
  {
    id: 2,
    name: "Recruitment Dashboard",
    description: "Recruitment pipeline health, time-to-hire, and candidate source performance.",
    category: "Recruitment",
    url: "https://app.powerbi.com/view?r=YOUR_REPORT_ID_HERE",
    icon: "users",
  },
  {
    id: 3,
    name: "HR Dashboard",
    description: "Headcount, attrition, employee engagement, and workforce analytics.",
    category: "HR",
    url: "https://app.powerbi.com/view?r=YOUR_REPORT_ID_HERE",
    icon: "briefcase",
  },
  {
    id: 4,
    name: "Finance Dashboard",
    description: "Budget vs. actuals, cash flow, and departmental spend analysis.",
    category: "Finance",
    url: "https://app.powerbi.com/view?r=YOUR_REPORT_ID_HERE",
    icon: "dollar",
  },
  {
    id: 8,
    name: "Healthcare Dashboard",
    description: "Healthcare vertical recruiting pipeline, client fill rates, and placement metrics.",
    category: "Healthcare",
    url: "https://app.powerbi.com/view?r=YOUR_REPORT_ID_HERE",
    icon: "shield",
  },
  {
    id: 9,
    name: "IT Dashboard",
    description: "IT vertical recruiting pipeline, client fill rates, and placement metrics.",
    category: "IT",
    url: "https://app.powerbi.com/view?r=YOUR_REPORT_ID_HERE",
    icon: "database",
  },
  {
    id: 10,
    name: "NON-IT Dashboard",
    description: "Non-IT vertical recruiting pipeline, client fill rates, and placement metrics.",
    category: "NON-IT",
    url: "https://app.powerbi.com/view?r=YOUR_REPORT_ID_HERE",
    icon: "briefcase",
  },
  {
    id: 11,
    name: "Pharmaceutical Dashboard",
    description: "Pharmaceutical vertical recruiting pipeline, client fill rates, and placement metrics.",
    category: "Pharmaceutical",
    url: "https://app.powerbi.com/view?r=YOUR_REPORT_ID_HERE",
    icon: "target",
  },
  {
    id: 6,
    name: "Operations Dashboard",
    description: "Service delivery metrics, ticket volume, and operational efficiency indicators.",
    category: "Operations",
    url: "https://app.powerbi.com/view?r=YOUR_REPORT_ID_HERE",
    icon: "building",
  },
  {
    id: 7,
    name: "Employee Performance",
    description: "Goal completion, review cycles, and performance rating distribution.",
    category: "Performance",
    url: "https://app.powerbi.com/view?r=YOUR_REPORT_ID_HERE",
    icon: "target",
  },
  {
    id: 12,
    name: "Master Dashboard",
    description: "Company-wide master report combining key metrics across departments.",
    category: "Executive",
    // Standard Power BI "embed" link (opened while signed in) — autoAuth=true and
    // ctid= mean this still requires organizational sign-in and honors RLS if
    // configured in the semantic model. This is NOT a "Publish to web" link.
    url: "https://app.powerbi.com/reportEmbed?reportId=41075716-fefc-4f19-b74c-b134b9c20fdd&autoAuth=true&ctid=0fbf1c82-c79e-41db-9ad3-8d147097371c",
    icon: "trending",
  },
];

// Do not edit below this line — this makes the config available to app.js
// and dashboard-viewer.js whether the site is opened via a server or, in
// most browsers, directly from disk.
if (typeof module !== "undefined" && module.exports) {
  module.exports = dashboards;
}
