import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";

// Compile the real, dependency-free math module so Node 22 and CI use the
// same implementation as the browser without requiring a second test runner.
const source = readFileSync(new URL("../lib/growth.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { computeGrowth } = await import(
  "data:text/javascript;base64," + Buffer.from(outputText).toString("base64")
);
const plannerSource = readFileSync(new URL("../lib/growth-planner.ts", import.meta.url), "utf8");
const plannerOutput = ts.transpileModule(plannerSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { paymentPlan, combinedPlan, parsePlannerValue, formatPlanMoney, roundUpTarget } = await import(
  "data:text/javascript;base64," + Buffer.from(plannerOutput).toString("base64")
);
const empty = {
  impressions: NaN, visits: NaN, customers: NaN, aov: NaN,
  repeatRate: NaN, goalRevenue: NaN, rent: NaN, currentRevenue: NaN,
};

test("current and goal revenues produce a gap without inventing transaction counts", () => {
  const result = computeGrowth({ ...empty, currentRevenue: 27_000_000, goalRevenue: 40_000_000 });
  assert.equal(result.canCompute, true);
  assert.equal(result.currentRevenue, 27_000_000);
  assert.equal(result.gap, 13_000_000);
  assert.deepEqual(result.levers, []);
  assert.equal(result.weakestStage, null);
  assert.equal(result.standards, null);
});

test("blank revenue stays unknown while explicitly entered zero is valid", () => {
  assert.equal(computeGrowth({ ...empty, goalRevenue: 40_000_000 }).canCompute, false);
  const zero = computeGrowth({ ...empty, currentRevenue: 0, goalRevenue: 40_000_000 });
  assert.equal(zero.canCompute, true);
  assert.equal(zero.gap, 40_000_000);
  assert.equal(zero.goalReached, false);
});

test("transaction estimates do not overwrite entered revenue or become visitor counts", () => {
  const result = computeGrowth({
    ...empty, currentRevenue: 1_000_001, goalRevenue: 2_000_000, aov: 30_000,
  });
  assert.equal(result.currentRevenue, 1_000_001);
  assert.equal(result.gap, 999_999);
  assert.equal(result.levers[0].unit, "건");
  assert.equal(result.levers[0].required, 2_000_000 / 30_000);
  assert.equal(result.standards, null);
});

test("missing rent does not imply zero rent or fabricate an available budget", () => {
  const entered = { ...empty, currentRevenue: 27_000_000, goalRevenue: 40_000_000, aov: 15_000 };
  assert.equal(computeGrowth(entered).standards, null);
  assert.equal(computeGrowth({ ...entered, rent: 0 }).standards.marketingBudget, 4_000_000);
});

test("an achieved goal has no negative gap or additional growth requirement", () => {
  const result = computeGrowth({ ...empty, currentRevenue: 40_000_000, goalRevenue: 27_000_000 });
  assert.equal(result.goalReached, true);
  assert.equal(result.gap, 0);
  assert.deepEqual(result.levers, []);
});

test("whole-payment targets round up without demanding an extra payment for floating point noise", () => {
  assert.deepEqual(paymentPlan(27_000_000, 40_000_000, 15_000, 30), {
    extraMonthly: 867, extraDaily: 29, requiredAverage: 22_223, extraAverage: 7_223,
  });
  assert.equal(paymentPlan(0, 100_000, 1_000, 25).extraDaily, 4);
  assert.equal(paymentPlan(0, 100_000, 1_000, 25).requiredAverage, null);
  assert.equal(paymentPlan(0, 100_000, 0, 25), null);
  assert.equal(paymentPlan(0, 100_000, 1_000, 0), null);
  assert.equal(roundUpTarget(40_000_000 / 18_000), 2223);
});

test("a combined change applies the new average to both existing and additional payments", () => {
  assert.deepEqual(combinedPlan(27_000_000, 40_000_000, 15_000, 26, 20, 20_000), {
    revenue: 46_400_000, remaining: -6_400_000,
  });
  assert.deepEqual(combinedPlan(0, 100_000, 1_000, 25, 4, 1_000), {
    revenue: 100_000, remaining: 0,
  });
  assert.equal(combinedPlan(27_000_000, 40_000_000, 15_000, 26, 2.5, 20_000), null);
});

test("invalid or blank numeric input never silently becomes zero or a different amount", () => {
  for (const value of ["", " ", "-100", "1e3", "1,2", "Infinity", "100만원"]) {
    assert.equal(parsePlannerValue(value), null);
  }
  assert.equal(parsePlannerValue("0"), 0);
  assert.equal(parsePlannerValue("2,700.25"), 2700.25);
  assert.equal(parsePlannerValue("1.5", true), null);
});

test("money labels preserve small differences and large amounts", () => {
  assert.equal(formatPlanMoney(100), "100원");
  assert.equal(formatPlanMoney(13_000_000), "1,300만 원");
  assert.equal(formatPlanMoney(100_000_100), "1억 0.01만 원");
  assert.equal(formatPlanMoney(100_000_001), "100,000,001원");
  assert.equal(formatPlanMoney(105_000_000), "1억 500만 원");
});
