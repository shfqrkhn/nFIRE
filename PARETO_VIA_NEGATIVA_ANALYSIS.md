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
| **JS/CSS Bundles** | `BLOCKED` | Minified artifacts cannot be safely modified or tree-shaken without source. |

## 📉 Entropy Reduction Log (Via Negativa)

| Issue | Status | Notes |
| :--- | :--- | :--- |
| Build artifacts in git | `BLOCKED` | Source code missing. |
| JS bundle size (1MB+) | `BLOCKED` | Requires source code. |
| Font optimization | `DONE` | External fonts removed. |
| Duplicate artifacts | `DONE` | Cleaned up. |
| PWA overhead | `KEPT` | Provides offline capability. |
| Screenshot naming | `DONE` | Renamed to descriptive name. |
| **Documentation Entropy** | `DONE` | Restored missing `PARETO_VIA_NEGATIVA_ANALYSIS.md`. |
