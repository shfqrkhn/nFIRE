# CODEBASE.md

## Scope
- **Apparent Purpose:** nFIRE is a static Progressive Web App (PWA) and deterministic financial independence calculator for Canadians, computing tax liabilities and pension vestings. It operates completely offline via client-side storage, ensuring maximum data privacy.
- **Stack/Languages/Frameworks:** HTML, CSS, JavaScript (compiled React 18, Vite, Workbox Service Worker, Tailwind CSS). *Note: This repository contains only deployment artifacts, not source code.*
- **Entry Points:** `index.html` (main UI), `sw.js` (Service Worker).
- **Build/Run/Test Systems:** Artifact-only repository. Built for static hosting (GitHub Pages, Netlify). No build steps or tests exist within this repository.
- **Architectural Style:** Static PWA, Client-side SPA (Single Page Application).
- **Major Operational Invariants:**
  - Zero external network requests (offline-first architecture).
  - No server-side processing; full data sovereignty (IndexedDB only).
  - Strict Content-Security-Policy (CSP) parity between client (`index.html`) and server (`_headers`).
  - Read-only minified application bundles (business logic source is external).

## Repository Map
```
.
├── .jules/
│   └── steward.md
├── 404.html
├── CLAUDE.md
├── LICENSE
├── PARETO_VIA_NEGATIVA_ANALYSIS.md
├── README.md
├── _headers
├── _redirects
├── assets/
│   ├── index-*.css
│   └── index-*.js
├── index.html
├── manifest.webmanifest
├── robots.txt
├── sitemap.xml
├── sw.js
└── workbox-*.js
```

## Authoritative Review Summary
- **Core Flows:** Initial load via `index.html` featuring inline CSS loading states. Service worker (`sw.js`) subsequently caches all static assets for offline capability. SPA routing is managed via `404.html` (GitHub Pages) and `_redirects` (Netlify).
- **Important Interfaces:** The Service Worker precache manifest (`sw.js`) defines exact file hashes. Client-side inline JS implements accessibility fixes for SVGs using a `MutationObserver`.
- **Key Configs:** `_headers` (strict HTTP security headers, CSP, caching rules), `manifest.webmanifest` (PWA display parameters, icons).
- **Major Invariants:** Version parity is strictly required across `index.html`, `README.md`, and `CLAUDE.md`. The `404.html` must remain an exact clone of `index.html`.
- **Principal Risks:** PWA cache invalidation failure due to manual hash updates in `sw.js` when modifying precached files. Missing source code fundamentally limits the ability to patch or audit complex business logic.

## File Inventory
| Path | Role | Priority | Inclusion | Reason |
|---|---|---|---|---|
| `index.html` | Entry Point | Critical | Full | Primary entry, CSP definition, inline load states, version source of truth. |
| `sw.js` | Service Worker | Critical | Full | PWA caching logic and precache manifest routing. |
| `_headers` | HTTP Security | Critical | Full | Server-side security configs, CSP parity, strict cache policies. |
| `manifest.webmanifest` | PWA Config | Important | Full | Manifest details, layout and icon configs. |
| `README.md` | Project Doc | Context | Excerpt | Core documentation, version badges, architecture details. |
| `robots.txt` | SEO/Access | Context | Full | Crawler rules and sitemap definition. |
| `404.html` | SPA Routing | Important | Summary | Exact copy of `index.html` for GitHub Pages SPA routing fallback. |
| `CLAUDE.md` | AI Guidelines | Important | Summary | Artifact constraints and AI developer guidelines. |
| `PARETO_VIA_NEGATIVA_ANALYSIS.md` | Arch Tracking | Context | Summary | Design philosophies and artifact architectural rules. |
| `.jules/steward.md` | Dev Ledger | Context | Summary | Historical developer logs and rules. |
| `sitemap.xml` | SEO | Context | Summary | Canonical URLs and update frequency. |
| `_redirects` | SPA Routing | Context | Summary | Single-line SPA fallback config. |
| `assets/*.js` | Build Artifact | Context | Excluded | Minified React logic core. Excluded due to missing source code. |
| `assets/*.css` | Build Artifact | Context | Excluded | Minified CSS. |
| `workbox-*.js` | Dependency | Context | Excluded | Third-party Workbox library. |
| `*.png`, `*.ico` | Assets | Context | Excluded | Static image files. |
| `LICENSE` | Legal | Context | Excluded | Standard MIT License. |

## Embedded Critical Files

