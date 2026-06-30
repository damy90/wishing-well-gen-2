import { defineConfig, type Plugin } from "vite";

const FB_SDK_SCRIPT =
  /\s*<script src="https:\/\/connect\.facebook\.net\/en_US\/fbinstant\.8\.0\.js"><\/script>\n?/;

export function platformHtmlPlugin(platform: "web" | "facebook"): Plugin {
  return {
    name: `platform-html-${platform}`,
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        if (platform === "web") {
          return html.replace(FB_SDK_SCRIPT, "\n");
        }
        return html;
      },
    },
  };
}

export const sharedBuildOptions = {
  outDir: "dist",
  emptyOutDir: true,
};
