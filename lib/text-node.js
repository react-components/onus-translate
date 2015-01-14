

module.exports = function(compile, path, params, defaultString) {
  var out = compile(path, defaultString)(params) || '';

  if (Array.isArray(out)) {
    var acc = '';
    for (var i = 0; i < out.length; i++) {
      if (out[i]) acc += out[i];
    }
    out = acc;
  }

  return out;
};
