# ChatGPT LaTeX Copy

![ChatGPT LaTeX Copy icon](icons/icon128.png)

A lightweight Chrome extension for copying LaTeX directly from formulas rendered in the ChatGPT web interface.

## Features

- Hover over a rendered ChatGPT formula to show a localized copy hint
- Left-click the formula to copy only that formula
- Shows localized success/error feedback
- Inline formulas are copied as `$...$`
- Display formulas are copied as `$$...$$`
- Reads the original TeX from KaTeX's `annotation[encoding="application/x-tex"]`
- Works with dynamically rendered ChatGPT responses through `MutationObserver`
- Automatically follows Chrome's UI language through `chrome.i18n`

## Supported languages

- English (`en`) — default / fallback
- Traditional Chinese (`zh_TW`)
- Simplified Chinese (`zh_CN`)
- Japanese (`ja`)
- Korean (`ko`)
- Spanish (`es`)
- French (`fr`)
- German (`de`)

Chrome automatically selects the best matching locale. If a localized message is unavailable, the extension falls back to English.

## Example

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

## Installation

1. Clone or download this repository.
2. Open `chrome://extensions/` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the repository folder.
6. Open or refresh `https://chatgpt.com/`.

## Usage

Move the mouse over a rendered formula in ChatGPT. The extension shows a copy hint in the current Chrome UI language. Left-click the formula to copy its LaTeX source.

After a successful copy, the formula is briefly highlighted and the localized success message is displayed.

## Internationalization

Localization uses Chrome Extension's native `chrome.i18n` API.

Localized strings live under:

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

User-visible strings in `content.js` are resolved with `chrome.i18n.getMessage()`.

## Version

Current version: **1.6.0**

## Files

- `manifest.json` — Chrome Manifest V3 configuration and localization metadata
- `content.js` — formula detection, localized hover interaction, and clipboard logic
- `content.css` — hover, success, and hint styles
- `_locales/*/messages.json` — localized user-visible strings
- `icons/` — extension icons

## Notes

This extension depends on KaTeX markup currently exposed by the ChatGPT web interface. If ChatGPT changes its formula-rendering DOM in the future, selectors may need to be updated.

## Extension icon

The extension includes PNG icons in 16, 32, 48, and 128 pixel sizes under `icons/`. The icon is registered through the Manifest V3 `icons` field.

## License

This project is licensed under the [MIT License](LICENSE).
