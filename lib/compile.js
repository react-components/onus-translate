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
      cldr = '⚠ ' + defaultString + ' ⚠';
      if (localeCache[cldr]) return localeCache[cldr];
      console.warn('using default string "' + defaultString + '" for key "' + path + '"');
      return localeCache[cldr] = compileTranslation(cldr, locale);
    }

    // if we didn't have a default string return a noop
    if (!cldr) return process.env.NODE_ENV === 'production' ?
      noop :
      function() {return '⚠ ' + (path) + ' ⚠'};

    // check to see if we can split on |||| for backwards compatibility
    if (typeof cldr === 'string') {
      var parts = cldr.split(/ *\|\|\|\| */);
      if (parts.length > 1) cldr = parts;
    }

    // actually compile the translation
    return localeCache[key] = compileTranslation(cldr, locale);
  };
}
