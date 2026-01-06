<template>
  <div class="popup-container">
    <header class="header-row">
      <div>
        <h2 class="main-header">Avocado</h2>
        <p class="description">Style Wikipedia with selectable themes</p>
      </div>
    </header>

    <section class="theme-selector-container">
      <h3 class="section-title">Select Theme</h3>
      <select v-model="selectedTheme" @change="setTheme" class="theme-dropdown">
        <option value="default">Default</option>
        <option value="material-light">Material Light</option>
        <option value="material-dark">Material Dark</option>
      </select>
    </section>

    <section class="developer-section">
      <h3 class="section-title">Developer</h3>
      <div class="button-group">
        <a :href="DEV_PROFILE_URL" target="_blank" rel="noopener noreferrer" class="material-button">Profile</a>
        <a :href="DEV_GITHUB_URL" target="_blank" rel="noopener noreferrer" class="material-button secondary">GitHub Repo</a>
      </div>
    </section>

    <section class="report-section">
      <h3 class="section-title">Report</h3>
      <div class="report-controls">
        <button class="material-button destructive" @click="reportBrokenPage" :disabled="reporting">
          <span v-if="!reporting">Report broken page</span>
          <span v-else>Preparing report…</span>
        </button>
        <button class="material-button" @click="openScreenshotTab" :disabled="!lastScreenshotDataUrl">
          Open last screenshot
        </button>
      </div>

      <p class="hint" v-if="statusMessage">{{ statusMessage }}</p>
    </section>

    <footer class="footer">
      <small>v{{ EXT_VERSION }}</small>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

/**
 * Note: WXT provides `browser` (webextension-polyfill) in extension contexts.
 * If you prefer chrome.* APIs, you can adapt accordingly.
 */
declare const browser: any;

const DEV_PROFILE_URL = import.meta.env.VITE_DEV_PROFILE_URL || "https://your-profile-link.com";
const DEV_GITHUB_URL = import.meta.env.VITE_DEV_GITHUB_URL || "https://github.com/your-repo-link";
const DEV_EMAIL = import.meta.env.VITE_DEV_EMAIL || "dev@example.com";
const EXT_VERSION = import.meta.env.VITE_EXTENSION_VERSION || "0.0.0";

const selectedTheme = ref("default");
const reporting = ref(false);
const statusMessage = ref("");
const lastScreenshotDataUrl = ref<string | null>(null);
// const EXT_VERSION = EXT_VERSION;

/* restore theme on mount */
onMounted(() => {
  browser.storage.sync.get("theme", ({ theme }) => {
    selectedTheme.value = theme || "default";
  });
});

/* set theme */
const setTheme = () => {
  browser.storage.sync.set({ theme: selectedTheme.value });
};

/* helper: convert dataURL -> blob */
async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return await res.blob();
}

/* helper: capture a screenshot of the visible tab */
async function captureVisibleTab(): Promise<string> {
  // Try browser.tabs.captureVisibleTab (Firefox-style), fallback to chrome API shape:
  try {
    // Some implementations accept windowId and options, some accept just options.
    // We'll attempt typical signatures; handle errors gracefully.
    // @ts-ignore
    const maybe = await browser.tabs.captureVisibleTab?.(); // returns dataURL
    if (maybe) return maybe;
  } catch (e) {
    // ignore and try alternative shapes below
  }

  try {
    // @ts-ignore
    const maybe2 = await browser.tabs.captureVisibleTab(undefined, { format: "png" });
    if (maybe2) return maybe2;
  } catch (e) {
    // On Chrome, captureVisibleTab is on chrome.tabs — try that using window global (best-effort).
    try {
      // @ts-ignore
      const maybe3 = await (window as any).chrome?.tabs?.captureVisibleTab?.();
      if (maybe3) return maybe3;
    } catch (err) {
      // fallthrough
    }
  }

  throw new Error("captureVisibleTab is not available in this runtime.");
}

