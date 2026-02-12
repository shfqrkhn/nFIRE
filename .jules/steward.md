## 2025-01-24 - Sentinel - Artifact-Only Architecture
**Insight:** Repository contains only build artifacts; source code is missing. Modifying precached files (index.html) breaks Service Worker integrity.
**Protocol:** Implement security and performance fixes via deployment configuration (_headers) or new files, avoiding modification of signed artifacts.

## 2026-01-25 - Sentinel - External Dependency Audit
**Insight:** External fonts (Google Fonts) violated "Via Negativa" privacy and "offline-first" principles, creating a tracking vector and blocking render.
**Protocol:** Remove external dependencies even if it causes minor visual regression, prioritizing privacy and performance over aesthetic polish in artifact-only environments where local replacement is difficult.

## 2026-01-25 - Bolt - Orphaned Artifact Cleanup
**Insight:** Build process drift left 1.2MB of unused JS/CSS artifacts in production, inflating deployment size and confusing potential future audits.

## 2026-01-26 - Sentinel - CSP Synchronization
**Insight:** Client-side CSP (meta tag) drifted from server-side headers (_headers), creating a potential security gap if headers are stripped.
**Protocol:** Enforce parity between _headers and index.html CSP meta tags, specifically base-uri and object-src, while excluding environment-specific directives like upgrade-insecure-requests.

## 2026-01-27 - Palette - Critical Path Loading
**Insight:** 1MB+ JS bundle caused significant blank screen time. React root was empty by default.
**Protocol:** Embed critical-path loading state (HTML/CSS) directly in `#root` to bridge the network/parsing gap before hydration.

## 2026-01-27 - Palette - Accessible Loading State
**Insight:** Loading state was purely visual and invisible to screen readers.
**Protocol:** All loading/status indicators must carry `role="status"` and `aria-live="polite"` to ensure inclusivity.

## 2026-01-27 - Palette - iOS Zoom Fix
**Insight:** Rapid interaction on iOS triggers double-tap zoom, breaking app-like feel.
**Protocol:** Apply `touch-action: manipulation` to all interactive elements globally via CSS in `index.html`.

## 2026-01-27 - Bolt - Diagnostic Simulation
**Insight:** Comprehensive simulation (runtime diagnostics) confirmed stable hydration and zero network errors.
**Protocol:** Version bumps must be synchronized across `index.html`, `README.md`, and `sw.js`.

## 2026-01-27 - Sentinel - Version Authority Protocol
**Insight:** `package.json` is missing in this artifact-only repository.
**Protocol:** The "Sync Mandate" is adjusted: Version Source of Truth is strictly `index.html` (embedded footer) and `README.md` (badges). `package.json` checks are skipped.

## 2026-01-28 - Sentinel - Source Code Missing
**Insight:** Repository contains only build artifacts; source code is absent.
**Protocol:** Architectural fixes (e.g. tree-shaking, removing dist/ from git) are BLOCKED by missing source. Document this to prevent future churn.

## 2026-01-29 - Palette - Documentation Entropy
**Insight:** Code blocks in documentation for artifact-only repositories create a maintenance liability as they drift from the compiled reality.
**Protocol:** Documentation should rely on descriptive text rather than executable code blocks in artifact-only environments to prevent misleading users.

## 2026-02-01 - Sentinel - Service Worker Integrity
**Insight:** Modifying `index.html` (even for version bumps) changes its hash, which must be manually updated in `sw.js` to ensure the PWA updates correctly.
**Protocol:** Any modification to precached files in an artifact-only repo requires recalculating the file's MD5 and patching `sw.js`.

## 2026-02-01 - Palette - Documentation Restoration
**Insight:** Referenced architectural trackers (`PARETO_VIA_NEGATIVA_ANALYSIS.md`) that are missing create cognitive load and ambiguity.
**Protocol:** If a referenced hygiene file is missing, its restoration (even if content is inferred) takes priority over new features to re-establish the "Source of Truth".

## 2026-02-02 - Palette - Meta-Documentation Sync
**Insight:** `CLAUDE.md` version reference drifted from the artifact version.
**Protocol:** `CLAUDE.md` must be treated as a versioned artifact and synchronized with `index.html` during every release cycle.

## 2026-02-07 - Palette - Client-Side Routing Consistency
**Insight:** `404.html` (the fallback for SPA routing on GitHub Pages) drifted from `index.html` (v10.1.12 vs v10.1.13), potentially serving stale content on subpaths.
**Protocol:** `404.html` must be an exact copy of `index.html` and synchronized during every version bump.

## 2026-02-08 - Palette - Loading State Enhancement
**Insight:** Static loading text lacked liveliness and reassurance.
**Protocol:** Implement subtle CSS animations for loading states to improve perceived performance without adding asset weight.

## 2026-02-12 - Palette - PWA Metadata & Caching
**Insight:** iOS PWA experience was degraded (generic title) and SPA routing on GitHub Pages risked stale content due to default caching on 404.html.
**Protocol:** Explicitly define `apple-mobile-web-app-title` in HTML and `Cache-Control: public, max-age=0` for `404.html` in `_headers` to ensure consistent app-like behavior and fresh routing.
