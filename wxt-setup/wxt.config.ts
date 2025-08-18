import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-vue"],
  // manifest: {
  //   content_scripts: [
  //     {
  //       matches: ["*://*.wikipedia.org/*"],
  //       js: ["src/content-script.ts"],
  //       css: ["entrypoints/popup/material-you-styles.css"],
  //       run_at: "document_idle",
  //     },
  //   ],
  // },
  manifest: {
    name: 'Wikipedia Theme Switcher',
    version: '0.1.0',
    description: 'Style Wikipedia with selectable material themes.',
    action: { default_popup: 'popup.html' },
    permissions: ['storage', 'activeTab', 'scripting'],
    host_permissions: ['*://*.wikipedia.org/*'],
    // content_scripts: [{
    //   matches: ['*://*.wikipedia.org/*'],
    //   js: ['content-scripts/content.js'],
    //   run_at: "document_end"
    // }],
    web_accessible_resources: [
      // If you choose to use linked CSS files,
      // this lets the content script access them
      {
        resources: ['assets/styles/*'],
        matches: ['*://*.wikipedia.org/*'],
      },
    ],
  }
});
