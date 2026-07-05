# AI Maintainer Handoff

Last updated: 2026-07-03.
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
- Preserve the future path toward Civic SourceGraph Canada only when it strengthens official-source, household-impact, missed-money prevention, and remedy/access handoff workflows.
- Do not determine eligibility, file claims, provide legal/tax/financial advice, handle money, or collect sensitive personal data by default.
- Keep any civic evolution official-source-led, privacy-first, static-first, source-freshness-aware, and clear that the app is an unofficial handoff aid.

## OmniOS Transfer Contract

- Product truth: static local-first planning aid, not financial, tax, legal, investment, retirement, or eligibility advice.
- Execution truth: preserve assumption, artifact-consistency, static, export/import, and disclaimer gates before publishing.
- Evidence truth: use `docs/EVIDENCE_RECEIPT.md`, visible assumptions, artifact checks, and tests; public claims must stay within `PASS` or `PASS_WITH_LIMITATIONS`.
- Operations truth: live Pages or current main repository ZIP are the only distribution paths; GitHub Releases stay absent.
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

Also perform link/media checks, a secret scan, and local/static smoke checks before public ZIP/download-facing or Pages updates.

## Known Continuation Priorities

1. Preserve financial disclaimer clarity.
2. Keep assumptions visible and testable.
3. Improve onboarding only when it reduces user error.
4. If evolving toward Civic SourceGraph Canada, keep nFIRE's solvency logic as one module inside a broader official-source workflow rather than bolting on unrelated civic features.
5. Preserve missed-money prevention, access handoff, recall/remedy handoff, official-source provenance, and no-sensitive-data rules if that evolution proceeds.
