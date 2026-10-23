import assert from "node:assert/strict";
import { test } from "node:test";
import { createCart, MAX_QTY } from "./cart.ts";

const memory = () => {
  const data = new Map<string, string>();
  return { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => void data.set(key, value), data };
};
const almendras = { slug: "almendras", name: "Almendras", unit: "250 g" };

test("adds, merges, changes quantity and removes", () => {
  const cart = createCart(memory());
  cart.add(almendras);
  cart.add(almendras, 2);
  cart.add({ slug: "chia", name: "Chía", unit: "250 g" });
  assert.equal(cart.count(), 2);
  assert.equal(cart.items()[0].qty, 3);
  cart.setQty("almendras", 1);
  assert.equal(cart.items()[0].qty, 1);
  cart.setQty("chia", 0);
  assert.deepEqual(cart.items().map((item) => item.slug), ["almendras"]);
  cart.remove("almendras");
  assert.equal(cart.count(), 0);
});

test("caps quantity and ignores tampered or broken storage", () => {
  const storage = memory();
  const cart = createCart(storage);
  cart.add(almendras, 500);
  assert.equal(cart.items()[0].qty, MAX_QTY);
  storage.data.set("nattul:carrito:v1", '[{"slug":"x","name":"X","unit":"1 kg","qty":0},{"slug":1}]');
  assert.deepEqual(cart.items(), []);
  storage.data.set("nattul:carrito:v1", "{no es json");
  assert.deepEqual(cart.items(), []);
});

test("keeps working when storage throws", () => {
  const cart = createCart({
    getItem: () => {
      throw new Error("blocked");
    },
    setItem: () => {
      throw new Error("blocked");
    },
  });
  assert.doesNotThrow(() => cart.add(almendras));
  assert.deepEqual(cart.items(), []);
});
