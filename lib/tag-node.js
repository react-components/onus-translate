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
      var self = this;
      var context = {
        g: self._store.get,
        t: self._t
      };
      var props = self.props;
      var params = {};
      var v;
      for (var k in props) {
        v = props[k];
        if (typeof v === 'function') params[k] = v.bind(context);
        else params[k] = v;
      }
      return self.compile(path, (process.env.NODE_ENV !== 'production' ? self.props['_'] : ''))(params) || ' ';
    }
  });

  return dom(t, params);
}
