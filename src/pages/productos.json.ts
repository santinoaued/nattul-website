import { getImage } from "astro:assets";
import { getProducts } from "@/lib/catalog";
import { resolveProductImage } from "@/lib/images";

async function thumbnail(path?: string) {
  const image = resolveProductImage(path);
  if (typeof image !== "object") return image ?? "";
  return (await getImage({ src: image, width: 300, format: "webp" })).src;
}

/** Lightweight search index, fetched only by the search page and the cart. */
export async function GET() {
  const products = await getProducts();
  const index = await Promise.all(
    products.map(async (product) => ({
      s: product.slug,
      n: product.name,
      c: product.categorySlug,
      cn: product.category,
      p: product.price,
      u: product.unit,
      t: product.tags,
      i: await thumbnail(product.image),
      a: product.available ? 1 : 0,
    })),
  );
  return new Response(JSON.stringify(index), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
