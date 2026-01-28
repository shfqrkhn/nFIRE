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
