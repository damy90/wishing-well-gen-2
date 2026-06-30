import { defineConfig } from "vite";
import { platformHtmlPlugin, sharedBuildOptions } from "./vite.shared";

const githubPagesBase =
  process.env.GITHUB_PAGES_BASE?.trim() || "/wishing-well-gen-2/";

export default defineConfig({
  base: githubPagesBase.endsWith("/") ? githubPagesBase : `${githubPagesBase}/`,
  build: {
    ...sharedBuildOptions,
    rollupOptions: {
      input: {
        main: "index.html",
        debug: "debug.html",
      },
    },
  },
  plugins: [platformHtmlPlugin("web")],
  define: {
    "import.meta.env.VITE_PLATFORM": JSON.stringify("web"),
  },
});
