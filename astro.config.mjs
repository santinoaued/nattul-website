import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import tailwindcss from "@tailwindcss/vite";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "");
// Origin of external product images (e.g. Cloudflare R2), allowed in the CSP.
const imagesOrigin = env.IMAGES_ORIGIN ?? "";
// "/nattul-website" for the GitHub Pages demo; empty on Cloudflare Pages.
const base = env.BASE_PATH || "/";

export default defineConfig({
  site: env.SITE_URL || "https://nattul.pages.dev",
  base,
  trailingSlash: "always",
  integrations: [preact()],
  // No Markdown code blocks on this site; Shiki would also need inline styles the CSP blocks.
  markdown: { syntaxHighlight: false },
  vite: { plugins: [tailwindcss()] },
  security: {
    // Emits a per-page CSP <meta> with hashes for Astro's inline island scripts and styles.
    csp: {
      directives: [
        "default-src 'self'",
        `img-src 'self' data: ${imagesOrigin}`.trim(),
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests",
      ],
    },
  },
});
