import { defineCollection } from "astro:content";
import { loadProducts, productSchema } from "./lib/products.ts";

export const collections = {
  products: defineCollection({ loader: loadProducts, schema: productSchema }),
};
