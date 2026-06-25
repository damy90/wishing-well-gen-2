import { defineConfig } from "vite";
import { omitFbInstantInDevPlugin, sharedBuildOptions } from "./vite.shared";

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
  plugins: [omitFbInstantInDevPlugin],
});
