import type { APIRoute } from "astro";
import { href } from "@/lib/url";

export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *\nDisallow: ${href("/carrito/")}\nDisallow: ${href("/buscar/")}\n\nSitemap: ${new URL(href("/sitemap.xml"), site).href}\n`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
