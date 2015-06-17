/**
 * Module dependencies
 */

var Onus = require('onus');
var React = require('react');
var dom = React.createElement;
var initCompile = require('./compile');

var componentCache = {};

module.exports = function(resolve, path, params, defaultString) {
  if (process.env.NODE_ENV !== 'production') {
    if (!params) params = {};
    params['_'] = defaultString;
  }

  if (componentCache[path]) return dom(componentCache[path], params);

  var t = componentCache[path] = Onus({
    displayName: 't(' + path + ')',
    componentClassName: 'translate-component',
    rootTag: 'span',
    componentWillMount: function() {
      this.compile = initCompile(this._store, resolve);
    },
    render: function() {
      return this.compile(path, (process.env.NODE_ENV !== 'production' ? this.props['_'] : ''))(this.props) || ' ';
    }
  });

  return dom(t, params);
}
