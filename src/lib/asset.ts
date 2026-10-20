/** Prefixes a public/ path with the Vite base, so it also works under /<repo>/ on GitHub Pages. */
export function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
