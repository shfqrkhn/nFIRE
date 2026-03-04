# CLAUDE.md - AI Assistant Guide for nFIRE

## Project Overview

**nFIRE** (The Singularity Solvency Engine) is a deterministic financial independence calculator designed for Canadian users. It simulates financial life year-by-year, enforcing Canadian progressive tax brackets, RRSP meltdowns, and Defined Benefit pension calculations.

- **Version**: 10.1.35
- **License**: MIT
- **Live Demo**: https://shfqrkhn.github.io/nFIRE/
- **Privacy**: All data stored locally (no server communication)

---

## Critical Constraint: Artifact-Only Repository

**This repository contains ONLY build artifacts, NOT source code.**

The source code (React/Vite project) is maintained separately. This repository serves as the deployment target for GitHub Pages.

### Implications for AI Assistants:

1. **DO NOT** attempt to modify JavaScript bundles (`assets/*.js`) - they are minified/compiled
2. **DO NOT** attempt to add new features requiring JS changes - source is unavailable
3. **DO NOT** modify CSS bundles (`assets/*.css`) - they are compiled from TailwindCSS
4. **CAN** modify: `_headers`, `README.md`, `PARETO_VIA_NEGATIVA_ANALYSIS.md`, documentation files
5. **CAN** add: New static files, documentation, configuration files
6. Service Worker (`sw.js`) caches specific file hashes - modifying cached files breaks integrity

---

## Repository Structure

The `nFIRE` directory contains the main entry point `index.html`, along with compiled application assets (`assets/` directory with JS and CSS). It also includes the PWA manifest `manifest.webmanifest`, the Service Worker `sw.js` built with Workbox, HTTP security headers configured in `_headers`, application icons, screenshots, and various documentation files including `README.md`, `CLAUDE.md`, and an optimization analysis log `PARETO_VIA_NEGATIVA_ANALYSIS.md`. Additionally, an AI assistant protocol file is located in `.jules/steward.md`.

---

## Technology Stack (Source Code)

The original source (not in this repo) uses:
- **Framework**: React 18 + Vite
- **State Management**: Zustand + Dexie (IndexedDB)
- **UI**: TailwindCSS + Mantine + Framer Motion
- **Logic Core**: Simulation Engine (Source Only)
- **Tax Rules**: 2025 Rule Set (Source Only)

---

## Version Management

**Source of Truth**: `index.html` (embedded footer) and `README.md` (badges)

No `package.json` exists in this artifact repository. Version sync must be manual:
- `index.html`: Line containing `v10.1.35` in the footer div
- `README.md`: Badge in header `Version-10.1.35`

---

## Security Configuration

### Content Security Policy (CSP)

Enforced in two locations (must stay synchronized):

1. **`index.html`** - Meta tag (client-side)
2. **`_headers`** - HTTP headers (server-side)

Current policy:
The default source is restricted to 'self', with scripts allowed from 'self' and specific SHA-256 hashes for inline scripts. Styles are allowed from 'self' and 'unsafe-inline', while fonts, images (including data URIs), connections, workers, manifests, and the base URI are restricted to 'self'. Object sources and frame ancestors are set to 'none', and form actions are restricted to 'self'.

### HTTP Headers (`_headers`)

Strict security headers configured:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=31536000`
- `Permissions-Policy`: Denies camera, microphone, geolocation, payment, etc.

---

## PWA Architecture

### Service Worker (`sw.js`)

- Built with Workbox
- Precaches: `index.html`, `manifest.webmanifest`, `pwa-512x512.png`, CSS, JS
- Uses revision hashes for cache invalidation
- NavigationRoute serves `index.html` for all routes

### Manifest (`manifest.webmanifest`)

- Display: standalone
- Theme: `#050505` (dark)
- Categories: finance, productivity, utilities

---

## Development Workflows

### What You CAN Do

1. **Update documentation**: README.md, analysis files, this file
2. **Modify security headers**: `_headers` file
3. **Add new static assets**: Images, documents
4. **Update version references**: In README.md and index.html footer
5. **CSP adjustments**: Both in `_headers` and `index.html` meta tag

### What You CANNOT Do

1. Modify application logic (source code missing)
2. Fix bugs in JavaScript (compiled/minified)
3. Add new features requiring code changes
4. Tree-shake or optimize bundles
5. Remove build artifacts from git history (architectural decision)

---

## Key Conventions

### Commit Messages

Recent commit patterns:
- `[Optimization] (v10.1.9)` - Performance improvements
- `[Enhancement] (v10.1.8)` - Feature additions
- `[Critical Fix] (v10.1.6)` - Bug fixes

### File Modifications

When modifying cached files (rare):
1. Update the file
2. The Service Worker will serve stale content until cache expires
3. Users may need to hard refresh or clear cache

### CSP Changes

If adding inline scripts or new resources:
1. Generate SHA-256 hash of inline script content
2. Add hash to both `index.html` CSP meta tag AND `_headers`
3. Test in browser console for CSP violations

---

## Known Issues & Constraints

From `PARETO_VIA_NEGATIVA_ANALYSIS.md`:

| Issue | Status | Notes |
|-------|--------|-------|
| Build artifacts in git | BLOCKED | Source code missing |
| JS bundle size (1MB+) | BLOCKED | Requires source code |
| Font optimization | DONE | External fonts removed |
| Duplicate artifacts | DONE | Cleaned up |
| PWA overhead | KEPT | Provides offline capability |
| Screenshot naming | DONE | Renamed to descriptive name |

---

## AI Assistant Protocols

From `.jules/steward.md`:

1. **Artifact-Only Architecture**: Implement fixes via `_headers` or new files, not by modifying compiled artifacts
2. **External Dependency Removal**: Prioritize privacy and performance over aesthetics
3. **CSP Synchronization**: Keep `_headers` and `index.html` CSP in parity
4. **Accessible Loading States**: Use `role="status"` and `aria-live="polite"`
5. **Version Authority**: Source of truth is `index.html` footer and `README.md` badges
6. **Documentation Entropy**: Avoid executable code blocks in documentation; use descriptive text to prevent drift

---

## Useful Commands

To view the repository structure, list all files including hidden ones. To check the current version, search for "v10" recursively across `index.html` and `README.md`. To validate the PWA manifest JSON format, use Python's built-in `json.tool`. Finally, to check for CSP mismatches between client-side and server-side configurations, compare the `Content-Security-Policy` lines from `_headers` and `index.html`.

---

## Contact & Resources

- **Repository**: https://github.com/shfqrkhn/nFIRE
- **Live App**: https://shfqrkhn.github.io/nFIRE/
- **Author**: S. R. Khan

---

*Last updated: 2026-03-01 | Version: 10.1.35*
