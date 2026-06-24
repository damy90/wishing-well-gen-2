import { defineConfig } from "vite";
import { omitFbInstantInDevPlugin, sharedBuildOptions } from "./vite.shared";

export default defineConfig({
  // Facebook Web Hosting serves the bundle from a subpath; absolute /assets/ URLs 404.
  base: "./",
  build: sharedBuildOptions,
  plugins: [omitFbInstantInDevPlugin],
  env: {
    VITE_SERVER_BASE_URL: "https://damy90.github.io/wishing-well-gen-2",
  },
});
