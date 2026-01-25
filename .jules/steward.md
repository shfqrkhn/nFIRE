## 2025-01-24 - Sentinel - Artifact-Only Architecture
**Insight:** Repository contains only build artifacts; source code is missing. Modifying precached files (index.html) breaks Service Worker integrity.
**Protocol:** Implement security and performance fixes via deployment configuration (_headers) or new files, avoiding modification of signed artifacts.

## 2026-01-25 - Sentinel - External Dependency Audit
**Insight:** External fonts (Google Fonts) violated "Via Negativa" privacy and "offline-first" principles, creating a tracking vector and blocking render.
**Protocol:** Remove external dependencies even if it causes minor visual regression, prioritizing privacy and performance over aesthetic polish in artifact-only environments where local replacement is difficult.

## 2026-01-25 - Bolt - Orphaned Artifact Cleanup
**Insight:** Build process drift left 1.2MB of unused JS/CSS artifacts in production, inflating deployment size and confusing potential future audits.
