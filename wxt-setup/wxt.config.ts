import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-vue"],
  manifest: {
    name: 'Avocado - Wikipedia Theme Switcher',
    version: '0.1.0',
    description: 'Style Wikipedia with selectable themes.',
    action: { default_popup: 'popup.html' },
    permissions: ['storage', 'activeTab', 'scripting'],
    host_permissions: ['*://*.wikipedia.org/*'],
   
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
