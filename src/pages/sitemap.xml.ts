import { href } from "@/lib/url";
import type { APIRoute } from "astro";
import { categoryUrl, getCategories, getProducts, PAGE_SIZE, productUrl } from "@/lib/catalog";

// Hand-written instead of @astrojs/sitemap: the page list is fully known here and needs no extra dependency.
export const GET: APIRoute = async ({ site }) => {
  const products = await getProducts();
  const paths = ["/", "/como-comprar/", "/contacto/"].map(href);
  for (const category of getCategories(products)) {
    paths.push(categoryUrl(category.slug));
    for (let page = 2; page <= Math.ceil(category.count / PAGE_SIZE); page++) paths.push(`${categoryUrl(category.slug)}${page}/`);
  }
  paths.push(...products.map((product) => productUrl(product.slug)));

  const urls = paths.map((path) => `<url><loc>${new URL(path, site).href}</loc></url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
