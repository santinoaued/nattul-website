import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import tailwindcss from "@tailwindcss/vite";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "");

export default defineConfig({
  site: env.SITE_URL || "https://nattul.pages.dev",
  trailingSlash: "always",
  integrations: [preact()],
  vite: { plugins: [tailwindcss()] },
});
