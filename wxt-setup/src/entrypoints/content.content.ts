// import lightThemeCss from '~/assets/styles/material-light.css?inline';
// import darkThemeCss from '~/assets/styles/material-dark.css?inline';
// // import { defineContentScript } from 'wxt/scripting';

// const CSS_MAP = {
//   'material-light': lightThemeCss,
//   'material-dark': darkThemeCss,
// } as const;

// type ThemeKey = keyof typeof CSS_MAP;

// function applyTheme(theme: ThemeKey) {
//   console.log('hekk hekk')
//   removeExisting();
//   const style = document.createElement('style');
//   style.id = 'wiki-style-ext';
//   style.textContent = CSS_MAP[theme];
//   document.head.appendChild(style);
// }

// function removeExisting() {
//   const existing = document.getElementById('wiki-style-ext');
//   if (existing) existing.remove();
// }

// export default defineContentScript({
//   matches: ['*://*.wikipedia.org/*'],
//   runAt: 'document_end',
//   async main() {
//     // Initial theme load
//     const { theme } = await browser.storage.sync.get('theme');
//     console.log('Current theme:', theme);
//     applyTheme((theme as ThemeKey) || 'material-light');

//     // React to theme changes
//     browser.storage.onChanged.addListener((changes, area) => {
//       if (area === 'sync' && changes.theme) {
//         applyTheme(changes.theme.newValue as ThemeKey);
//       }
//     });
//   },
// });


// import { defineContentScript } from 'wxt/scripting';
import lightThemeCss from '~/assets/styles/material-light.css?inline';
import darkThemeCss from '~/assets/styles/material-dark.css?inline';

const CSS_MAP = {
  'material-light': lightThemeCss,
  'material-dark': darkThemeCss,
} as const;

type ThemeKey = keyof typeof CSS_MAP;

function applyTheme(theme: ThemeKey) {
  console.log('[content-script] Applying theme:', theme);
  removeExisting();
  const style = document.createElement('style');
  style.id = 'wiki-style-ext';
  style.textContent = CSS_MAP[theme];
  document.head.appendChild(style);
}

function removeExisting() {
  const existing = document.getElementById('wiki-style-ext');
  if (existing) existing.remove();
}

export default defineContentScript({
  matches: ['*://*.wikipedia.org/*'],
  runAt: 'document_end',
  async main() {
    console.log('🚀 Content script LOADED', window.location.href);
    const { theme } = await browser.storage.sync.get('theme');
    applyTheme((theme as ThemeKey) || 'material-light');
    browser.storage.onChanged.addListener((changes, area) => {
      if (area === 'sync' && changes.theme) {
        applyTheme(changes.theme.newValue as ThemeKey);
      }
    });
  },
});
