import { defineConfig } from "vite";
import { omitFbInstantInDevPlugin, sharedBuildOptions } from "./vite.shared";

const githubPagesBase =
  process.env.GITHUB_PAGES_BASE?.trim() || "/wishing-well-gen-2/";

export default defineConfig({
  base: githubPagesBase.endsWith("/") ? githubPagesBase : `${githubPagesBase}/`,
  build: sharedBuildOptions,
  plugins: [omitFbInstantInDevPlugin],
  env: {
    // Same-origin ./server/ for logo and greeting on GitHub Pages.
    VITE_SERVER_BASE_URL: "",
  },
});
