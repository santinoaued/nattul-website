import assert from "node:assert/strict";
import { test } from "node:test";
import { buildOrderUrl, MAX_URL_LENGTH, type OrderLine } from "./whatsapp.ts";

const line = (name: string, price: number, qty: number): OrderLine => ({ name, unit: "250 g", price, qty });

test("builds one line per product plus the total, URL-encoded", () => {
  const { url, truncated } = buildOrderUrl("5490000000000", [line("Almendras & nueces", 2400, 2), line("Chía", 1200, 1)]);
  assert.equal(truncated, false);
  assert.ok(url.startsWith("https://wa.me/5490000000000?text="));
  const text = decodeURIComponent(url.split("?text=")[1]);
  assert.match(text, /^Hola! Quiero hacer este pedido:\n2 x Almendras & nueces \(250 g\) \$\s?4\.800\n1 x Chía/);
  assert.match(text, /Total: \$\s?6\.000$/);
});

test("stays under the URL limit and reports truncation on huge orders", () => {
  const lines = Array.from({ length: 120 }, (_, i) => line(`Producto con un nombre bastante largo número ${i}`, 1000, 1));
  const { url, truncated } = buildOrderUrl("5490000000000", lines);
  assert.ok(url.length <= MAX_URL_LENGTH);
  assert.equal(truncated, true);
  const text = decodeURIComponent(url.split("?text=")[1]);
  assert.match(text, /productos más\nTotal: \$\s?120\.000$/);
});
