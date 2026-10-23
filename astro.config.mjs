import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "");

export default defineConfig({
  site: env.SITE_URL || "https://nattul.pages.dev",
  vite: { plugins: [tailwindcss()] },
});
