# Release Artifact Policy

nFIRE release artifacts may contain only the static planning app, public documentation, public screenshots, and install/runtime assets. User plans and exports must never be bundled.

## Allowed

- Static app shell, PWA assets, public README/screenshot, service worker, headers, sitemap, tests, and artifact-consistency scripts.
- Browser-local planning flows with explicit assumptions and user-controlled export/import.
- Public docs that describe limitations, assumptions, and validation commands.

## Forbidden

- User financial data, exported plans, backups, local storage snapshots, credentials, PII, telemetry, backend services, account flows, `node_modules/`, test output, private planning notes, and local machine paths.
- Claims of financial, investment, tax, legal, retirement, or eligibility advice.
- Claims that results are guarantees, individualized professional recommendations, or official government/benefit determinations.

## Release Claims

- Allowed: static local-first planning aid, Canadian-style planning assumptions, year-by-year solvency illustration, browser-local data, and explicit disclaimers.
- Not claimed unless separately evidenced: professional advice, eligibility determination, tax/legal correctness, live market-data freshness, external review, or regulated planning certification.

## Verification

Before publishing release assets, run:

```bash
npm test
bash scripts/verify_artifact_consistency.sh
git diff --check
```

Release review must verify the ZIP has no user data, backups, private notes, or advice/guarantee language.
