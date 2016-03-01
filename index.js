/**
 * Module dependencies
 */

var initCompile = require('./lib/compile');
var tagNode = require('./lib/tag-node');
var textNode = require('./lib/text-node');

exports = module.exports = Translate;
exports['default'] = exports;

function Translate(rootPath) {
  this.resolve = typeof rootPath === 'function' ?
    rootPath :
    initResolve(rootPath || '.translations');
}

Translate.prototype.context = function(store) {
  var resolve = this.resolve;
  var compile = initCompile(store, resolve);

  return function(path, params, defaultString, isElement) {
    return isElement ?
      tagNode(resolve, path, params, defaultString) :
      textNode(compile, path, params, defaultString);
  };
};

function initResolve(root) {
  if (!~root.indexOf('.')) root = '.' + root;
  if (root.charAt(root.length - 1) !== '.') root += '.';

  return function resolve(path) {
    return root + path;
  };
}
