import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SERVER_BASE_URL = "https://damy90.github.io/wishing-well-gen-2/server";
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const serverDir = join(root, "public", "server");

const assets = [
  { name: "greeting.json", type: "json" },
  { name: "logo.jpg", type: "binary" },
];

mkdirSync(serverDir, { recursive: true });

for (const asset of assets) {
  const url = `${SERVER_BASE_URL}/${asset.name}`;
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`Failed to fetch ${url} (${response.status})`);
    process.exit(1);
  }

  const dest = join(serverDir, asset.name);
  if (asset.type === "json") {
    const data = await response.json();
    writeFileSync(dest, `${JSON.stringify(data, null, 2)}\n`);
  } else {
    const data = Buffer.from(await response.arrayBuffer());
    writeFileSync(dest, data);
  }

  console.log(`Fetched ${url} → public/server/${asset.name}`);
}
