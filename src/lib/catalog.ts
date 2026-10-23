import { href } from "@/lib/url";
import { getCollection } from "astro:content";
import { slugify, type Product } from "./products.ts";

export const PAGE_SIZE = 12;

export const productUrl = (slug: string) => href(`/productos/${slug}/`);
export const categoryUrl = (slug: string) => href(`/categoria/${slug}/`);

export async function getProducts(): Promise<Product[]> {
  const entries = await getCollection("products");
  return entries
    .map((entry) => ({ ...entry.data, id: entry.id }))
    .sort((a, b) => a.category.localeCompare(b.category, "es") || a.name.localeCompare(b.name, "es"));
}

export interface Category {
  name: string;
  slug: string;
  count: number;
  image?: string;
}

export function getCategories(products: Product[]): Category[] {
  const byName = Map.groupBy(products, (product) => product.category);
  return [...byName].map(([name, items]) => ({
    name,
    slug: slugify(name),
    count: items.length,
    image: items.find((item) => item.image)?.image,
  }));
}
