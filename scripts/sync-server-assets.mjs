import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SITE_BASE_URL = "https://damy90.github.io/wishing-well-gen-2";
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const assetsDir = join(root, "public", "assets");
const staleServerDir = join(root, "public", "server");

mkdirSync(assetsDir, { recursive: true });

if (existsSync(staleServerDir)) {
  rmSync(staleServerDir, { recursive: true, force: true });
}

async function fetchLogo(url) {
  const response = await fetch(url);
  if (!response.ok) {
    return null;
  }
  return Buffer.from(await response.arrayBuffer());
}

let data = await fetchLogo(`${SITE_BASE_URL}/assets/logo.jpg`);
if (!data) {
  data = await fetchLogo(`${SITE_BASE_URL}/server/logo.jpg`);
}
if (!data) {
  console.error(`Failed to fetch logo from ${SITE_BASE_URL}/assets/logo.jpg`);
  process.exit(1);
}

const dest = join(assetsDir, "logo.jpg");
writeFileSync(dest, data);

console.log(`Fetched logo → public/assets/logo.jpg`);
