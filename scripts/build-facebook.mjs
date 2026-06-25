import { existsSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import bestzip from "bestzip";
import { copyFbConfig } from "./copy-fb-config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const distDir = copyFbConfig();
const zipPath = join(root, "dist.zip");

if (existsSync(zipPath)) {
  unlinkSync(zipPath);
}
await bestzip({
  source: "*",
  destination: zipPath,
  cwd: distDir,
});

console.log(`Created ${zipPath}`);
