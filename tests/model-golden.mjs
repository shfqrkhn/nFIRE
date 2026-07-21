import assert from "node:assert/strict";

await import("../src/model-runtime.js");

class TestDecimal {
  constructor(value) {
    this.value = value instanceof TestDecimal ? value.value : Number(value);
  }
  plus(value) { return new TestDecimal(this.value + new TestDecimal(value).value); }
  minus(value) { return new TestDecimal(this.value - new TestDecimal(value).value); }
  times(value) { return new TestDecimal(this.value * new TestDecimal(value).value); }
  div(value) { return new TestDecimal(this.value / new TestDecimal(value).value); }
  abs() { return new TestDecimal(Math.abs(this.value)); }
  lt(value) { return this.value < new TestDecimal(value).value; }
  lte(value) { return this.value <= new TestDecimal(value).value; }
  gt(value) { return this.value > new TestDecimal(value).value; }
  toNumber() { return this.value; }
  static min(...values) { return new TestDecimal(Math.min(...values.map((value) => new TestDecimal(value).value))); }
  static max(...values) { return new TestDecimal(Math.max(...values.map((value) => new TestDecimal(value).value))); }
}

const { createEngine, defaultProfile } = globalThis.nFIREModelSource;
const engine = createEngine(TestDecimal, { currentYear: () => 2026 });
const closeTo = (actual, expected, tolerance = 1e-6) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `Expected ${actual} to be within ${tolerance} of ${expected}`);
};
const profile = (overrides = {}) => ({
  ...structuredClone(defaultProfile),
  ...overrides,
  assets: { ...structuredClone(defaultProfile.assets), ...(overrides.assets ?? {}) },
  pension: { ...structuredClone(defaultProfile.pension), ...(overrides.pension ?? {}) },
  assumptions: { ...structuredClone(defaultProfile.assumptions), ...(overrides.assumptions ?? {}) },
});

assert.equal(engine.calculateTax(0, "ON").toNumber(), 0);
closeTo(engine.calculateTax(15_705, "ON").toNumber(), 793.1025);
closeTo(engine.calculateTax(55_867, "ON").toNumber(), 9_204.1266);
assert.throws(() => engine.calculateTax(50_000, "QC"), /Unsupported province/);

const disabledPension = engine.calculatePension(profile(), 65);
assert.equal(disabledPension.annual.toNumber(), 0);
const formulaPension = engine.calculatePension(profile({
  pension: { enabled: true, mode: "formula", careerStartAge: 20, startAge: 60 },
}), 65);
assert.equal(formulaPension.annual.toNumber(), 66_500);
assert.equal(formulaPension.bridge.toNumber(), 14_984.375);
assert.equal(formulaPension.startAge, 65);

const contributionResult = engine.simulate(profile({
  age: 30,
  target_retirement_age: 31,
  annual_income: 100_000,
  annual_savings: 50_000,
  annual_spend: 0,
  assets: { rrsp: 0, tfsa: 0, non_reg: 0 },
  assumptions: { growthRate: 0, taxDrag: 0, cppAmount: 0, oasAmount: 0, lifespan: 31 },
}));
assert.deepEqual(contributionResult.projection[0], {
  age: 30,
  netWorth: 0,
  rrsp: 18_000,
  tfsa: 7_000,
  nonReg: 25_000,
});

const drawdownResult = engine.simulate(profile({
  age: 65,
  target_retirement_age: 65,
  annual_spend: 150,
  assets: { rrsp: 100, tfsa: 100, non_reg: 100 },
  assumptions: { growthRate: 0, taxDrag: 0, cppAmount: 0, oasAmount: 0, lifespan: 66 },
}));
assert.deepEqual(drawdownResult.projection[0], {
  age: 65,
  netWorth: 300,
  rrsp: 100,
  tfsa: 0,
  nonReg: 50,
});

const gross = engine.grossUpWithdrawal(new TestDecimal(10_000), 0, "ON").toNumber();
assert.equal(gross, 10_000);
closeTo(engine.grossUpWithdrawal(new TestDecimal(10_000), 50_000, "ON").toNumber(), 14_409.952121018992, 1e-9);

const assumptions = {
  realGrowth: new TestDecimal(1),
  nonRegNetGrowth: new TestDecimal(1),
  cppAge: 65,
  deathAge: 66,
  inflationRate: 0.02,
};
assert.equal(engine.testSolvency(
  new TestDecimal(0), new TestDecimal(50_000), new TestDecimal(0), 65,
  profile({ annual_spend: 20_000, pension: { enabled: false }, assumptions: { cppAmount: 0, oasAmount: 0 } }),
  assumptions, 65,
), true);
assert.equal(engine.testSolvency(
  new TestDecimal(0), new TestDecimal(100), new TestDecimal(0), 65,
  profile({ annual_spend: 20_000, pension: { enabled: false }, assumptions: { cppAmount: 0, oasAmount: 0 } }),
  assumptions, 65,
), false);

const clawbackProfile = profile({
  annual_spend: 108_500,
  assets: { rrsp: 0, tfsa: 0, non_reg: 0 },
  pension: { enabled: true, mode: "fixed", startAge: 65, annualAmount: 100_000, bridgeAmount: 0 },
  assumptions: { cppAmount: 0, oasAmount: 8_500 },
});
assert.equal(engine.testSolvency(
  new TestDecimal(0), new TestDecimal(0), new TestDecimal(0), 65,
  clawbackProfile, { ...assumptions, deathAge: 65 }, 65,
), false);

const boundary = engine.simulate(profile({
  age: 90,
  target_retirement_age: 90,
  annual_spend: 1,
  assets: { rrsp: 0, tfsa: 10, non_reg: 0 },
  assumptions: { growthRate: 0, cppAmount: 0, oasAmount: 0, lifespan: 80 },
}));
assert.deepEqual(boundary.projection.map(({ age }) => age), [90, 91]);
const impossible = engine.simulate(profile({
  annual_income: 0,
  annual_spend: 101,
  annual_savings: 0,
  assets: { rrsp: 0, tfsa: 0, non_reg: 0 },
  pension: { enabled: false },
  assumptions: { cppAmount: 0, oasAmount: 0 },
}));
assert.deepEqual(impossible, { projection: [], freedomYear: "NEVER", coastYear: "NEVER" });

console.log("OK: nFIRE deterministic model golden vectors passed.");
