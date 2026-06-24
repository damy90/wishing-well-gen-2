import { copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const logoSrc = join(root, "assets", "logo.jpg");
const logoDest = join(root, "public", "server", "logo.jpg");

if (!existsSync(logoSrc)) {
  console.error("assets/logo.jpg not found.");
  process.exit(1);
}

copyFileSync(logoSrc, logoDest);
console.log("Copied assets/logo.jpg → public/server/logo.jpg");
