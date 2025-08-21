import lightThemeCss from '~/assets/styles/material-light.css?inline';
import darkThemeCss from '~/assets/styles/material-dark.css?inline';
import appleLiquidGlassCss from '~/assets/styles/apple-liquid-glass.css?inline';
import winUiCss from '~/assets/styles/win-ui.css?inline';
import appleLiquidGlassDarkCss from '~/assets/styles/apple-liquid-glass-dark.css?inline';
import winUiDarkCss from '~/assets/styles/win-ui-dark.css?inline';

const CSS_MAP = {
  'material-light': lightThemeCss,
  'material-dark': darkThemeCss,
  'apple-liquid-glass': appleLiquidGlassCss,
  'win-ui': winUiCss,
  'apple-liquid-glass-dark': appleLiquidGlassDarkCss,
  'win-ui-dark': winUiDarkCss,
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
