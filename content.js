(() => {
  const PROCESSED_ATTR = 'data-chatgpt-latex-copy-ready';
  const HOVER_CLASS = 'chatgpt-latex-copy-hover';
  const SUCCESS_CLASS = 'chatgpt-latex-copy-success';
  const HINT_ID = 'chatgpt-latex-copy-hint';

  const FALLBACK_MESSAGES = {
    copyFormulaHint: 'Left-click to copy formula',
    copySuccess: 'Copied',
    latexNotFound: 'LaTeX not found',
    copyFailed: 'Copy failed'
  };

  function t(messageName) {
    if (typeof chrome !== 'undefined' && chrome.i18n?.getMessage) {
      const localized = chrome.i18n.getMessage(messageName);
      if (localized) return localized;
    }

    return FALLBACK_MESSAGES[messageName] || messageName;
  }

  console.info(
    '[ChatGPT LaTeX Copy] v1.6.0 loaded',
    typeof chrome !== 'undefined' && chrome.i18n?.getUILanguage
      ? `(${chrome.i18n.getUILanguage()})`
      : ''
  );

  let activeFormula = null;
  let hideTimer = null;

  function extractLatex(element) {
    const annotation = element.querySelector(
      'annotation[encoding="application/x-tex"]'
    );
    return annotation?.textContent?.trim() || null;
  }

  function isDisplayFormula(element) {
    return element.classList.contains('katex-display');
  }

  function formatLatex(element) {
    const latex = extractLatex(element);
    if (!latex) return null;

    return isDisplayFormula(element)
      ? `$$\n${latex}\n$$`
      : `$${latex}$`;
  }

  function getFormulaElements() {
    const formulas = [];

    document.querySelectorAll('.katex-display').forEach((element) => {
      formulas.push(element);
    });

    document.querySelectorAll('.katex').forEach((element) => {
      if (!element.closest('.katex-display')) {
        formulas.push(element);
      }
    });

    return formulas;
  }

  function getHint() {
    let hint = document.getElementById(HINT_ID);

    if (!hint) {
      hint = document.createElement('div');
      hint.id = HINT_ID;
      hint.setAttribute('role', 'status');
      hint.setAttribute('aria-live', 'polite');
      hint.hidden = true;
      document.body.appendChild(hint);
    }

    return hint;
  }

  function positionHint(formula, hint) {
    const rect = formula.getBoundingClientRect();
    const gap = 8;
    const padding = 8;

    hint.hidden = false;
    hint.style.visibility = 'hidden';

    const hintRect = hint.getBoundingClientRect();

    let left = rect.right - hintRect.width;
    let top = rect.top - hintRect.height - gap;

    left = Math.max(
      padding,
      Math.min(left, window.innerWidth - hintRect.width - padding)
    );

    if (top < padding) {
      top = rect.bottom + gap;
    }

    top = Math.max(
      padding,
      Math.min(top, window.innerHeight - hintRect.height - padding)
    );

    hint.style.left = `${Math.round(left)}px`;
    hint.style.top = `${Math.round(top)}px`;
    hint.style.visibility = 'visible';
  }

  function showHint(formula, text = t('copyFormulaHint'), state = 'hint') {
    clearTimeout(hideTimer);

    const hint = getHint();
    hint.textContent = text;
    hint.dataset.state = state;

    positionHint(formula, hint);
  }

  function hideHint() {
    const hint = document.getElementById(HINT_ID);
    if (hint) hint.hidden = true;
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      hideHint();
    }, 120);
  }

  async function copyFormula(formula) {
    const text = formatLatex(formula);

    if (!text) {
      showHint(formula, t('latexNotFound'), 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);

      formula.classList.add(SUCCESS_CLASS);
      showHint(formula, t('copySuccess'), 'success');

      setTimeout(() => {
        formula.classList.remove(SUCCESS_CLASS);

        if (activeFormula === formula) {
          showHint(formula, t('copyFormulaHint'), 'hint');
        }
      }, 900);
    } catch (error) {
      console.error('[ChatGPT LaTeX Copy] copy failed:', error);
      showHint(formula, t('copyFailed'), 'error');
    }
  }

  function prepareFormula(formula) {
    if (formula.hasAttribute(PROCESSED_ATTR)) return;
    if (!extractLatex(formula)) return;

    formula.setAttribute(PROCESSED_ATTR, 'true');

    formula.addEventListener('mouseenter', () => {
      activeFormula = formula;
      formula.classList.add(HOVER_CLASS);
      showHint(formula, t('copyFormulaHint'), 'hint');
    });

    formula.addEventListener('mouseleave', () => {
      formula.classList.remove(HOVER_CLASS);

      if (activeFormula === formula) {
        activeFormula = null;
      }

      scheduleHide();
    });

    formula.addEventListener('click', (event) => {
      if (event.button !== 0) return;

      event.preventDefault();
      event.stopPropagation();

      copyFormula(formula);
    });
  }

  function scanFormulas() {
    getFormulaElements().forEach(prepareFormula);
  }

  let scanScheduled = false;

  function scheduleScan() {
    if (scanScheduled) return;

    scanScheduled = true;

    requestAnimationFrame(() => {
      scanScheduled = false;
      scanFormulas();
    });
  }

  function refreshHintPosition() {
    const hint = document.getElementById(HINT_ID);

    if (!activeFormula || !hint || hint.hidden) return;

    positionHint(activeFormula, hint);
  }

  scanFormulas();

  const observer = new MutationObserver(scheduleScan);

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  window.addEventListener('scroll', refreshHintPosition, true);
  window.addEventListener('resize', refreshHintPosition);
})();
