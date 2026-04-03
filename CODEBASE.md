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
├── scripts/
│   └── verify_artifact_consistency.sh
├── 404.html
├── CLAUDE.md
├── CODEBASE.md
├── LICENSE
├── PARETO_VIA_NEGATIVA_ANALYSIS.md
├── README.md
├── _headers
├── _redirects
├── assets/
│   ├── index-*.css
│   └── index-*.js
├── favicon.ico
├── index.html
├── manifest.webmanifest
├── pwa-180x180.png
├── pwa-192x192.png
├── pwa-512x512.png
├── robots.txt
├── screenshot-main.png
├── sitemap.xml
├── sw.js
└── workbox-*.js
```

## Authoritative Review Summary
- **Core Flows:** Initial load via `index.html` featuring inline CSS loading states. Service worker (`sw.js`) subsequently caches all static assets for offline capability. SPA routing is managed via `404.html` (GitHub Pages) and `_redirects` (Netlify).
- **Important Interfaces:** The Service Worker precache manifest (`sw.js`) defines exact file hashes. Client-side inline JS implements accessibility fixes for SVGs using a `MutationObserver`.
- **Key Configs:** `_headers` (strict HTTP security headers, CSP, caching rules), `manifest.webmanifest` (PWA display parameters, icons).
- **Major Invariants:** Version parity is strictly required across `index.html`, `README.md`, `CLAUDE.md`, and `404.html`. The `404.html` must remain an exact clone of `index.html`. Security headers in `_headers` must match meta tags in HTML.
- **Principal Risks:** PWA cache invalidation failure due to manual hash updates in `sw.js` when modifying precached files. Missing source code fundamentally limits the ability to patch or audit complex business logic.

## File Inventory
| Path | Role | Priority | Inclusion | Reason |
|---|---|---|---|---|
| `index.html` | Entry Point | Critical | Full | Primary entry, CSP definition, inline load states, version source of truth. |
| `sw.js` | Service Worker | Critical | Full | PWA caching logic and precache manifest routing. |
| `_headers` | HTTP Security | Critical | Full | Server-side security configs, CSP parity, strict cache policies. |
| `manifest.webmanifest` | PWA Config | Important | Full | Manifest details, layout and icon configs. |
| `scripts/verify_artifact_consistency.sh` | CI Script | Critical | Full | Enforces version and security invariant validation. |
| `README.md` | Project Doc | Context | Excerpt | Core documentation, version badges, architecture details. |
| `CLAUDE.md` | AI Guidelines | Important | Excerpt | Artifact constraints and AI developer guidelines. |
| `robots.txt` | SEO/Access | Context | Full | Crawler rules and sitemap definition. |
| `404.html` | SPA Routing | Important | Summary | Exact copy of `index.html` for GitHub Pages SPA routing fallback. |
| `PARETO_VIA_NEGATIVA_ANALYSIS.md` | Arch Tracking | Context | Excerpt | Design philosophies and artifact architectural rules. |
| `.jules/steward.md` | Dev Ledger | Context | Excerpt | Historical developer logs and rules. |
| `sitemap.xml` | SEO | Context | Summary | Canonical URLs and update frequency. |
| `_redirects` | SPA Routing | Context | Summary | Single-line SPA fallback config. |
| `assets/*.js` | Build Artifact | Context | Excluded | Minified React logic core. Excluded due to missing source code. |
| `assets/*.css` | Build Artifact | Context | Excluded | Minified CSS. |
| `workbox-*.js` | Dependency | Context | Excluded | Third-party Workbox library. |
| `*.png`, `*.ico` | Assets | Context | Excluded | Static image files. |
| `LICENSE` | Legal | Context | Excluded | Standard MIT License. |
| `CODEBASE.md` | Self | Context | Excluded | The artifact itself. |

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
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'sha256-te72nCdQZcQNdKiok7rhEkNIMak1nM/vBg9mjPk2v6w=' 'sha256-4SyNtU48wkcDRCfytmGzBaeP6n583sHqwXn+zsPaD8c=' 'sha256-lUJ4bPO8cO+B312++diOQIVgZnjiV9peIaMt1dk7reE='; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; worker-src 'self'; manifest-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests;">
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

    <div style="position: fixed; bottom: 8px; right: 8px; font-family: monospace; font-size: 10px; color: rgba(255, 255, 255, 0.3); pointer-events: none; z-index: 9999;">v10.1.39</div>
  </body>
</html>
```

### `sw.js`
- **Role:** Service Worker
- **Why it matters:** Workbox implementation governing offline availability and caching strategy. Contains hardcoded precache revision hashes that must be kept exactly synchronized with file content.
- **Inclusion Mode:** Full
```javascript
if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise(i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()}).then(()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e}));self.define=(s,c)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(i[r])return;let o={};const t=e=>n(e,r),a={module:{uri:r},exports:o,require:t};i[r]=Promise.all(s.map(e=>a[e]||t(e))).then(e=>(c(...e),o))}}define(["./workbox-66610c77"],function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"index.html",revision:"4e665327e8986a4697b1e2b171604295"},{url:"manifest.webmanifest",revision:"fe5224ed222c03439abdcad5bd91b5a4"},{url:"pwa-192x192.png",revision:"03dec2455ca45f4d5e9eaf41f3915c4f"},{url:"pwa-180x180.png",revision:"38220b218afd1b65a9ca529d29952cc4"},{url:"pwa-512x512.png",revision:"99ea437b0205dc213a787c22fec2ac67"},{url:"assets/index-BoPtPGWY.css",revision:null},{url:"assets/index-F7z_Yzm8.js",revision:null}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))});
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
  Cross-Origin-Resource-Policy: same-origin
  Origin-Agent-Cluster: ?1

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

### `scripts/verify_artifact_consistency.sh`
- **Role:** Validation Script
- **Why it matters:** Checks version invariants across multiple files and confirms security string presences.
- **Inclusion Mode:** Full
```bash
#!/usr/bin/env bash
set -euo pipefail

readme_version=$(sed -n 's|.*Version-\([0-9]\+\.[0-9]\+\.[0-9]\+\)-neon.*|\1|p' README.md)
index_version=$(sed -n 's|.*>v\([0-9]\+\.[0-9]\+\.[0-9]\+\)</div>|\1|p' index.html)
notfound_version=$(sed -n 's|.*>v\([0-9]\+\.[0-9]\+\.[0-9]\+\)</div>|\1|p' 404.html)

[[ -n "$readme_version" && -n "$index_version" && -n "$notfound_version" ]]
[[ "$readme_version" == "$index_version" && "$index_version" == "$notfound_version" ]]

for file in index.html 404.html; do
  grep -q "upgrade-insecure-requests" "$file"
  grep -q "touch-action: manipulation" "$file"
done

grep -q "upgrade-insecure-requests" _headers
grep -q "Cross-Origin-Resource-Policy: same-origin" _headers
grep -q "Origin-Agent-Cluster: ?1" _headers

echo "OK: artifact security/version invariants are consistent (v${readme_version})."
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

### `README.md`
- **Role:** Primary Documentation
- **Why it matters:** Contains version badges (serving as a source of truth without `package.json`) and explicitly declares the lack of source code in the repository.
- **Inclusion Mode:** Excerpt
- **Covered Region:** Header containing version badge and philosophy, followed by the Architectural and Physics update sections.
```markdown
# 🌌 nFIRE: The Singularity Solvency Engine

![Version](https://img.shields.io/badge/Version-10.1.39-neon)
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
...
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
...
```

### `CLAUDE.md`
- **Role:** AI Guidelines
- **Why it matters:** Artifact constraints and AI developer guidelines, explaining the missing source code and update paths.
- **Inclusion Mode:** Excerpt
- **Covered Region:** Important sections detailing Critical Constraints and Technology Stack.
```markdown

**This repository contains ONLY build artifacts, NOT source code.**

The source code (React/Vite project) is maintained separately. This repository serves as the deployment target for GitHub Pages.

### Implications for AI Assistants:

1. **DO NOT** attempt to modify JavaScript bundles (`assets/*.js`) - they are minified/compiled
2. **DO NOT** attempt to add new features requiring JS changes - source is unavailable
3. **DO NOT** modify CSS bundles (`assets/*.css`) - they are compiled from TailwindCSS
4. **CAN** modify: `_headers`, `README.md`, `PARETO_VIA_NEGATIVA_ANALYSIS.md`, documentation files
5. **CAN** add: New static files, documentation, configuration files
...
## Technology Stack (Source Code)

The original source (not in this repo) uses:
- **Framework**: React 18 + Vite
- **State Management**: Zustand + Dexie (IndexedDB)
- **UI**: TailwindCSS + Mantine + Framer Motion
- **Logic Core**: Simulation Engine (Source Only)
- **Tax Rules**: 2025 Rule Set (Source Only)
...
```

### `PARETO_VIA_NEGATIVA_ANALYSIS.md`
- **Role:** Architectural tracking
- **Why it matters:** Outlines Block List requirements.
- **Inclusion Mode:** Excerpt
- **Covered Region:** The Block List section.
```markdown
# PARETO & VIA NEGATIVA ANALYSIS

**Goal:** Maximize Solvency. Minimize Entropy.
**Philosophy:** "It is vain to do with more what can be done with fewer." - Occam

## 🛡️ The Block List (Architectural Constraints)

| Component | Status | Reasoning |
| :--- | :--- | :--- |
| **Source Code** | `BLOCKED` | Repository is a compilation target. Source is maintained externally to enforce "Binary Only" distribution model. |
| **npm / node_modules** | `BLOCKED` | No build process allowed in this environment. Reduces attack surface and dependency rot. |
| **Dynamic Server** | `BLOCKED` | Strictly Static PWA. Zero backend ensures 100% data sovereignty and offline capability. |
| **External CDNs** | `BLOCKED` | "Local Only" privacy mandate. No Google Fonts, no Analytics, no tracking pixels. |
...
```

### `.jules/steward.md`
- **Role:** Developer Logs
- **Why it matters:** Contains historical constraints and required invariants for the AI assistant.
- **Inclusion Mode:** Excerpt
- **Covered Region:** A subset of important recent protocols (e.g. documentation entropy, SVG accessibility).
```markdown
**Insight:** Code blocks in documentation for artifact-only repositories create a maintenance liability as they drift from the compiled reality.
**Protocol:** Documentation should rely on descriptive text rather than executable code blocks in artifact-only environments to prevent misleading users.

## 2026-02-01 - Sentinel - Service Worker Integrity
**Insight:** Modifying `index.html` (even for version bumps) changes its hash, which must be manually updated in `sw.js` to ensure the PWA updates correctly.
**Protocol:** Any modification to precached files in an artifact-only repo requires recalculating the file's MD5 and patching `sw.js`.

## 2026-02-01 - Palette - Documentation Restoration
**Insight:** Referenced architectural trackers (`PARETO_VIA_NEGATIVA_ANALYSIS.md`) that are missing create cognitive load and ambiguity.
**Protocol:** If a referenced hygiene file is missing, its restoration (even if content is inferred) takes priority over new features to re-establish the "Source of Truth".

...
**Protocol:** Inject a MutationObserver script in `index.html` to dynamically apply `aria-hidden="true"` and `focusable="false"` to decorative SVGs at runtime, bridging the accessibility gap without breaking the artifact architecture.

## 2026-03-02 - Palette - Maskable Icon Padding
**Insight:** Android PWA icons (maskable icons) require specific padding to prevent cropping. `pwa-192x192.png` lacked necessary padding.
**Protocol:** When generating `pwa-192x192.png` from `pwa-512x512.png`, ensure 20% padding is applied to meet maskable icon safe zone requirements.
...
```

## Summarized Files
- **`404.html`**: A direct, unmodified clone of `index.html`. Required by GitHub pages to route arbitrary SPA URLs back to the client router without throwing a 404 response.
- **`sitemap.xml`**: Defines the single canonical production URL (`https://shfqrkhn.github.io/nFIRE/`) and its `lastmod` tracking.
- **`_redirects`**: Used by platforms like Netlify/Cloudflare to implement SPA routing. Contains a single rule: `/* /index.html 200`.
- **`assets/*.js`**, **`assets/*.css`**: Minified React application and styling. Source code is completely absent from this repository.
- **`*.png`, `*.ico`**: App icons and screenshots for PWA manifests and SEO/Social tags.

## Cross-File Relationships
- **CSP Parity:** The `Content-Security-Policy` defined in `_headers` must mirror the policy found in the `<meta>` tag of `index.html` (excluding server-only directives like `upgrade-insecure-requests`).
- **Version Synchronization:** Without a `package.json`, versions are manually maintained simultaneously in the footer of `index.html`, `404.html`, the header badge of `README.md`, and the metadata of `CLAUDE.md`. The `verify_artifact_consistency.sh` script enforces this.
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
- **Compression Decisions:** Since `404.html` is exactly identical to `index.html`, it was summarized rather than duplicated in full to preserve document density. Documentation (README, CLAUDE, PARETO, steward) was excerpted to focus purely on the artifact architecture and constraints.
- **Fidelity Limits:** A downstream reviewer cannot assess the mathematical correctness of the financial formulas, the internal React UI component structure, or the tax bracket constants. These are irretrievably obfuscated within the minified assets.
- **Missing/Unreadable Content:** As repeatedly stated, the entirety of the original source code (`src/` directory, `package.json`, test suites) is entirely missing from this deployment repository. Downstream reviews must focus strictly on the delivery, caching, and security wrappers.
