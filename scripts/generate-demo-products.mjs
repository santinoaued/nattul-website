// Generates ~800 synthetic products from the demo CSV to test build time, pagination and search.
// Usage: npm run demo:800, then PRODUCTS_CSV_PATH=data/productos-800.csv npm run build
import { readFileSync, writeFileSync } from "node:fs";
import { csvToRecords } from "../src/lib/csv.ts";

const TOTAL = 800;
const base = csvToRecords(readFileSync("data/productos-demo.csv", "utf8"));
const columns = Object.keys(base[0]);
const escape = (value) => (/[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);

const rows = Array.from({ length: TOTAL }, (_, i) => {
  const source = base[i % base.length];
  const batch = Math.floor(i / base.length) + 1;
  return {
    ...source,
    id: `SYN-${String(i + 1).padStart(4, "0")}`,
    slug: "",
    nombre: `${source.nombre} (demo ${batch})`,
    precio: String(Math.round((Number(source.precio) * (0.9 + (batch % 5) * 0.05)) / 10) * 10),
  };
});

const lines = rows.map((row) => columns.map((column) => escape(row[column])).join(","));
writeFileSync("data/productos-800.csv", [columns.join(","), ...lines].join("\n") + "\n");
console.log(`data/productos-800.csv: ${rows.length} productos sintéticos`);
