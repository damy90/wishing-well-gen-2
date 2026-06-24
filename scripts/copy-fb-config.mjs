import { copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const distDir = join(root, "dist");
const configSrc = join(root, "fbapp-config.json");
const configDest = join(distDir, "fbapp-config.json");

export function copyFbConfig() {
  if (!existsSync(distDir)) {
    console.error("dist/ not found. Run npm run build first.");
    process.exit(1);
  }

  copyFileSync(configSrc, configDest);
  console.log("Copied fbapp-config.json → dist/");
  return distDir;
}
