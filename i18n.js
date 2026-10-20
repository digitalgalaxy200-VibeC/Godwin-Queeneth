/* Lightweight language layer for the GQ Affair invitation.
   Order of preference: ?lang= -> saved choice -> browser languages -> English. */
(function () {
  var SUPPORTED = ['en', 'fr'];
  var DEFAULT_LANG = 'en';
  var STORAGE_KEY = 'gq_lang';
  var dict = window.GQ_I18N || {};
  var current = DEFAULT_LANG;

  function normalize(code) {
    return String(code || '').toLowerCase().split('-')[0];
  }

  function saved() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function detect() {
    var fromUrl = normalize(new URLSearchParams(location.search).get('lang'));
    if (SUPPORTED.indexOf(fromUrl) !== -1) return fromUrl;

    var remembered = normalize(saved());
    if (SUPPORTED.indexOf(remembered) !== -1) return remembered;

    var prefs = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || DEFAULT_LANG];

    for (var i = 0; i < prefs.length; i++) {
      var code = normalize(prefs[i]);
      if (SUPPORTED.indexOf(code) !== -1) return code;
    }
    return DEFAULT_LANG;
  }

  function lookup(lang, key) {
    var table = dict[lang] || {};
    if (table[key] != null) return table[key];
    var fallback = dict[DEFAULT_LANG] || {};
    return fallback[key] != null ? fallback[key] : null;
  }

  function t(key, vars) {
    var str = lookup(current, key);
    if (str == null) return key;
    if (vars) {
      Object.keys(vars).forEach(function (name) {
        str = str.split('{' + name + '}').join(vars[name]);
      });
    }
    return str;
  }

  function apply(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;
    current = lang;

    var root = document.documentElement;
    root.lang = lang;
    root.setAttribute('data-lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var value = lookup(lang, el.getAttribute('data-i18n'));
      if (value != null) el.textContent = value;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var value = lookup(lang, el.getAttribute('data-i18n-html'));
      if (value != null) el.innerHTML = value;
    });

    [
      ['data-i18n-placeholder', 'placeholder'],
      ['data-i18n-alt', 'alt'],
      ['data-i18n-aria', 'aria-label'],
      ['data-i18n-title', 'title']
    ].forEach(function (pair) {
      document.querySelectorAll('[' + pair[0] + ']').forEach(function (el) {
        var value = lookup(lang, el.getAttribute(pair[0]));
        if (value != null) el.setAttribute(pair[1], value);
      });
    });

    var title = lookup(lang, 'meta.title');
    if (title) document.title = title;

    var description = lookup(lang, 'meta.description');
    var metaDescription = document.querySelector('meta[name="description"]');
    if (description && metaDescription) metaDescription.setAttribute('content', description);

    var ogTitle = lookup(lang, 'meta.ogTitle');
    var metaOgTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && metaOgTitle) metaOgTitle.setAttribute('content', ogTitle);

    var ogDescription = lookup(lang, 'meta.ogDescription');
    var metaOgDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription && metaOgDescription) metaOgDescription.setAttribute('content', ogDescription);

    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      var active = btn.getAttribute('data-lang-btn') === lang;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      btn.classList.toggle('active', active);
    });

    root.classList.remove('i18n-pending');
    document.dispatchEvent(new CustomEvent('gq:langchange', { detail: { lang: lang } }));
  }

  function set(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    apply(lang);
    try {
      var params = new URLSearchParams(location.search);
      params.set('lang', lang);
      history.replaceState(null, '', location.pathname + '?' + params.toString() + location.hash);
    } catch (e) {}
  }

  document.addEventListener('click', function (event) {
    var btn = event.target.closest ? event.target.closest('[data-lang-btn]') : null;
    if (btn) set(btn.getAttribute('data-lang-btn'));
  });

  window.GQ_i18n = {
    t: t,
    apply: apply,
    set: set,
    get lang() { return current; },
    supported: SUPPORTED.slice()
  };

  apply(detect());
})();
