import assert from "node:assert/strict";
import { test } from "node:test";
import { formatAmount } from "./format.ts";

test("formats the total amount of a product", () => {
  assert.equal(formatAmount("250 g", 1), "250 g");
  assert.equal(formatAmount("250 g", 3), "750 g");
  assert.equal(formatAmount("500 g", 3), "1,5 kg");
  assert.equal(formatAmount("250 g", 4), "1 kg");
  assert.equal(formatAmount("1 kg", 2), "2 kg");
  assert.equal(formatAmount("500 ml", 3), "1,5 l");
  assert.equal(formatAmount("unidad", 1), "1 unidad");
  assert.equal(formatAmount("unidad", 2), "2 unidades");
});