/* attempt to open native share (with file) */
async function tryNativeShare(file: File, subject: string, body: string): Promise<boolean> {
  try {
    // @ts-ignore
    if (navigator?.canShare && navigator.canShare({ files: [file] })) {
      // @ts-ignore
      await navigator.share({ files: [file], title: subject, text: body });
      return true;
    }
  } catch (e) {
    console.warn("Native share failed:", e);
  }
  return false;
}

/* copy the image blob to clipboard (returns true if success) */
async function copyImageToClipboard(blob: Blob): Promise<boolean> {
  // ClipboardItem + navigator.clipboard.write is supported in modern browsers
  try {
    // @ts-ignore
    const item = new ClipboardItem({ [blob.type]: blob });
    // @ts-ignore
    await navigator.clipboard.write([item]);
    return true;
  } catch (e) {
    console.warn("Clipboard write failed:", e);
    return false;
  }
}

/* open a mailto: with prefilled subject/body (no attachment support) */
function openMailClient(to: string, subject: string, body: string) {
  const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  // open in new tab/window so popup doesn't close before mailto resolves
  window.open(mailto, "_blank");
}

/* opens the last screenshot (blob) in a new tab (user can save/attach manually) */
function openImageInNewTab(dataUrl: string) {
  const w = window.open();
  if (!w) {
    statusMessage.value = "Popup blocked opening new tab. Please allow popups for this extension.";
    return;
  }
  w.document.title = "Screenshot - Avocado";
  const img = w.document.createElement("img");
  img.src = dataUrl;
  img.style.maxWidth = "100%";
  img.style.height = "auto";
  img.alt = "Captured screenshot";
  w.document.body.style.margin = "0";
  w.document.body.style.padding = "10px";
  w.document.body.appendChild(img);
}

/* main report flow */
async function reportBrokenPage() {
  reporting.value = true;
  statusMessage.value = "Capturing screenshot and preparing report…";
  try {
    // Get active tab
    // @ts-ignore
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const tab = tabs && tabs[0];
    const pageUrl = tab?.url || "unknown";
    const pageTitle = tab?.title || pageUrl;

    // Capture screenshot
    let dataUrl: string;
    try {
      dataUrl = await captureVisibleTab();
    } catch (err) {
      // fallback: ask the tab content script to produce a screenshot using html2canvas or DOM -> but that's complex
      statusMessage.value = "Could not capture screenshot automatically; opening compose with page info.";
      dataUrl = "";
    }

    // Save last screenshot dataURL for manual open/download
    if (dataUrl) {
      lastScreenshotDataUrl.value = dataUrl;
    }

    // Prepare report metadata
    const now = new Date().toISOString();
    const subject = `Broken page report — ${pageTitle}`;
    const bodyLines = [
      `Developer email: ${DEV_EMAIL}`,
      `Page URL: ${pageUrl}`,
      `Selected theme: ${selectedTheme.value}`,
      `Time (UTC): ${now}`,
      `Extension version: ${EXT_VERSION}`,
      `User Agent: ${navigator.userAgent}`,
      ``,
      `Notes: (describe what's broken here)`,
      ``
    ];
    let body = bodyLines.join("\n");

    // If we have a screenshot, try to attach via Web Share; else fallback to mailto with copied screenshot instructions
    if (dataUrl) {
      const blob = await dataUrlToBlob(dataUrl);
      const file = new File([blob], `wikipedia-screenshot-${Date.now()}.png`, { type: blob.type });

      // Try native share API to attach file
      const shared = await tryNativeShare(file, subject, body);
      if (shared) {
        statusMessage.value = "Shared with native share sheet — complete.";
        reporting.value = false;
        return;
      }

      // If native share unsupported, try copy to clipboard (so user can paste into mail client)
      const copied = await copyImageToClipboard(blob);
      if (copied) {
        // inform user and open mailto
        const bodyWithHint = [
          `Screenshot: (Image copied to clipboard; please paste into your email compose window with Ctrl+V / Cmd+V)`,
          "",
          ...bodyLines
        ].join("\n");
        openMailClient(DEV_EMAIL, subject, bodyWithHint);
        statusMessage.value = "Screenshot copied to clipboard. Mail client opened — paste the image into the email (Ctrl/Cmd+V) or attach manually.";
        reporting.value = false;
        return;
      }

      // If clipboard failed, open the screenshot in new tab so user can download and attach
      openImageInNewTab(dataUrl);
      const bodyWithDownloadHint = [
        `Screenshot: opened in a new tab (please download and attach to the email).`,
        "",
        ...bodyLines
      ].join("\n");
      openMailClient(DEV_EMAIL, subject, bodyWithDownloadHint);
      statusMessage.value = "Screenshot opened in a new tab. Mail client opened — please download and attach the screenshot.";
      reporting.value = false;
      return;
    } else {
      // no screenshot available — just open email with page info
      openMailClient(DEV_EMAIL, subject, body + "\n\n(No screenshot available)");
      statusMessage.value = "Mail client opened with page info (no screenshot).";
      reporting.value = false;
      return;
    }
  } catch (err: any) {
    console.error("reportBrokenPage error:", err);
    statusMessage.value = `Error preparing report: ${err?.message || err}`;
    reporting.value = false;
  }
}

