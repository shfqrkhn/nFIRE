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

- Mark this repo safe to publish only when the current pass proves a clean synced tree, no GitHub Releases, no protected tracked paths, no open security/dependabot alerts, passing required gates, and working live or repository-ZIP distribution surface.
- If any proof is missing, stale, or contradicted by GitHub/repo/assumption state, record the repo as `PASS_WITH_LIMITATIONS`, `NOT_RUN`, `BLOCKED`, or `NO_GO` instead of safe.
- The final status table must name remaining risks rather than implying safety from silence.

## Claim Boundaries

| Area | Class | Evidence | Limit |
| --- | --- | --- | --- |
| Static local-first planner | `PASS` | README, app shell, service worker, static tests | Browser storage and export handling remain user-controlled. |
| Planning aid only | `PASS` | README, app disclaimer, static tests | No financial, tax, legal, investment, retirement, or eligibility advice. |
| Explicit assumptions | `PASS_WITH_LIMITATIONS` | README, app flow, static tests | Assumption correctness is not a professional review. |
| Year-by-year solvency illustration | `PASS_WITH_LIMITATIONS` | app behavior and tests | Results are illustrations, not guarantees or regulated determinations. |
| Repository ZIP safety | `PASS_WITH_LIMITATIONS` | `docs/REPO_ZIP_POLICY.md`, artifact consistency script | Recheck no user plans, exports, PII, backups, or private notes are bundled. |

## Required Before Public-Facing Change

- `git status --short --ignored`
- `git rev-list --left-right --count HEAD..."@{u}"`
- `npm test`
- `bash scripts/verify_artifact_consistency.sh`
- `git diff --check`
- protected-path scan
- live Pages check after runtime or public-surface changes
