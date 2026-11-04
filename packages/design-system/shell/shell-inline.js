/* Inlined into <head> of every page by the shell (see render.mjs). Runs before first paint:
   applies the saved or system theme, wires every [data-zy-theme-toggle] button and exposes
   window.zyTheme. Apps listen for the 'zyankov-theme-change' event instead of storing theme state.
   Also handles the skip link, the "Privacy settings" button and cross-project click tracking. */
(function () {
  var KEY = 'zyankov-theme';
  var LEGACY_KEYS = ['letterwell-theme', 'buildcalc-theme'];
  var EVENT = 'zyankov-theme-change';
  var root = document.documentElement;

  function valid(value) {
    return value === 'dark' || value === 'light';
  }

  function read() {
    try {
      var stored = localStorage.getItem(KEY);
      if (valid(stored)) return stored;
      for (var i = 0; i < LEGACY_KEYS.length; i++) {
        var legacy = localStorage.getItem(LEGACY_KEYS[i]);
        if (valid(legacy)) {
          localStorage.setItem(KEY, legacy);
          return legacy;
        }
      }
    } catch (error) {
      /* Storage can be unavailable (private mode); fall back to the system preference. */
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#17271e' : '#f1f5ef');
    var buttons = document.querySelectorAll('[data-zy-theme-toggle]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', String(theme === 'dark'));
      var bg = (root.getAttribute('lang') || '').indexOf('bg') === 0;
      var label = theme === 'dark'
        ? (bg ? 'Включи светла тема' : 'Switch to light theme')
        : (bg ? 'Включи тъмна тема' : 'Switch to dark theme');
      buttons[i].setAttribute('aria-label', label);
    }
  }

  function announce(theme) {
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { theme: theme } }));
  }

  function set(theme) {
    if (!valid(theme)) return;
    try {
      localStorage.setItem(KEY, theme);
    } catch (error) {
      /* The theme still applies for this page view. */
    }
    apply(theme);
    announce(theme);
  }

  window.zyTheme = {
    get: function () {
      return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    },
    set: set,
    toggle: function () {
      set(window.zyTheme.get() === 'dark' ? 'light' : 'dark');
    },
  };

  function showConsent() {
    window.googlefc = window.googlefc || {};
    window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
    window.googlefc.callbackQueue.push(function () {
      if (window.googlefc.showRevocationMessage) window.googlefc.showRevocationMessage();
    });
  }

  apply(read());
  if (window.location.hash === '#privacy-settings') showConsent();

  document.addEventListener('DOMContentLoaded', function () {
    apply(window.zyTheme.get());
  });

  document.addEventListener('click', function (event) {
    var target = event.target;
    var button = target && target.closest ? target.closest('[data-zy-theme-toggle]') : null;
    if (button) window.zyTheme.toggle();
    /* Skip link: focus the main element directly, so apps with a <base href> do not navigate. */
    /* "Privacy settings": reopen Google's consent message (AdSense Privacy & messaging). */
    var consent = target && target.closest ? target.closest('[data-zy-consent]') : null;
    if (consent) {
      event.preventDefault();
      if (document.querySelector('script[src*="adsbygoogle"]')) showConsent();
      /* Pages without ad tags (privacy, terms) cannot open the message: go to the homepage. */
      else window.location.href = '/#privacy-settings';
    }
    /* Clicks from the bar or footer to another project. */
    var projectLink = target && target.closest ? target.closest('[data-zy-project]') : null;
    if (projectLink && window.umami && window.umami.track) {
      window.umami.track('outbound_project', {
        to: projectLink.getAttribute('data-zy-project'),
        from: root.getAttribute('data-project') || '',
      });
    }
    var skip = target && target.closest ? target.closest('.zy-skip') : null;
    var main = skip && document.getElementById(skip.getAttribute('href').slice(1));
    if (main) {
      event.preventDefault();
      if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
      main.focus();
    }
  });

  window.addEventListener('storage', function (event) {
    if (event.key === KEY && valid(event.newValue)) {
      apply(event.newValue);
      announce(event.newValue);
    }
  });
})();