/* UI helper: open last screenshot in tab */
function openScreenshotTab() {
  if (lastScreenshotDataUrl.value) openImageInNewTab(lastScreenshotDataUrl.value);
  else statusMessage.value = "No screenshot available yet — please click 'Report broken page' first.";
}
</script>

<style scoped>
/* Popup main card */
.popup-container {
  width: 360px;
  padding: 14px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  font-family: "Roboto", system-ui, -apple-system, "Segoe UI", "Helvetica Neue", Arial;
  color: #202124;
  box-sizing: border-box;
}

/* header */
.header-row { display:flex; align-items:center; gap:12px; margin-bottom:6px; }
.main-header { font-size:18px; margin:0; color:#1a73e8; line-height:1; }
.description { font-size:12px; margin:2px 0 0 0; color:#5f6368; }

/* sections */
.section-title { font-size:13px; margin:0 0 8px 0; font-weight:600; color:#202124; }

/* theme selector block */
.theme-selector-container {
  margin: 8px 0;
  background: #f7f9fb;
  border: 1px solid #e6e9ee;
  padding: 10px;
  border-radius: 10px;
}
.theme-dropdown {
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #dfe5ea;
  background: #fff;
  font-size:14px;
  color:#202124;
}
.theme-dropdown:focus { outline: none; box-shadow: 0 6px 18px rgba(26,115,232,0.08); border-color:#1a73e8; }

/* developer */
.developer-section {
  margin-top:10px;
  padding:10px;
  background:#f7f9fb;
  border:1px solid #e6e9ee;
  border-radius:10px;
}
.button-group { display:flex; gap:8px; }
.material-button {
  display:inline-flex;
  align-items:center;
  justify-content:center;
  text-decoration:none;
  padding:8px 10px;
  background:#1a73e8;
  color:#fff;
  border-radius:8px;
  font-weight:600;
  border:none;
  cursor:pointer;
  box-shadow: 0 4px 12px rgba(26, 115, 232, 0.12);
}
.material-button.secondary { background:#e8f0fe; color:#1a73e8; box-shadow:none; border:1px solid #dbe7ff; }
.material-button.destructive { background:#d93025; box-shadow:none; }

/* report controls */
.report-section {
  margin-top: 12px;
  padding: 10px;
  border-radius: 10px;
  background:#fff;
  border:1px solid #eef2f6;
}
.report-controls { display:flex; gap:10px; align-items:center; }

/* small hints & footer */
.hint { font-size:12px; color:#5f6368; margin:8px 0 0 0; }
.footer { margin-top:10px; text-align:right; font-size:11px; color:#9aa0a6; }
</style>
