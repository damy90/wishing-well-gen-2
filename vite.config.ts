import { defineConfig } from "vite";
import { platformHtmlPlugin, sharedBuildOptions } from "./vite.shared";

export default defineConfig({
  // Facebook Web Hosting serves the bundle from a subpath; absolute /assets/ URLs 404.
  base: "./",
  build: sharedBuildOptions,
  plugins: [platformHtmlPlugin("facebook")],
  define: {
    "import.meta.env.VITE_PLATFORM": JSON.stringify("facebook"),
    // Bundled logo in dist.zip — FB WebView often blocks cross-origin fetch/img to GitHub Pages.
    "import.meta.env.VITE_LOGO_SRC": JSON.stringify("./assets/logo.jpg"),
    "import.meta.env.VITE_SERVER_BASE_URL": JSON.stringify(
      "https://damy90.github.io/wishing-well-gen-2",
    ),
  },
});
