(() => {
  const I18N = globalThis.ChatGPTLatexCopyI18n;
  const DEPS = globalThis.ChatGPTLatexPreviewDeps;
  const purifier = globalThis.DOMPurify;

  const CONTENT_KEY = 'previewMarkdown';
  const CODE_TOKEN_PREFIX = 'XQZCODESEGMENT';
  const MATH_INLINE_PREFIX = 'XQZMATHINLINE';
  const MATH_BLOCK_PREFIX = 'XQZMATHBLOCK';
  const TOKEN_SUFFIX = 'ZQX';

  const input = document.getElementById('markdown-input');
  const output = document.getElementById('preview-output');
  const sampleButton = document.getElementById('sample-button');
  const clearButton = document.getElementById('clear-button');
  const toast = document.getElementById('toast');

  let currentLocale = 'en';
  let renderTimer = null;
  let saveTimer = null;
  let toastTimer = null;
  let currentMathItems = [];

  const SAMPLE = String.raw`# Markdown + KaTeX Preview

Write normal **Markdown** together with inline and display math.

Inline formula: $f(x)=x^2+1$

A limit can stay inside a sentence: $\lim_{x\to a} f(x)=L$.

## Display formula

$$
\lim_{x\to a}[f(x)+g(x)]
=
\lim_{x\to a}f(x)+\lim_{x\to a}g(x)
$$

## Markdown also works

- **Bold**
- *Italic*
- [Links](https://example.com)
- Tables and code blocks

| Term | Formula |
| --- | --- |
| Integral | $\int_a^b f(x)\,dx$ |
| Derivative | $f'(x)$ |

\`\`\`text
Dollar signs inside code are not rendered: $x^2$
\`\`\`
`;

  function t(key) {
    return I18N.t(key, currentLocale);
  }

  function applyLocale(locale) {
    currentLocale = locale;
    document.documentElement.lang = locale.replace('_', '-');

    document.getElementById('preview-title').textContent = t('previewTitle');
    document.getElementById('preview-subtitle').textContent = t('previewSubtitle');
    document.getElementById('editor-label').textContent = t('previewEditorLabel');
    document.getElementById('output-label').textContent = t('previewOutputLabel');
    document.getElementById('local-note').textContent = t('previewLocalNote');
    sampleButton.textContent = t('previewLoadSample');
    clearButton.textContent = t('previewClear');
    input.setAttribute('aria-label', t('previewEditorLabel'));
  }

  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 1100);
  }

  function protectCodeSegments(source) {
    const segments = [];

    const protectedSource = source.replace(
      /(^|\n)([ \t]*)(```|~~~)[^\n]*\n[\s\S]*?\n\2\3[ \t]*(?=\n|$)|`[^\n`]*`/g,
      (match) => {
        const token = `${CODE_TOKEN_PREFIX}${segments.length}${TOKEN_SUFFIX}`;
        segments.push(match);
        return token;
      }
    );

    return { protectedSource, segments };
  }

  function restoreCodeSegments(source, segments) {
    let restored = source;

    segments.forEach((segment, index) => {
      const token = `${CODE_TOKEN_PREFIX}${index}${TOKEN_SUFFIX}`;
      restored = restored.split(token).join(segment);
    });

    return restored;
  }

  function extractMath(source) {
    const mathItems = [];
    const escapedDollar = 'XQZESCAPEDDOLLARZQX';

    let working = source.replace(/\\\$/g, escapedDollar);

    working = working.replace(/\$\$([\s\S]*?)\$\$/g, (_match, tex) => {
      const index = mathItems.length;
      const token = `${MATH_BLOCK_PREFIX}${index}${TOKEN_SUFFIX}`;

      mathItems.push({
        tex: tex.trim(),
        displayMode: true,
        token
      });

      return `\n${token}\n`;
    });

    working = working.replace(/\$([^$\n]+?)\$/g, (_match, tex) => {
      const index = mathItems.length;
      const token = `${MATH_INLINE_PREFIX}${index}${TOKEN_SUFFIX}`;

      mathItems.push({
        tex: tex.trim(),
        displayMode: false,
        token
      });

      return token;
    });

    working = working.split(escapedDollar).join('\\$');

    return { source: working, mathItems };
  }

  function renderMathItem(item, index) {
    try {
      const mathMl = DEPS.katex.renderToString(item.tex, {
        displayMode: item.displayMode,
        throwOnError: true,
        output: 'mathml',
        strict: 'ignore',
        trust: false
      });

      const className = item.displayMode
        ? 'preview-math preview-math-display'
        : 'preview-math preview-math-inline';

      return `<span class="${className}" data-math-index="${index}">${mathMl}</span>`;
    } catch (error) {
      const safeMessage = String(error?.message || error)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');

      return `<span class="math-error">${safeMessage}</span>`;
    }
  }

  function insertRenderedMath(html, mathItems) {
    let result = html;

    mathItems.forEach((item, index) => {
      const rendered = renderMathItem(item, index);

      if (item.displayMode) {
        const paragraphPattern = new RegExp(
          `<p>\\s*${item.token}\\s*</p>`,
          'g'
        );
        result = result.replace(paragraphPattern, rendered);
      }

      result = result.split(item.token).join(rendered);
    });

    return result;
  }

  function render() {
    if (!DEPS?.marked || !DEPS?.katex || !purifier) {
      output.textContent = t('previewDependencyError');
      return;
    }

    const raw = input.value;
    const protectedCode = protectCodeSegments(raw);
    const extracted = extractMath(protectedCode.protectedSource);
    const markdownSource = restoreCodeSegments(
      extracted.source,
      protectedCode.segments
    );

    currentMathItems = extracted.mathItems;

    const markdownHtml = DEPS.marked.parse(markdownSource, {
      gfm: true,
      breaks: false
    });

    const sanitized = purifier.sanitize(markdownHtml, {
      USE_PROFILES: { html: true }
    });

    output.innerHTML = insertRenderedMath(sanitized, currentMathItems);

    output.querySelectorAll('a').forEach((link) => {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });

    output.querySelectorAll('[data-math-index]').forEach((element) => {
      const index = Number(element.dataset.mathIndex);
      const item = currentMathItems[index];

      element.title = t('copyFormulaHint');

      element.addEventListener('click', async () => {
        if (!item) return;

        const text = item.displayMode
          ? `$$\n${item.tex}\n$$`
          : `$${item.tex}$`;

        try {
          await navigator.clipboard.writeText(text);
          showToast(t('copySuccess'));
        } catch (error) {
          console.error('[ChatGPT LaTeX Copy] preview copy failed:', error);
          showToast(t('copyFailed'));
        }
      });
    });

    document.getElementById('render-status').textContent =
      t('previewRendered');
  }

  function scheduleRender() {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(render, 90);
  }

  function scheduleSave() {
    clearTimeout(saveTimer);

    saveTimer = setTimeout(() => {
      chrome.storage.local.set({
        [CONTENT_KEY]: input.value
      });
    }, 300);
  }

  function setContent(value) {
    input.value = value;
    chrome.storage.local.set({
      [CONTENT_KEY]: value
    });
    render();
  }

  async function init() {
    currentLocale = await I18N.getEffectiveLocale();
    applyLocale(currentLocale);

    chrome.storage.local.get(
      { [CONTENT_KEY]: SAMPLE },
      (result) => {
        input.value = result[CONTENT_KEY] || '';
        render();
      }
    );

    input.addEventListener('input', () => {
      scheduleRender();
      scheduleSave();
    });

    sampleButton.addEventListener('click', () => {
      setContent(SAMPLE);
      input.focus();
    });

    clearButton.addEventListener('click', () => {
      setContent('');
      input.focus();
    });

    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (
        areaName === 'sync' &&
        changes[I18N.STORAGE_KEY]
      ) {
        const nextLocale = I18N.resolveEffectiveLocale(
          changes[I18N.STORAGE_KEY].newValue
        );
        applyLocale(nextLocale);
        render();
      }
    });
  }

  init();
})();
