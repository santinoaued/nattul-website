const base = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Prefixes an internal path with the deploy base (empty on Cloudflare, "/nattul-website" on GitHub Pages). */
export const href = (path: string) => `${base}${path}`;
