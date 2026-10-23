// Checks that every internal href/src/srcset in dist/ points to a file that exists. Run after `npm run build`.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const htmlFiles = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith(".html")) htmlFiles.push(path);
  }
};
walk(DIST);

const exists = (url) => {
  const path = decodeURIComponent(url.split(/[?#]/)[0]);
  if (path === "" || path === "/") return existsSync(join(DIST, "index.html"));
  const target = join(DIST, path);
  return path.endsWith("/") ? existsSync(join(target, "index.html")) : existsSync(target);
};

const broken = new Set();
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const urls = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const srcset of html.matchAll(/\ssrcset="([^"]+)"/g)) urls.push(...srcset[1].split(",").map((part) => part.trim().split(/\s+/)[0]));
  for (const url of urls) {
    if (!url.startsWith("/") || url.startsWith("//")) continue;
    if (!exists(url)) broken.add(`${file}: ${url}`);
  }
}

console.log(`${htmlFiles.length} páginas revisadas.`);
if (broken.size) {
  console.error(`Enlaces rotos (${broken.size}):\n${[...broken].join("\n")}`);
  process.exit(1);
}
console.log("Sin enlaces internos rotos.");
