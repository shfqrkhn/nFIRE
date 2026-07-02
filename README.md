# nFIRE

Deterministic financial independence and solvency engine.

- **Status:** Active flagship
- **Live Demo:** [shfqrkhn.github.io/nFIRE](https://shfqrkhn.github.io/nFIRE/)
- **Portfolio Role:** Finance and planning flagship.

nFIRE models long-term financial independence with explicit year-by-year assumptions instead of hiding the plan behind a simple rule of thumb.

## Screenshot

![nFIRE financial independence dashboard](./screenshot-main.png)

## Why This Exists

Simple FIRE calculators often ignore tax brackets, pension timing, registered-account behavior, and sequence details. nFIRE aims to make those assumptions visible and testable for Canadian-style planning workflows.

## What It Does

- Projects financial solvency year by year.
- Supports structured assumptions for retirement, pensions, drawdowns, and taxes.
- Keeps planning data local to the browser.
- Provides a focused workflow for testing retirement feasibility.
- Offers installable/static app behavior through GitHub Pages.

## Quick Start

1. Open the live demo.
2. Enter the core household and financial assumptions.
3. Review the solvency output.
4. Adjust pension, retirement, and drawdown assumptions.
5. Save or export results according to the app workflow.

## Privacy And Data Model

- Financial inputs stay local to the browser.
- No account or backend is required for normal use.
- Users should export or back up local data before clearing browser storage.

## Relationship To Other Projects

nFIRE is the finance flagship. `TS-Dash` remains a stable time-series dashboard utility; finance-specific planning and solvency workflows belong here.

## Repository Layout

```text
.
├── index.html
├── assets/
├── scripts/
├── manifest.webmanifest
├── sw.js
└── screenshot-main.png
```

## Deployment

Host the repository root on GitHub Pages. The app is static and can also be previewed locally with a simple HTTP server.

## Maintenance

Keep financial assumptions explicit, version visible changes, and avoid implying regulated financial advice. Treat outputs as planning aids, not guarantees.

## License

See `LICENSE`.
