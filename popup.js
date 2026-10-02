(() => {
  const I18N = globalThis.ChatGPTLatexCopyI18n;

  const select = document.getElementById('language-select');
  const label = document.getElementById('language-label');
  const description = document.getElementById('description');
  const browserLanguage = document.getElementById('browser-language');
  const status = document.getElementById('status');
  const openPreviewButton = document.getElementById('open-preview');

  function localeName(code) {
    return I18N.LANGUAGES.find((language) => language.code === code)?.name || code;
  }

  function renderText(locale) {
    document.documentElement.lang = locale.replace('_', '-');
    label.textContent = I18N.t('settingsTitle', locale);
    description.textContent = I18N.t('settingsDescription', locale);
    openPreviewButton.textContent = I18N.t('openPreview', locale);

    const browserLocale = I18N.getBrowserLocale();
    browserLanguage.textContent =
      `${I18N.t('followBrowser', locale)}: ${localeName(browserLocale)}`;
  }

  function populateOptions(locale) {
    select.replaceChildren();

    const autoOption = document.createElement('option');
    autoOption.value = 'auto';
    autoOption.textContent = I18N.t('followBrowser', locale);
    select.appendChild(autoOption);

    for (const language of I18N.LANGUAGES) {
      const option = document.createElement('option');
      option.value = language.code;
      option.textContent = language.name;
      select.appendChild(option);
    }
  }

  async function init() {
    const preference = await I18N.getPreference();
    const effectiveLocale = I18N.resolveEffectiveLocale(preference);

    renderText(effectiveLocale);
    populateOptions(effectiveLocale);
    select.value = preference;

    openPreviewButton.addEventListener('click', () => {
      chrome.tabs.create({
        url: chrome.runtime.getURL('preview.html')
      });
      window.close();
    });

    select.addEventListener('change', async () => {
      const savedPreference = await I18N.setPreference(select.value);
      const nextLocale = I18N.resolveEffectiveLocale(savedPreference);

      renderText(nextLocale);
      populateOptions(nextLocale);
      select.value = savedPreference;

      status.textContent = I18N.t('saved', nextLocale);

      setTimeout(() => {
        status.textContent = '';
      }, 1400);
    });
  }

  init();
})();
