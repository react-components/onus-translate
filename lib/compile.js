/**
 * Module dependencies
 */

var compileTranslation = require('lang-js-translate');

module.exports = initCompile;

function noop() {}

var locales = {};


function initCompile(store, resolve) {
  return function(path, defaultString) {
    var res = store.req(resolve(path));

    if (!res.isLoaded) return noop;

    var cldr = res.value;

    var locale = store.get(resolve('_info.locale')) || 'en';
    var localeCache = locales[locale] = locales[locale] || {};

    // lookup the compiled function in the cache
    var key = JSON.stringify(cldr);
    if (localeCache[key]) return localeCache[key];

    // if we can't find it then return the default string if we have one
    if (process.env.NODE_ENV !== 'production' && !cldr && defaultString) {
      key = JSON.stringify(defaultString);
      if (localeCache[key]) return localeCache[key];
      console.warn('using default string ' + key + ' for key "' + path + '"');
      return localeCache[key] = wrapWarning(compileTranslation(defaultString, 'en'));
    }

    // if we didn't have a default string return a noop
    if (!cldr) return process.env.NODE_ENV === 'production' ?
      noop :
      function() {return '⚠ ' + (path) + ' ⚠';};

    // check to see if we can split on |||| for backwards compatibility
    if (typeof cldr === 'string') {
      var parts = cldr.split(/ *\|\|\|\| */);
      if (parts.length > 1) cldr = parts;
    }

    // actually compile the translation
    return localeCache[key] = compileTranslation(cldr, locale);
  };
}

function wrapWarning(fn) {
  return function() {
    if (process.env.IGNORE_TRANSLATION_WARNINGS) return fn.apply(this, arguments);
    var res = fn.apply(this, arguments);
    res.unshift('⚠ ');
    res.push(' ⚠');
    return res;
  };
}
