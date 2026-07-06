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

- After setup, critical planning workflows must remain fully usable with one available input mode: keyboard only, mouse/pointer only, touch only, or platform-limited input only.
- No critical workflow may require a combined keyboard-plus-pointer, keyboard-plus-touch, hover-plus-keyboard, drag-plus-keyboard, or browser-popup path.
- Accessibility claims require current evidence from static control checks, touch-action checks, focus/label review, Playwright UI smoke coverage, platform text-entry support, and live/manual verification where applicable.
- If keyboard-only, mouse-only, touch-only, or platform-limited operation is not directly covered, label it `PASS_WITH_LIMITATIONS` or `NOT_RUN`; do not claim full accessibility from static rendering alone.

## Design Language Evidence

- UI changes must preserve a modern minimalist, utilitarian, professional, joyful, responsive, planning-aid-contextual design language with local CSS/tokens, semantic native controls, visible focus, reduced-motion-safe transitions, no horizontal overflow, and no component overlap.
- Signature Ecosystem Evidence: nFIRE must look and feel like part of the shared `shfqrkhn` ecosystem while staying contextual to assumption clarity, year-by-year planning, and planning-aid disclaimers.
- MIT UI libraries/resources such as Uiverse, Open Props, Primer, Radix Colors, Pico CSS, Heroicons, Bootstrap Icons, Floating UI, or A11y Dialog are inspiration sources only unless a source-backed, license-checked, tested need justifies a dependency.
- Reject browser JS popups, blocking overlays, arbitrary component copy-paste, mixed visual systems, unbounded animation, external CDNs, or styling that makes assumptions, disclaimers, or solvency evidence less clear.

## Recovery And Data Safety Evidence

- Export, backup, reset, browser-storage, and recovery claims must remain user-controlled, local-first, and tied to current tests or explicit manual evidence.
- Recovery claims may cover documented export/backup expectations and artifact safety only within tested paths; they must not imply professional recordkeeping, cloud backup, or reconstruction after browser data loss.
- If a storage, export/import, or recovery path is not covered in the current pass, label it `PASS_WITH_LIMITATIONS` or `NOT_RUN` before public use.

## Mission-Critical Reliability Evidence

- Critical planning workflows must stay self-checking, crash-recoverable, state-explicit, modular, maintainable, simple, one-input accessible, and TDD/SDD-backed.
- Runtime failures must fail closed with visible in-app status, preserved local user control, no browser popup APIs, no hidden upload, and no advice or eligibility escalation.
- New complexity is acceptable only when it directly improves resilience, usability, assumption clarity, state recovery, or maintainability and is covered by current tests or explicit evidence.
- Autonomous AI-assisted development must start from current files, add or update tests before broad calculation or artifact changes, keep claims inside evidence boundaries, and leave a reproducible recovery path.

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
| Repository ZIP safety | `PASS_WITH_LIMITATIONS` | `docs/REPO_ZIP_POLICY.md`, `git archive`, artifact consistency script | Recheck no user plans, exports, PII, backups, or private notes are bundled. |
| Input accessibility | `PASS_WITH_LIMITATIONS` | static touch-friendly checks, Playwright keyboard/focus/name checks, and manual/live verification when performed | Does not certify screen-reader behavior or every input path. |
| Single input operation | `PASS_WITH_LIMITATIONS` | input accessibility evidence, Playwright pointer/keyboard/touch smoke paths, no browser popup policy | Does not certify every OS assistive technology or unusual HID/browser pairing. |
| Design language/UI safety | `PASS_WITH_LIMITATIONS` | handoff/evidence docs, static tests, artifact checks, Playwright overflow/control checks, visual/manual checks where run | Does not certify every viewport or assistive technology; planning surfaces may stay denser than portfolio surfaces. |
| Signature ecosystem fit | `PASS_WITH_LIMITATIONS` | shared signature design system reference, design evidence, static/artifact/UI smoke tests | Does not require identical UI components; planning tables and explainability panels remain domain-specific. |
| Recovery/data safety | `PASS_WITH_LIMITATIONS` | README export/backup guidance, static tests, artifact consistency script, Playwright export/import/reload smoke path | Does not guarantee recovery after local browser data loss. |
| Mission-critical reliability | `PASS_WITH_LIMITATIONS` | mission-critical reliability evidence, static/artifact/UI smoke tests | Does not provide financial advice, professional review, guaranteed outcomes, cloud backup, or regulated-grade infrastructure. |

## Required Before Public-Facing Change

- `git status --short --ignored`
- `git rev-list --left-right --count 'HEAD...@{u}'`
- `gh release list --limit 5` returns no releases
- `npm run qa`
- `git diff --check`
- protected-path scan
- live Pages check after runtime or public-surface changes
