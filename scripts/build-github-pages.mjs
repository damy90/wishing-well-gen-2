import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const distDir = join(root, "dist");
const serverDir = join(distDir, "server");

if (!existsSync(distDir)) {
  console.error("dist/ not found. Run vite build --config vite.github-pages.config.ts first.");
  process.exit(1);
}

if (!existsSync(serverDir)) {
  console.error("dist/server/ not found. public/server/ should be copied by Vite.");
  process.exit(1);
}

console.log("GitHub Pages build ready in dist/");
console.log("  dist/index.html");
console.log("  dist/server/greeting.json");
console.log("  dist/server/logo.jpg");
