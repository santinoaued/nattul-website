import { defineCollection } from "astro:content";
import { productSchema, productsLoader } from "./lib/products.ts";

export const collections = {
  products: defineCollection({ loader: productsLoader(), schema: productSchema }),
};
