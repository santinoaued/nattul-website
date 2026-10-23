import { readFile } from "node:fs/promises";
import { z } from "astro/zod";
import { csvToRecords } from "./csv.ts";

export const TAG_LABELS = {
  "sin-tacc": "Sin TACC",
  vegano: "Vegano",
  organico: "Orgánico",
  "sin-azucar": "Sin azúcar",
  "sin-sal": "Sin sal",
  integral: "Integral",
} as const;

export type Tag = keyof typeof TAG_LABELS;

const COLUMNS = {
  id: "id",
  slug: "slug",
  name: "nombre",
  category: "categoria",
  subcategory: "subcategoria",
  price: "precio",
  unit: "unidad",
  description: "descripcion",
  image: "imagen",
  tags: "etiquetas",
  available: "disponible",
} as const;

const optionalText = z.string().transform((value) => value || undefined);

export const productSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug: solo minúsculas, números y guiones"),
  name: z.string().min(1, "nombre: no puede estar vacío"),
  category: z.string().min(1, "categoria: no puede estar vacía"),
  categorySlug: z.string().min(1),
  subcategory: optionalText,
  price: z
    .string()
    .regex(/^\d+$/, "precio: número entero en pesos, sin puntos ni signos (ej. 4800)")
    .transform(Number),
  unit: z.string().regex(/^(\d+ (g|kg|ml|l)|unidad)$/, 'unidad: "100 g", "1 kg", "500 ml" o "unidad"'),
  description: z.string().min(1, "descripcion: no puede estar vacía"),
  image: z
    .string()
    .refine((value) => value === "" || /^(\/|https:\/\/)/.test(value), "imagen: ruta que empiece con / o URL https://")
    .transform((value) => value || undefined),
  tags: z
    .string()
    .transform((value) => value.split("|").map((tag) => tag.trim()).filter(Boolean))
    .pipe(z.array(z.enum(Object.keys(TAG_LABELS) as [Tag, ...Tag[]]))),
  available: z
    .string()
    .transform((value) => value.toLowerCase().replace("í", "i"))
    .pipe(z.enum(["si", "no"], 'disponible: "si" o "no"'))
    .transform((value) => value === "si"),
});

export type Product = z.output<typeof productSchema> & { id: string };

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function readSource(): Promise<{ text: string; source: string }> {
  const url = import.meta.env.PRODUCTS_CSV_URL || process.env.PRODUCTS_CSV_URL;
  if (url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`No se pudo leer la planilla (${response.status}): ${url}`);
    return { text: await response.text(), source: url };
  }
  const path = import.meta.env.PRODUCTS_CSV_PATH || process.env.PRODUCTS_CSV_PATH || "data/productos-demo.csv";
  return { text: await readFile(path, "utf8"), source: path };
}

/** Content loader: reads the product CSV and returns raw entries for the collection schema to validate. */
export async function loadProducts() {
  const { text, source } = await readSource();
  const records = csvToRecords(text);
  const header = Object.keys(records[0] ?? {});
  const missing = Object.values(COLUMNS).filter((column) => !header.includes(column));
  if (missing.length) throw new Error(`${source}: faltan columnas: ${missing.join(", ")}`);

  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  return records.map((record, index) => {
    const line = index + 2;
    const id = record[COLUMNS.id];
    const slug = record[COLUMNS.slug] || slugify(record[COLUMNS.name]);
    if (!id) throw new Error(`${source}, fila ${line}: falta el id.`);
    if (seenIds.has(id)) throw new Error(`${source}, fila ${line}: id repetido "${id}".`);
    if (seenSlugs.has(slug)) throw new Error(`${source}, fila ${line}: slug repetido "${slug}".`);
    seenIds.add(id);
    seenSlugs.add(slug);

    return {
      id,
      slug,
      name: record[COLUMNS.name],
      category: record[COLUMNS.category],
      categorySlug: slugify(record[COLUMNS.category]),
      subcategory: record[COLUMNS.subcategory],
      price: record[COLUMNS.price],
      unit: record[COLUMNS.unit],
      description: record[COLUMNS.description],
      image: record[COLUMNS.image],
      tags: record[COLUMNS.tags],
      available: record[COLUMNS.available],
    };
  });
}