### `index.html`
- **Role:** Entry Point & SPA Host
- **Why it matters:** Defines PWA linkages, defines strict CSP, injects global accessible state patterns (ARIA MutationObserver), and provides inline visual loading fallbacks before React hydation.
- **Inclusion Mode:** Full
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'sha256-te72nCdQZcQNdKiok7rhEkNIMak1nM/vBg9mjPk2v6w=' 'sha256-4SyNtU48wkcDRCfytmGzBaeP6n583sHqwXn+zsPaD8c=' 'sha256-lUJ4bPO8cO+B312++diOQIVgZnjiV9peIaMt1dk7reE='; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; worker-src 'self'; manifest-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self';">
    <meta name="referrer" content="strict-origin-when-cross-origin" />
    <link rel="icon" type="image/png" href="./pwa-512x512.png" /><link rel="icon" href="./favicon.ico" sizes="any" /><link rel="apple-touch-icon" href="./pwa-180x180.png" sizes="180x180" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#050505" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="nFIRE" />
    <meta name="description" content="nFIRE is a deterministic financial independence engine for Canadians, simulating tax brackets, RRSP meltdowns, and pensions." />
    <title>nFIRE</title>
    <link rel="canonical" href="https://shfqrkhn.github.io/nFIRE/" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="nFIRE" />
    <meta property="og:description" content="nFIRE is a deterministic financial independence engine for Canadians, simulating tax brackets, RRSP meltdowns, and pensions." />
    <meta property="og:url" content="https://shfqrkhn.github.io/nFIRE/" />
    <meta property="og:image" content="https://shfqrkhn.github.io/nFIRE/screenshot-main.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="https://shfqrkhn.github.io/nFIRE/screenshot-main.png" />
    <link rel="modulepreload" href="./assets/index-F7z_Yzm8.js">
    <link rel="preload" href="./assets/index-BoPtPGWY.css" as="style">
    <script type="module" crossorigin src="./assets/index-F7z_Yzm8.js"></script>
    <link rel="stylesheet" crossorigin href="./assets/index-BoPtPGWY.css">
  <link rel="manifest" href="./manifest.webmanifest"><script>if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('./sw.js', { scope: './' })})}</script>
    <style>
      button, a, input, label, select, textarea, summary, [role="button"] {
        touch-action: manipulation;
      }
      @keyframes pulse { 0% { opacity: 0.3; } 50% { opacity: 0.7; } 100% { opacity: 0.3; } }
    </style>
  <script>if(location.hostname!=='localhost'){const n=()=>{};console.log=n;console.warn=n;console.error=n;}</script>  <script>document.addEventListener('DOMContentLoaded',()=>{new MutationObserver(()=>document.querySelectorAll('svg:not([aria-hidden]):not([aria-label]):not([role])').forEach(s=>{s.setAttribute('aria-hidden','true');s.setAttribute('focusable','false')})).observe(document.body,{childList:true,subtree:true})});</script></head>
  <body style="background-color: #050505; margin: 0;">
    <div id="root">
      <div role="status" aria-live="polite" style="height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; color: rgba(255, 255, 255, 0.5); font-size: 12px; letter-spacing: 1px; animation: pulse 1.5s infinite ease-in-out;">
        nFIRE :: SYSTEM LOADING
      </div>
    </div>

    <div style="position: fixed; bottom: 8px; right: 8px; font-family: monospace; font-size: 10px; color: rgba(255, 255, 255, 0.3); pointer-events: none; z-index: 9999;">v10.1.35</div>
  </body>
</html>
```

### `sw.js`
- **Role:** Service Worker
- **Why it matters:** Workbox implementation governing offline availability and caching strategy. Contains hardcoded precache revision hashes that must be kept exactly synchronized with file content.
- **Inclusion Mode:** Full
```javascript
if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise(i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()}).then(()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e}));self.define=(s,c)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(i[r])return;let o={};const t=e=>n(e,r),a={module:{uri:r},exports:o,require:t};i[r]=Promise.all(s.map(e=>a[e]||t(e))).then(e=>(c(...e),o))}}define(["./workbox-66610c77"],function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"index.html",revision:"739fa89bffb7c7c3f2ece9087e183365"},{url:"manifest.webmanifest",revision:"fe5224ed222c03439abdcad5bd91b5a4"},{url:"pwa-192x192.png",revision:"3177d553168bf4a7cd01b9a1520b2faf"},{url:"pwa-180x180.png",revision:"38220b218afd1b65a9ca529d29952cc4"},{url:"pwa-512x512.png",revision:"99ea437b0205dc213a787c22fec2ac67"},{url:"assets/index-BoPtPGWY.css",revision:null},{url:"assets/index-F7z_Yzm8.js",revision:null}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))});

