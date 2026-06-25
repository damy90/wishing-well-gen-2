import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const distDir = join(root, "dist");
const logoPath = join(distDir, "assets", "logo.jpg");
const dataDir = join(distDir, "data");
const greetingSrc = join(root, "data", "greeting.json");
const greetingDest = join(dataDir, "greeting.json");

if (!existsSync(distDir)) {
  console.error("dist/ not found. Run vite build --config vite.github-pages.config.ts first.");
  process.exit(1);
}

if (!existsSync(logoPath)) {
  console.error("dist/assets/logo.jpg not found. public/assets/ should be copied by Vite.");
  process.exit(1);
}

if (!existsSync(greetingSrc)) {
  console.error("data/greeting.json not found.");
  process.exit(1);
}

mkdirSync(dataDir, { recursive: true });
copyFileSync(greetingSrc, greetingDest);

console.log("GitHub Pages build ready in dist/");
console.log("  dist/index.html");
console.log("  dist/data/greeting.json");
console.log("  dist/assets/logo.jpg");
