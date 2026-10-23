import type { Tag } from "./products.ts";

/** Shape of /productos.json (short keys keep the file small with 800+ products). */
export interface IndexEntry {
  s: string;
  n: string;
  c: string;
  cn: string;
  p: number;
  u: string;
  t: Tag[];
  i: string;
  a: 0 | 1;
}

let request: Promise<IndexEntry[]> | undefined;

export function loadIndex(): Promise<IndexEntry[]> {
  request ??= fetch("/productos.json").then((response) => {
    if (!response.ok) throw new Error(`No se pudo cargar el catálogo (${response.status})`);
    return response.json() as Promise<IndexEntry[]>;
  });
  request.catch(() => (request = undefined));
  return request;
}