```

### `_headers`
- **Role:** Deployment Security Configuration
- **Why it matters:** Enforces rigorous strict security settings, strict cache rules preventing stale route serving, and CSP which must maintain parity with `index.html`.
- **Inclusion Mode:** Full
```text
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=(), midi=(), sync-xhr=(), serial=(), bluetooth=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Content-Security-Policy: default-src 'self'; script-src 'self' 'sha256-te72nCdQZcQNdKiok7rhEkNIMak1nM/vBg9mjPk2v6w=' 'sha256-4SyNtU48wkcDRCfytmGzBaeP6n583sHqwXn+zsPaD8c=' 'sha256-lUJ4bPO8cO+B312++diOQIVgZnjiV9peIaMt1dk7reE='; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; worker-src 'self'; manifest-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests;
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp

/index.html
  Cache-Control: public, max-age=0, must-revalidate

/404.html
  Cache-Control: public, max-age=0, must-revalidate

/sw.js
  Cache-Control: no-cache, no-store, must-revalidate

/manifest.webmanifest
  Cache-Control: public, max-age=0, must-revalidate

/sitemap.xml
  Cache-Control: public, max-age=0, must-revalidate

/workbox-*.js
  Cache-Control: public, max-age=31536000, immutable

/*.png
  Cache-Control: public, max-age=0, must-revalidate

/favicon.ico
  Cache-Control: public, max-age=0, must-revalidate

/assets/*
  Cache-Control: public, max-age=31536000, immutable

```

### `manifest.webmanifest`
- **Role:** PWA Manifest
- **Why it matters:** Configuration for installable mobile capabilities, theme colors, and icons required for standalone PWA.
- **Inclusion Mode:** Full
```json
{
    "name": "nFIRE",
    "short_name": "nFIRE",
    "start_url": "./",
    "display": "standalone",
    "background_color": "#050505",
    "theme_color": "#050505",
    "lang": "en",
    "scope": "./",
    "icons": [
        {
            "src": "./pwa-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any maskable"
        },
        {
            "src": "./pwa-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ],
    "screenshots": [
        {
            "src": "./screenshot-main.png",
            "sizes": "1786x1286",
            "type": "image/png",
            "form_factor": "wide"
        }
    ],
    "description": "nFIRE is a deterministic financial independence engine for Canadians, simulating tax brackets, RRSP meltdowns, and pensions.",
    "categories": [
        "finance",
        "productivity",
        "utilities"
    ]
}

```

### `README.md`
- **Role:** Primary Documentation
- **Why it matters:** Contains version badges (serving as a source of truth without `package.json`) and explicitly declares the lack of source code in the repository.
- **Inclusion Mode:** Excerpt
- **Covered Region:** Header containing version badge and philosophy, followed by the Architectural and Physics update sections.
```markdown
# 🌌 nFIRE: The Singularity Solvency Engine

![Version](https://img.shields.io/badge/Version-10.1.35-neon)
![Status](https://img.shields.io/badge/Status-Universal-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Privacy](https://img.shields.io/badge/Data-Local_Only-red)

> **nFIRE** is a deterministic financial independence engine. Unlike simple calculators that rely on the "4% Rule," nFIRE simulates your financial life year-by-year, strictly enforcing Canadian progressive tax brackets, RRSP meltdowns, and complex Defined Benefit pension vesting to determine your absolute solvency.

[**Live Demo**](https://shfqrkhn.github.io/nFIRE/)

![Screenshot](./screenshot-main.png)

---

## 📖 Table of Contents

1. [The Philosophy](#-the-philosophy)
2. [Features & Capabilities](#-features--capabilities)
3. [User Manual (Pilot's Handbook)](#-user-manual-pilots-handbook)
   - [Onboarding](#31-onboarding-the-welcome-mat)
   - [Core Workflow](#32-core-workflow)
   - [Advanced Configuration](#33-advanced-configuration-pensions--assumptions)
...

*   **Annual Savings (Injection):** How much you invest annually.
    *   *Auto-Sort:* The engine automatically fills tax-sheltered accounts first (TFSA $\to$ RRSP $\to$ Non-Reg).
*   **Retirement Spending (Burn Rate):** Your desired **after-tax** spending in retirement.
    *   *The Demand:* This is the net cash the engine must produce every year until age 95.

#### 3. Assets (Current) 🏦
Expand the accordion to enter current balances:
*   **RRSP:** Registered Retirement Savings Plan.
*   **TFSA:** Tax-Free Savings Account.
*   **Non-Reg:** Taxable Investment Accounts / Corp.

#### 4. Telemetry 📡
*   **The Reactor:** A radial gauge showing progress toward freedom.
*   **nFIRE Date:** The year you become fully solvent (work becomes optional).
*   **Coast Ready:** The year you can stop *saving* money, assuming you continue to work just enough to cover your daily costs.

### 3.3 Advanced Configuration (Pensions & Assumptions)

#### 🛡️ Defined Benefit Pensions
Click the **Shield Icon** to configure pensions. Supports two modes:
1.  **Fixed Amount:** For private annuities. Enter annual amount and start age.
2.  **Service Formula:** For Public Sector/GC. Enter **Career Start Age**, **Best 5-Year Avg**, and **Accrual Rate**.
    *   *Logic:* The engine calculates the pension value dynamically based on the retirement age being tested in the solvency loop.

#### ⏱️ Timeline & Assumptions
*   **Timeline:** Adjust Current Age and Target Retirement Age (for visual projection).
*   **Assumptions:** Tweak **Real Growth Rate** (Default: 5%) and **Tax Drag**.

...
```

### `robots.txt`
- **Role:** Crawler configuration
- **Why it matters:** Demonstrates strict disallow constraints on markdown documentation and hidden folders while pointing to the sitemap.
- **Inclusion Mode:** Full
```text
User-agent: *
Disallow: /.jules/
Disallow: /*.md
Disallow: /LICENSE
Sitemap: https://shfqrkhn.github.io/nFIRE/sitemap.xml

```

## Summarized Files

- **`404.html`**: A direct, unmodified clone of `index.html`. Required by GitHub pages to route arbitrary SPA URLs back to the client router without throwing a 404 response.
- **`CLAUDE.md`**: AI assistant instructions explicitly outlining that this repository is artifact-only. Contains commands for CSP hashing and documents the requirement for tri-file version synchronization (`index.html`, `README.md`, `CLAUDE.md`).
- **`PARETO_VIA_NEGATIVA_ANALYSIS.md`**: An architectural philosophy document. Outlines "Block List" requirements such as strict zero-dependency policies, preventing the use of external CDNs, Google Fonts, or build tools directly in the repo.
- **`.jules/steward.md`**: A historical ledger of decisions made by AI stewards, primarily covering security updates (CSP parity), UX enhancements (iOS zoom prevention via `touch-action: manipulation`), accessibility patches, and version control mandates.
- **`sitemap.xml`**: Defines the single canonical production URL (`https://shfqrkhn.github.io/nFIRE/`) and its `lastmod` tracking.
- **`_redirects`**: Used by platforms like Netlify/Cloudflare to implement SPA routing. Contains a single rule: `/* /index.html 200`.

## Cross-File Relationships
- **CSP Parity:** The `Content-Security-Policy` defined in `_headers` must mirror the policy found in the `<meta>` tag of `index.html` (excluding server-only directives like `upgrade-insecure-requests`).
- **Version Synchronization:** Without a `package.json`, versions are manually maintained simultaneously in the footer of `index.html`, the header badge of `README.md`, and the metadata of `CLAUDE.md`.
- **PWA Integrity (The Precache Route):** `sw.js` registers exact MD5 revision hashes for `index.html`, `manifest.webmanifest`, and the application icons. Modifying any of these files requires manually computing and updating its hash in `sw.js`.
- **Routing Duplication:** Modifying `index.html` requires an identical, exact overwrite of `404.html` to prevent GitHub Pages users from experiencing stale hydration issues on deep links.
- **Runtime Patches:** `index.html` contains an inline `MutationObserver` script that dynamically hooks into the React component tree (defined in `assets/index-*.js`) to inject `aria-hidden` tags into minified SVGs, as source modifications are impossible.

## Review Hotspots
- **Maintainability Risks:** Modifying core business logic or React components is impossible. Any modifications to functionality necessitate access to the external source repository, making this artifact-only codebase extremely brittle to logic updates.
- **Correctness Risks:** Since the `sw.js` revisions are manual, a human or AI agent forgetting to update the MD5 hash of `index.html` after a change will silently break the PWA upgrade mechanism for users.
- **Security Risks:** The strict CSP operates across two boundaries (`_headers` and HTML). A mismatch here could easily trigger false-positive CSP blocks or downgrade the security posture on deployment.
- **UX/Accessibility Risks:** The `MutationObserver` pattern for injecting ARIA accessibility attributes is highly volatile. If the compiled SVGs in `assets/*.js` change their structure upstream, the observer may fail to target them correctly, creating screen reader noise.

## Packaging Notes
- **Exclusions:** The `assets/*.js` and `assets/*.css` static bundles were excluded entirely. They are minified build outputs exceeding standard review constraints and provide no readable source signal for an auditing AI without the original source maps. Static images were also omitted.
- **Compression Decisions:** Since `404.html` is exactly identical to `index.html`, it was summarized rather than duplicated in full to preserve document density. Documentation (README) was significantly excerpted to focus purely on the artifact architecture.
- **Fidelity Limits:** A downstream reviewer cannot assess the mathematical correctness of the financial formulas, the internal React UI component structure, or the tax bracket constants. These are irretrievably obfuscated within the minified assets.
- **Missing/Unreadable Content:** As repeatedly stated, the entirety of the original source code (`src/` directory, `package.json`, test suites) is entirely missing from this deployment repository. Downstream reviews must focus strictly on the delivery, caching, and security wrappers.
