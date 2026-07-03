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
- Keep release artifacts minimal and public-safe.
- Preserve the future path toward Civic SourceGraph Canada only when it strengthens official-source, household-impact, missed-money prevention, and remedy/access handoff workflows.

## Key Files

- `index.html`: static app entrypoint.
- `assets/`: app assets.
- `scripts/`: validation and release consistency scripts.
- `manifest.webmanifest`: install metadata.
- `sw.js`: service worker.
- `screenshot-main.png`: README/demo image.
- `README.md`: public positioning, disclaimer, and usage.

## Required Checks

Run after material changes:

```bash
npm test
bash scripts/verify_artifact_consistency.sh
```

Also perform link/media checks, a secret scan, and local/static smoke checks before release or Pages updates.

## Known Continuation Priorities

1. Preserve financial disclaimer clarity.
2. Keep assumptions visible and testable.
3. Improve onboarding only when it reduces user error.
4. If evolving toward Civic SourceGraph Canada, keep nFIRE's solvency logic as one module inside a broader official-source workflow rather than bolting on unrelated civic features.
