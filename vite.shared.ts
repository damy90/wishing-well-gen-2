import { defineConfig, type Plugin } from "vite";

export const omitFbInstantInDevPlugin: Plugin = {
  name: "omit-fbinstant-in-dev",
  transformIndexHtml: {
    order: "pre",
    handler(html, ctx) {
      if (ctx.server) {
        return html.replace(
          /\s*<script src="https:\/\/connect\.facebook\.net\/en_US\/fbinstant\.8\.0\.js"><\/script>\n?/,
          "\n",
        );
      }
      return html;
    },
  },
};

export const sharedBuildOptions = {
  outDir: "dist",
  emptyOutDir: true,
};
