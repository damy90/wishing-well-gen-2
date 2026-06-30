import { defineConfig } from "vite";
import { platformHtmlPlugin, sharedBuildOptions } from "./vite.shared";

export default defineConfig({
  base: "./",
  build: sharedBuildOptions,
  plugins: [platformHtmlPlugin("web")],
  define: {
    "import.meta.env.VITE_PLATFORM": JSON.stringify("web"),
  },
});
