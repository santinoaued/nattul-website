import assert from "node:assert/strict";
import { test } from "node:test";
import { formatAmount, packAmount, stepAmount } from "./amount.ts";

test("formats amounts in the product's measure", () => {
  assert.equal(formatAmount("250 g", 250), "250 g");
  assert.equal(formatAmount("250 g", 1500), "1,5 kg");
  assert.equal(formatAmount("1 kg", 2000), "2 kg");
  assert.equal(formatAmount("500 ml", 1500), "1,5 l");
  assert.equal(formatAmount("unidad", 1), "1 unidad");
  assert.equal(formatAmount("unidad", 2), "2 unidades");
});

test("starts at the presentation and steps on the 100 g grid", () => {
  assert.equal(packAmount("250 g"), 250);
  assert.equal(packAmount("1 kg"), 1000);
  assert.equal(packAmount("unidad"), 1);
  assert.equal(stepAmount("250 g", 250, -1), 200);
  assert.equal(stepAmount("250 g", 250, 1), 300);
  assert.equal(stepAmount("250 g", 100, -1), 100);
  assert.equal(stepAmount("1 kg", 1000, -1), 900);
  assert.equal(stepAmount("50 g", 50, 1), 100);
  assert.equal(stepAmount("50 g", 50, -1), 50);
  assert.equal(stepAmount("unidad", 1, -1), 1);
  assert.equal(stepAmount("unidad", 99, 1), 99);
  assert.equal(stepAmount("250 g", 10_000, 1), 10_000);
});
