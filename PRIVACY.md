# Privacy Policy

_Last updated: October 29, 2026_

ChatGPT LaTeX Copy is a Chrome extension that helps users copy LaTeX from formulas rendered on ChatGPT and preview Markdown with mathematical notation.

This privacy policy explains what data the extension processes, where that data is stored, and how it is used.

## Summary

ChatGPT LaTeX Copy does not collect, sell, transmit, or share user data with the developer or third parties.

The extension processes data only as needed to provide its stated functionality. Formula extraction, selection-copy transformation, Markdown rendering, and copy actions are performed locally in the user's browser.

The extension does not use analytics, advertising, tracking, telemetry, or a developer-operated backend server.

## Data processed by the extension

### Website content

On `https://chatgpt.com/`, the extension reads KaTeX-rendered mathematical formula elements so it can:

- detect formulas rendered in ChatGPT;
- extract the original TeX stored in KaTeX markup;
- copy an individual formula to the user's clipboard after an explicit left-click; and
- when the user explicitly copies a text selection containing rendered formulas, temporarily process that selected content so the formulas can be replaced with their original LaTeX while preserving the surrounding text order.

For selection copying, the extension processes only the content included in the user's active selection and only when the selection contains a recognized KaTeX formula. Selections without a recognized formula are left to the browser's normal copy behavior.

The extension does not intentionally collect, retain, or transmit ChatGPT conversation content. Formula content and selected text are processed locally in the browser and are not sent to the developer or to any third party.

### Markdown preview content

The built-in Markdown + KaTeX Preview processes Markdown entered by the user in order to render a live local preview.

Preview content is stored using `chrome.storage.local` so it can remain available in the same browser profile.

This content is not sent to the developer or to any third party.

### Display-language preference

The user's selected extension display language is stored using `chrome.storage.sync`.

Because `chrome.storage.sync` is a Chrome platform feature, this preference may be synchronized by Chrome across browsers signed in to the same Google account, subject to the user's Chrome sync settings.

The extension does not send this preference to the developer.

## Permissions

### `clipboardWrite`

Used for explicit formula-copy actions initiated by the user. Individual formula copying writes the extracted LaTeX directly to the clipboard after a left-click. Mixed text/formula copying is handled only during a user-initiated browser copy event such as `Ctrl+C`, `Cmd+C`, or the context-menu Copy command.

### `storage`

Used for:

- storing the display-language preference with `chrome.storage.sync`; and
- storing Markdown preview content with `chrome.storage.local`.

### Access to `https://chatgpt.com/*`

Used only to detect and interact with KaTeX-rendered mathematical formulas on ChatGPT and to transform formulas inside an explicitly copied selection.

The extension does not request access to all websites.

## Data sharing and sale

ChatGPT LaTeX Copy does not:

- sell user data;
- transfer user data to third parties for advertising or marketing;
- use user data for purposes unrelated to the extension's functionality;
- use user data to determine creditworthiness or for lending purposes; or
- allow the developer or other people to read users' formula, selected conversation, or Markdown content through any backend service.

## Remote code and third-party libraries

The extension does not execute remotely hosted JavaScript or WebAssembly.

Libraries used by the built-in preview, including KaTeX, Marked, and DOMPurify, are bundled locally with the extension package.

No executable code is loaded from a CDN at runtime.

## Data retention and deletion

### Markdown preview content

Markdown preview content remains in `chrome.storage.local` until the user clears it, the extension removes it, or the extension/browser profile data is removed.

### Display-language preference

The language preference remains in `chrome.storage.sync` until it is changed or removed, subject to Chrome's synchronization behavior and the user's Chrome sync settings.

The developer does not maintain a separate copy of this data.

Copied formula and selection content is not stored by the extension after the copy action completes.

## Security

The extension minimizes data access by restricting its ChatGPT content script to `https://chatgpt.com/*` and by processing supported content locally in the browser.

Rendered Markdown is sanitized locally before being displayed in the preview.

## Changes to this policy

This privacy policy may be updated if the extension's functionality, permissions, or data-handling behavior changes.

Material changes will be reflected in this document and the "Last updated" date above.

## Contact

For privacy questions or issues, please use the project's GitHub Issues page:

https://github.com/LukeTsengTW/chatgpt-latex-copy/issues
