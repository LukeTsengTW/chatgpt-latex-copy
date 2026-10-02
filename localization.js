(() => {
  const STORAGE_KEY = 'displayLanguage';

  const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'zh_TW', name: '繁體中文' },
    { code: 'zh_CN', name: '简体中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' }
  ];

  const MESSAGES = {
    en: {
      copyFormulaHint: 'Left-click to copy formula',
      copySuccess: 'Copied',
      latexNotFound: 'LaTeX not found',
      copyFailed: 'Copy failed',
      settingsTitle: 'Display language',
      settingsDescription: 'Choose the language used by the extension.',
      followBrowser: 'Follow browser language',
      saved: 'Language updated'
    },
    zh_TW: {
      copyFormulaHint: '左鍵複製公式',
      copySuccess: '複製成功',
      latexNotFound: '找不到 LaTeX',
      copyFailed: '複製失敗',
      settingsTitle: '顯示語言',
      settingsDescription: '選擇插件介面所使用的語言。',
      followBrowser: '跟隨瀏覽器語言',
      saved: '語言已更新'
    },
    zh_CN: {
      copyFormulaHint: '左键复制公式',
      copySuccess: '复制成功',
      latexNotFound: '找不到 LaTeX',
      copyFailed: '复制失败',
      settingsTitle: '显示语言',
      settingsDescription: '选择插件界面使用的语言。',
      followBrowser: '跟随浏览器语言',
      saved: '语言已更新'
    },
    ja: {
      copyFormulaHint: '左クリックで数式をコピー',
      copySuccess: 'コピーしました',
      latexNotFound: 'LaTeX が見つかりません',
      copyFailed: 'コピーに失敗しました',
      settingsTitle: '表示言語',
      settingsDescription: '拡張機能で使用する言語を選択します。',
      followBrowser: 'ブラウザの言語に従う',
      saved: '言語を更新しました'
    },
    ko: {
      copyFormulaHint: '왼쪽 클릭으로 수식 복사',
      copySuccess: '복사 완료',
      latexNotFound: 'LaTeX를 찾을 수 없음',
      copyFailed: '복사 실패',
      settingsTitle: '표시 언어',
      settingsDescription: '확장 프로그램에서 사용할 언어를 선택하세요.',
      followBrowser: '브라우저 언어 따르기',
      saved: '언어가 업데이트됨'
    },
    es: {
      copyFormulaHint: 'Clic izquierdo para copiar la fórmula',
      copySuccess: 'Copiado',
      latexNotFound: 'No se encontró LaTeX',
      copyFailed: 'Error al copiar',
      settingsTitle: 'Idioma de visualización',
      settingsDescription: 'Elige el idioma que utilizará la extensión.',
      followBrowser: 'Seguir el idioma del navegador',
      saved: 'Idioma actualizado'
    },
    fr: {
      copyFormulaHint: 'Clic gauche pour copier la formule',
      copySuccess: 'Copié',
      latexNotFound: 'LaTeX introuvable',
      copyFailed: 'Échec de la copie',
      settingsTitle: 'Langue d’affichage',
      settingsDescription: 'Choisissez la langue utilisée par l’extension.',
      followBrowser: 'Suivre la langue du navigateur',
      saved: 'Langue mise à jour'
    },
    de: {
      copyFormulaHint: 'Linksklick zum Kopieren der Formel',
      copySuccess: 'Kopiert',
      latexNotFound: 'LaTeX nicht gefunden',
      copyFailed: 'Kopieren fehlgeschlagen',
      settingsTitle: 'Anzeigesprache',
      settingsDescription: 'Wähle die Sprache der Erweiterung aus.',
      followBrowser: 'Browsersprache verwenden',
      saved: 'Sprache aktualisiert'
    }
  };

  function normalizeBrowserLocale(locale) {
    const value = String(locale || '').replace('-', '_').toLowerCase();

    if (value.startsWith('zh')) {
      if (
        value.includes('_tw') ||
        value.includes('_hk') ||
        value.includes('_mo') ||
        value.includes('hant')
      ) {
        return 'zh_TW';
      }
      return 'zh_CN';
    }

    const base = value.split('_')[0];
    const supported = LANGUAGES.find(
      (language) => language.code.toLowerCase() === base
    );

    return supported?.code || 'en';
  }

  function getBrowserLocale() {
    if (typeof chrome !== 'undefined' && chrome.i18n?.getUILanguage) {
      return normalizeBrowserLocale(chrome.i18n.getUILanguage());
    }

    return normalizeBrowserLocale(navigator.language);
  }

  function resolveEffectiveLocale(selection) {
    if (!selection || selection === 'auto') {
      return getBrowserLocale();
    }

    return LANGUAGES.some((language) => language.code === selection)
      ? selection
      : 'en';
  }

  function t(key, locale) {
    const effectiveLocale = resolveEffectiveLocale(locale);
    return (
      MESSAGES[effectiveLocale]?.[key] ??
      MESSAGES.en[key] ??
      key
    );
  }

  function getPreference() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(
        { [STORAGE_KEY]: 'auto' },
        (result) => resolve(result[STORAGE_KEY] || 'auto')
      );
    });
  }

  function setPreference(value) {
    const selection =
      value === 'auto' ||
      LANGUAGES.some((language) => language.code === value)
        ? value
        : 'auto';

    return new Promise((resolve) => {
      chrome.storage.sync.set(
        { [STORAGE_KEY]: selection },
        () => resolve(selection)
      );
    });
  }

  async function getEffectiveLocale() {
    const preference = await getPreference();
    return resolveEffectiveLocale(preference);
  }

  globalThis.ChatGPTLatexCopyI18n = Object.freeze({
    STORAGE_KEY,
    LANGUAGES,
    MESSAGES,
    t,
    getBrowserLocale,
    getPreference,
    setPreference,
    getEffectiveLocale,
    resolveEffectiveLocale
  });
})();
