import assert from "node:assert/strict";
import { test } from "node:test";
import { csvToRecords, parseCsv } from "./csv.ts";

test("parses quoted fields with commas, escaped quotes and newlines", () => {
  const rows = parseCsv('a,b\n"uno, dos","dice ""hola""\ny chau"\r\n3,4\n');
  assert.deepEqual(rows, [
    ["a", "b"],
    ["uno, dos", 'dice "hola"\ny chau'],
    ["3", "4"],
  ]);
});

test("strips BOM, skips blank lines and keeps empty cells", () => {
  const records = csvToRecords("﻿id,nombre,imagen\n1,Avena,\n\n2, Chía ,x.jpg");
  assert.deepEqual(records, [
    { id: "1", nombre: "Avena", imagen: "" },
    { id: "2", nombre: "Chía", imagen: "x.jpg" },
  ]);
});

test("rejects unclosed quotes", () => {
  assert.throws(() => parseCsv('a,"b\n1,2'), /comillas sin cerrar/);
});
