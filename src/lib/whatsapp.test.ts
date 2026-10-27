import assert from "node:assert/strict";
import { test } from "node:test";
import { buildOrderUrl, MAX_URL_LENGTH, type OrderLine } from "./whatsapp.ts";

const line = (name: string, amount: number): OrderLine => ({ name, unit: "250 g", amount });

test("builds one line per product without prices, URL-encoded", () => {
  const { url, truncated } = buildOrderUrl("5490000000000", [line("Almendras & nueces", 500), line("Chía", 100)]);
  assert.equal(truncated, false);
  assert.ok(url.startsWith("https://wa.me/5490000000000?text="));
  const text = decodeURIComponent(url.split("?text=")[1]);
  assert.equal(text, "Hola! Quiero consultar precio y disponibilidad de estos productos:\nAlmendras & nueces: 500 g\nChía: 100 g");
  assert.doesNotMatch(text, /\$/);
});

test("stays under the URL limit and reports truncation on huge orders", () => {
  const lines = Array.from({ length: 150 }, (_, i) => line(`Producto con un nombre bastante largo número ${i}`, 250));
  const { url, truncated } = buildOrderUrl("5490000000000", lines);
  assert.ok(url.length <= MAX_URL_LENGTH);
  assert.equal(truncated, true);
  assert.match(decodeURIComponent(url.split("?text=")[1]), /\+ \d+ productos más$/);
});
