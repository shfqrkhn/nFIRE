# Financial Model Assumptions

Last updated: 2026-07-21. Runtime model source: `src/model-runtime.js`.

nFIRE is a deterministic planning aid, not financial, investment, tax, legal, retirement, actuarial, or eligibility advice. These formulas were recovered from the v10.1.40 browser artifact. They have regression coverage but have not been professionally validated.

## Policy basis and limits

- The runtime labels its constants as 2024: federal brackets, a federal basic personal amount of $15,705, selected provincial brackets for ON/AB/BC/NS, RRSP limit of 18% capped at $32,490, TFSA room of $7,000, OAS recovery threshold of $90,997, and YMPE of $68,500.
- The simplified tax calculation applies federal and selected provincial marginal brackets, then subtracts only a federal first-rate basic-personal-amount credit. It omits many real credits, deductions, surtaxes, premiums, benefit interactions, and jurisdiction-specific rules.
- CPP and OAS amounts are user inputs. OAS begins at 65 and is reduced by 15% of modelled taxable pension income above the threshold, capped at the OAS amount. This is illustrative, not an eligibility determination.
- Formula pensions use credited years `min(max(reference age - career start age, 0), 35)`, accrual rate, and best-average earnings. The optional bridge is `credited years × 0.00625 × YMPE` until age 65. Fixed pensions use user-entered values.

## Projection order

1. Before retirement, annual savings fill TFSA room, then RRSP room, then the non-registered account.
2. In retirement, spending is offset by pension/bridge, CPP, and OAS, then withdrawn from TFSA, non-registered assets, and RRSP in that order.
3. RRSP withdrawals are iteratively grossed up for incremental simplified tax, stopping after 10 iterations or when the change is below $1.
4. RRSP and TFSA receive the selected annual growth. Non-registered assets receive `max(0, growth rate - tax drag)`.
5. Solvency is tested annually through `max(lifespan, current age + 1)`. A remaining need over $100 with every account at or below $1 is insolvent.

The chart's `netWorth` is the opening balance for each model year, while its account fields are closing balances after that year's transaction and growth. This recovered convention is retained for artifact compatibility.

## Reproducibility

`npm run build:model` injects the readable model source into the pinned v10.1.40 UI artifact between generated markers and updates its service-worker revision. `npm run verify:model` rebuilds both in memory and fails on drift. `npm test` runs tax, pension, account-order, OAS-clawback, boundary, and solvency golden vectors.

The original React/UI source and build manifest are absent from all reachable and dangling repository history. The minified UI shell therefore remains a pinned artifact, not maintainable model source. Replacing that shell requires recovery from its original authoring environment or a separately approved UI rebuild; this limitation must remain explicit.
