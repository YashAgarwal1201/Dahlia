import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-vue"],
  manifest: {
    content_scripts: [
      {
        matches: ["*://*.wikipedia.org/*"],
        js: ["src/content-script.ts"],
        css: ["entrypoints/popup/material-you-styles.css"],
        run_at: "document_idle",
      },
    ],
  },
});
