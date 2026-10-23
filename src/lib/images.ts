import type { ImageMetadata } from "astro";

const localProducts = import.meta.glob<{ default: ImageMetadata }>("/src/assets/products/*.{jpg,jpeg,png,webp}", { eager: true });

/**
 * CSV image values: "/products/<file>" points to src/assets/products (optimized at build),
 * "https://..." is served as-is from external storage.
 */
export function resolveProductImage(path?: string): ImageMetadata | string | undefined {
  if (!path) return undefined;
  if (path.startsWith("https://")) return path;
  const asset = localProducts[`/src/assets${path}`]?.default;
  if (!asset) throw new Error(`Imagen de producto no encontrada: "${path}". Debe existir en src/assets${path}.`);
  return asset;
}
