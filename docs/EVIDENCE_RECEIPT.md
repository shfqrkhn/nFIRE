# Evidence Receipt

This public-safe receipt keeps nFIRE claims tied to evidence instead of chat history.

## Evidence Classes

- `PASS`: directly covered by current files, tests, or checks.
- `PASS_WITH_LIMITATIONS`: true only within the stated scope.
- `NOT_RUN`: not checked in the current pass.
- `BLOCKED`: cannot be checked until an external condition changes.
- `NO_GO`: failed or unsafe; do not publish until fixed.

## Claim Firewall Invariant

- Every public technical, security, privacy, download, finance, planning, tax, legal, retirement, or eligibility claim must map to a `Claim Boundaries` row or be added with evidence before publication.
- Public claims may not exceed `PASS` or `PASS_WITH_LIMITATIONS`; `NOT_RUN`, `BLOCKED`, and `NO_GO` items must stay unpublished or be labeled as unavailable.
- Volatile assumptions, policy, financial, tax, legal, retirement, eligibility, and GitHub settings must be rechecked from current source/repo state before reliance.

## Currentness Watchdog

- Recheck claim evidence before public-facing changes, not on a fixed calendar.
- If current evidence is stale, missing, inaccessible, or contradicted by assumption/source/repo/GitHub state, downgrade the affected claim to `NOT_RUN`, `BLOCKED`, or `NO_GO`.
- Do not preserve old status snapshots as proof after assumptions, calculations, disclaimers, artifacts, workflows, or public planning wording changes.

## Safe-To-Publish Receipt

- Mark this repo safe to publish only when the current pass proves a clean synced tree, no GitHub Releases, no protected tracked paths, no open secret/dependabot/code-scanning alerts or a documented code-scanning not-applicable/no-analysis state, passing required gates, and working live or repository-ZIP distribution surface.
- Runtime app code scanning uses `.github/workflows/codeql.yml` with CodeQL JavaScript analysis; missing or failed analysis must be reported as `PASS_WITH_LIMITATIONS`, `NOT_RUN`, or `NO_GO`.
- If any proof is missing, stale, or contradicted by GitHub/repo/assumption state, record the repo as `PASS_WITH_LIMITATIONS`, `NOT_RUN`, `BLOCKED`, or `NO_GO` instead of safe.
- The final status table must name remaining risks rather than implying safety from silence.

## Input Accessibility Evidence

- Critical planning workflows must remain usable by keyboard-only, mouse/pointer-only, and touch-only users.
- Accessibility claims require current evidence from static control checks, touch-action checks, focus/label review, and live/manual verification where applicable.
- If a workflow lacks direct input-mode coverage, label it `PASS_WITH_LIMITATIONS` or `NOT_RUN`; do not claim full accessibility from static rendering alone.

## Recovery And Data Safety Evidence

- Export, backup, reset, browser-storage, and recovery claims must remain user-controlled, local-first, and tied to current tests or explicit manual evidence.
- Recovery claims may cover documented export/backup expectations and artifact safety only within tested paths; they must not imply professional recordkeeping, cloud backup, or reconstruction after browser data loss.
- If a storage, export/import, or recovery path is not covered in the current pass, label it `PASS_WITH_LIMITATIONS` or `NOT_RUN` before public use.

## Assumption And Explainability Evidence

- Assumption, tax, pension, inflation, return, drawdown, or solvency claims must remain user-editable planning inputs or transparent calculations; they are not professional review, advice, eligibility screening, or a guarantee.
- Public wording may claim year-by-year explainability only when outputs can be traced to visible inputs, documented formulas, and current artifact-consistency checks.
- External policy, benefit, tax, or market references are not evidence for app claims until their source, freshness, limitation, and failure behavior are documented; stale or unverified references must be labeled as assumptions or omitted.

## Claim Boundaries

| Area | Class | Evidence | Limit |
| --- | --- | --- | --- |
| Static local-first planner | `PASS` | README, app shell, service worker, static tests | Browser storage and export handling remain user-controlled. |
| Planning aid only | `PASS` | README, app disclaimer, static tests | No financial, tax, legal, investment, retirement, or eligibility advice. |
| Explicit assumptions | `PASS_WITH_LIMITATIONS` | README, app flow, static tests, assumption/explainability evidence | Assumption correctness is not a professional review or external policy verification. |
| Year-by-year solvency illustration | `PASS_WITH_LIMITATIONS` | app behavior, documented formulas, artifact checks | Results are illustrations, not guarantees, advice, or regulated determinations. |
| Repository ZIP safety | `PASS_WITH_LIMITATIONS` | `docs/REPO_ZIP_POLICY.md`, artifact consistency script | Recheck no user plans, exports, PII, backups, or private notes are bundled. |
| Input accessibility | `PASS_WITH_LIMITATIONS` | static touch-friendly checks and manual/live verification when performed | Does not certify screen-reader behavior or every input path. |
| Recovery/data safety | `PASS_WITH_LIMITATIONS` | README export/backup guidance, static tests, artifact consistency script | Does not guarantee recovery after local browser data loss. |

## Required Before Public-Facing Change

- `git status --short --ignored`
- `git rev-list --left-right --count 'HEAD...@{u}'`
- `gh release list --limit 5` returns no releases
- `npm run qa`
- `git diff --check`
- protected-path scan
- live Pages check after runtime or public-surface changes
