# AI Maintainer Handoff

Last updated: 2026-07-20.
Repo: `D:\VSCode\GH\nFIRE`.

Treat this as a public-safe continuation map. Re-read current files before editing.

## Mission

Maintain nFIRE as the finance and solvency-planning flagship. It must stay static-hostable, local-first, transparent about assumptions, and clear that it is a planning aid rather than financial, tax, legal, investment, or retirement advice.

## Product Contract

- Model long-term financial independence and solvency with explicit year-by-year assumptions.
- Keep planning data local to the browser.
- Preserve Canadian-style planning orientation unless the repo deliberately expands scope.
- Keep outputs explainable and assumption-driven, not advisory or guaranteed.
- Keep repository ZIP/download contents minimal and public-safe.
- Keep `CivicSourceGraphCanada` as a separate trust-sensitive project. Share only deliberately reusable, public-safe patterns or explicit data contracts; do not fold civic eligibility, source-ledger, or remedy workflows into nFIRE.
- Do not determine eligibility, file claims, provide legal/tax/financial advice, handle money, or collect sensitive personal data by default.
- Do not imply that nFIRE determines eligibility or provides a civic-source handoff. The separate Civic project owns those boundaries.

## OmniOS Transfer Contract

- Product truth: static local-first planning aid, not financial, tax, legal, investment, retirement, or eligibility advice.
- Execution truth: preserve assumption, artifact-consistency, static, export/import, and disclaimer gates before publishing.
- Evidence truth: use `docs/EVIDENCE_RECEIPT.md`, visible assumptions, artifact checks, and tests; public claims must stay within `PASS` or `PASS_WITH_LIMITATIONS`.
- Operations truth: live Pages or current main repository ZIP are the only distribution paths; GitHub Releases stay absent.
- Reliability truth: keep planning, assumption, export/import, reset, and artifact paths self-checking, crash-recoverable, state-explicit, modular, maintainable, simple, one-input accessible, and TDD/SDD-backed; remove complexity that does not improve resilience or usability.
- Ecosystem truth: follow the shared signature design system in `shfqrkhn/.github/docs/SIGNATURE_DESIGN_SYSTEM.md` for public UI/UX changes; adapt it to planning-aid explainability rather than copying components blindly.
- Design truth: keep UI changes modern minimalist, utilitarian, professional, joyful, responsive, and contextual to planning-aid workflows; use local CSS/tokens and native controls first, treat MIT UI libraries/resources as inspiration only unless a source-backed need justifies a dependency, and reject browser JS popups, blocking overlays, overlapping components, inaccessible controls, unbounded motion, or arbitrary component copy-paste.
- Single input truth: after setup, critical planning workflows must remain fully operable by keyboard only, mouse/pointer only, touch only, or platform-limited input only; never require a combined input-mode path.
- Transfer truth: update this handoff and the evidence receipt when assumptions, calculations, disclaimers, artifacts, or public-surface guarantees change.

## Doctrine Delta Decision

- After incidents, rescue runs, maturity passes, or repeated failures, classify reusable lessons as `promote`, `reject`, `quarantine`, or `keep_local`.
- Promote only source-backed, reusable, non-secret lessons that strengthen a gate, checklist, source rule, or failure guard without weakening planning-aid boundaries.
- Keep private, project-specific, speculative, or unverified lessons out of public repos unless the user explicitly approves publication.

## Key Files

- `index.html`: static app entrypoint.
- `assets/`: app assets.
- `scripts/`: validation and public ZIP consistency scripts.
- `manifest.webmanifest`: install metadata.
- `sw.js`: service worker.
- `screenshot-main.png`: README/demo image.
- `README.md`: public positioning, disclaimer, and usage.
- Private Civic SourceGraph planning references may exist in the local GH workspace docs bundle; do not publish or copy them by default.

## Required Checks

Run after material changes:

```bash
npm run qa
```

`npm run qa` covers static regression, artifact consistency, and Playwright UI smoke checks. Also perform link/media checks, a secret scan, and live Pages checks before public ZIP/download-facing or Pages updates.

## Known Continuation Priorities

1. Preserve financial disclaimer clarity.
2. Keep assumptions visible and testable.
3. Improve onboarding only when it reduces user error.
4. Keep the separate Civic project out of nFIRE's runtime and public claims; coordinate only through explicit, reviewed, public-safe contracts when a real integration need exists.
5. Preserve nFIRE's finance-planning scope and do not import Civic's missed-money, access-handoff, recall/remedy, or source-ledger responsibilities.
