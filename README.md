# ChatGPT LaTeX Copy

![ChatGPT LaTeX Copy icon](icons/icon128.png)

A lightweight Chrome extension for copying LaTeX directly from formulas rendered in the ChatGPT web interface.

## Features

- Hover over a rendered ChatGPT formula to show a localized copy hint
- Left-click a formula to copy only that formula
- Shows localized success/error feedback
- Copies inline formulas using the `$...$` delimiter
- Copies display formulas using the `$$...$$` delimiter
- Reads the original TeX from KaTeX's `annotation[encoding="application/x-tex"]`
- Works with dynamically rendered ChatGPT responses through `MutationObserver`
- Automatically follows Chrome's UI language by default
- Lets users manually override the extension display language from the toolbar popup
- Saves the selected language with `chrome.storage.sync`
- Applies language changes to open ChatGPT tabs immediately
- Includes a built-in **Markdown + KaTeX Preview**
- Sanitizes rendered Markdown locally with DOMPurify before displaying it

## Supported languages

- English (`en`) — default / fallback
- Traditional Chinese (`zh_TW`)
- Simplified Chinese (`zh_CN`)
- Japanese (`ja`)
- Korean (`ko`)
- Spanish (`es`)
- French (`fr`)
- German (`de`)

## Language settings

Click the **ChatGPT LaTeX Copy** icon in the Chrome toolbar to open the language selector.

Available choices:

- **Follow browser language** — uses Chrome's current UI language
- English
- 繁體中文
- 简体中文
- 日本語
- 한국어
- Español
- Français
- Deutsch

The selected preference is stored with `chrome.storage.sync`, so it can follow the user's Chrome profile where extension sync is available.

Runtime UI such as the hover hint, success message, error messages, popup, and preview page follows the manually selected language.

> Chrome-managed UI such as the extension name and description on `chrome://extensions/` still follows Chrome's Manifest i18n language and cannot be changed dynamically at runtime.

## Markdown + KaTeX Preview

Click the extension icon and choose **Open Markdown + KaTeX Preview** to open a split editor/preview page.

The preview supports standard Markdown plus:

- Inline math with the `$...$` delimiter, for example `$f(x)=x^2$`
- Display math with the `$$...$$` delimiter
- GFM tables, lists, links, blockquotes, and fenced code blocks
- Left-click copy for formulas rendered inside the preview
- Live preview while typing

Preview text is stored with `chrome.storage.local`, so it stays in the current browser profile instead of being synchronized as extension settings.

The preview uses locally bundled dependencies and does not load executable JavaScript from a CDN at runtime.

### Example

Inline formula:

```text
$E=mc^2$
```

Display formula:

```text
$$
x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}
$$
```

Markdown preview example:

````markdown
# Calculus

Inline formula: $f(x)=x^2+1$

$$
\lim_{x\to a}[f(x)+g(x)]
=
\lim_{x\to a}f(x)+\lim_{x\to a}g(x)
$$
````

## Installation

1. Clone or download this repository.
2. Open `chrome://extensions/` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the repository folder.
6. Open or refresh `https://chatgpt.com/`.

## Usage

Move the mouse over a rendered formula in ChatGPT. The extension shows a localized copy hint. Left-click the formula to copy its LaTeX source.

After a successful copy, the formula is briefly highlighted and a localized success message is displayed.

For Markdown preview, click the extension icon and select **Open Markdown + KaTeX Preview**.

## Internationalization

The extension uses two localization layers:

1. Chrome Manifest i18n under `_locales/` for browser-managed extension metadata.
2. `localization.js` for runtime language switching in the popup, ChatGPT content script, and preview page.

Localized manifest strings live under:

```text
_locales/
├── en/messages.json
├── zh_TW/messages.json
├── zh_CN/messages.json
├── ja/messages.json
├── ko/messages.json
├── es/messages.json
├── fr/messages.json
└── de/messages.json
```

The manifest uses:

```json
{
  "default_locale": "en",
  "name": "__MSG_extensionName__",
  "description": "__MSG_extensionDescription__"
}
```

## Privacy and local processing

- Formula extraction is performed locally in the browser.
- Preview rendering is performed locally in the browser.
- Preview Markdown is stored with `chrome.storage.local`.
- Display-language preference is stored with `chrome.storage.sync`.
- No analytics, advertising SDKs, or developer-operated backend are used.

## Development

The Markdown preview uses locally bundled dependencies:

- KaTeX
- Marked
- DOMPurify

To rebuild the generated preview dependency bundle:

```bash
npm install
npm run build:preview
```

GitHub Actions also rebuilds `vendor/preview-deps.js` when the dependency source or build configuration changes.

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for third-party license information.

## Version

Current version: **1.8.0**

## Project files

- `manifest.json` — Chrome Manifest V3 configuration
- `content.js` — ChatGPT formula detection, copying, and live language updates
- `content.css` — formula hover and feedback styles
- `localization.js` — runtime translations and language preference helpers
- `popup.html` / `popup.css` / `popup.js` — toolbar settings and preview launcher
- `preview.html` / `preview.css` / `preview.js` — built-in Markdown + KaTeX preview
- `src/preview-deps.js` — source entrypoint for bundled preview dependencies
- `vendor/preview-deps.js` — generated local Marked + KaTeX bundle
- `vendor/purify.min.js` — bundled DOMPurify sanitizer
- `_locales/*/messages.json` — Manifest i18n translations
- `icons/` — extension icons

## Notes

The ChatGPT formula-copy feature depends on KaTeX markup currently exposed by the ChatGPT web interface. If ChatGPT changes its formula-rendering DOM in the future, selectors may need to be updated.

## Privacy Policy

See [PRIVACY.md](PRIVACY.md) for details about local data processing, storage, and permissions.

## License

This project is licensed under the [MIT License](LICENSE).
