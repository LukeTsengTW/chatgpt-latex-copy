# ChatGPT LaTeX Copy

A lightweight Chrome extension for copying LaTeX directly from formulas rendered in the ChatGPT web interface.

## Features

- Hover over a rendered ChatGPT formula to show **「左鍵複製公式」**
- Left-click the formula to copy only that formula
- Shows **「複製成功」** after a successful copy
- Inline formulas are copied as `$...$`
- Display formulas are copied as `$$...$$`
- Reads the original TeX from KaTeX's `annotation[encoding="application/x-tex"]`
- Works with dynamically rendered ChatGPT responses through `MutationObserver`

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

Move the mouse over a rendered formula in ChatGPT. A hint reading **「左鍵複製公式」** will appear. Left-click the formula to copy its LaTeX source.

After a successful copy, the formula is briefly highlighted and the hint changes to **「複製成功」**.

## Version

Current version: **1.5.0**

## Files

- `manifest.json` — Chrome Manifest V3 configuration
- `content.js` — formula detection, hover interaction, and clipboard logic
- `content.css` — hover, success, and hint styles

## Notes

This extension depends on KaTeX markup currently exposed by the ChatGPT web interface. If ChatGPT changes its formula-rendering DOM in the future, selectors may need to be updated.
