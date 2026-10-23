import { getProducts } from "@/lib/catalog";

/** Lightweight search index, fetched only by the search page and the cart. */
export async function GET() {
  const products = await getProducts();
  const index = products.map((product) => ({
    s: product.slug,
    n: product.name,
    c: product.categorySlug,
    cn: product.category,
    p: product.price,
    u: product.unit,
    t: product.tags,
    i: product.image ?? "",
    a: product.available ? 1 : 0,
  }));
  return new Response(JSON.stringify(index), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
