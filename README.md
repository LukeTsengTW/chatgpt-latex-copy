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
- Automatically follows Chrome's UI language by default
- Lets users manually override the extension display language from the toolbar popup
- Saves the selected language with `chrome.storage.sync`
- Applies language changes to open ChatGPT tabs immediately

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

Runtime UI such as the hover hint, success message, error messages, and the popup itself follows the manually selected language.

> Chrome's extension name and description shown in browser-managed UI such as `chrome://extensions/` are still localized by Chrome's Manifest i18n system and therefore follow Chrome's UI language. Chrome does not allow those manifest strings to be changed dynamically at runtime.

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

Move the mouse over a rendered formula in ChatGPT. The extension shows a copy hint in the selected display language. Left-click the formula to copy its LaTeX source.

After a successful copy, the formula is briefly highlighted and the localized success message is displayed.

## Internationalization

The extension uses two layers of localization:

1. Chrome Manifest i18n under `_locales/` for browser-managed extension metadata.
2. `localization.js` for runtime language switching in the popup and ChatGPT content script.

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

## Version

Current version: **1.7.0**

## Files

- `manifest.json` — Chrome Manifest V3 configuration
- `content.js` — formula detection, hover interaction, clipboard logic, and live language updates
- `content.css` — hover, success, and hint styles
- `localization.js` — supported languages, translations, browser-language detection, and stored preference helpers
- `popup.html` — toolbar language settings UI
- `popup.css` — toolbar popup styles
- `popup.js` — manual language selection and persistence
- `_locales/*/messages.json` — browser-managed localized extension metadata
- `icons/` — extension icons

## Notes

This extension depends on KaTeX markup currently exposed by the ChatGPT web interface. If ChatGPT changes its formula-rendering DOM in the future, selectors may need to be updated.

## Extension icon

The extension includes PNG icons in 16, 32, 48, and 128 pixel sizes under `icons/`. The icon is registered through the Manifest V3 `icons` and `action.default_icon` fields.

## License

This project is licensed under the [MIT License](LICENSE).
