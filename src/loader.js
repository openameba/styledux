const loaderUtils = require('loader-utils');

module.exports = function loader() {};
module.exports.pitch = function pitch(request) {
  if (this.cacheable) {
    this.cacheable();
  }
  const requestString = loaderUtils.stringifyRequest(this, `!!${request}`);
  const hmr = [
    "if (module.hot && typeof window !== 'undefined' && window.document) {",
    `  function isEqual(a, b) {`,
    `    if (!a || !b) return a === b;`,
    `    var aProps = Object.getOwnPropertyNames(a);`,
    `    var bProps = Object.getOwnPropertyNames(b);`,
    `    if (aProps.length != bProps.length) {`,
    `      return false;`,
    `    }`,
    `    for (var i = 0; i < aProps.length; i++) {`,
    `      var propName = aProps[i];`,
    `      if (a[propName] !== b[propName]) {`,
    `        return false;`,
    `      }`,
    `    }`,
    `    return true;`,
    `  }`,
    `  var mitt = require('mitt');`,
    `  mitt = mitt.default || mitt;`,
    `  var EMITTER_KEY = '__styledux_update_emitter__';`,
    `  var MODULE_ID_KEY = '__styledux_module_id__';`,
    `  Object.defineProperty(module.exports, MODULE_ID_KEY, { value: '' + module.id });`,
    `  if (!window[EMITTER_KEY]) {`,
    `    window[EMITTER_KEY] = mitt();`,
    `  }`,
    `  module.hot.accept(${requestString}, function() {`,
    `    var newContent = require(${requestString});`,
    `    if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];`,
    `    if(!isEqual(content.locals, newContent.locals)) throw new Error('Aborting CSS HMR due to changed css-modules locals.');`,
    `    module.exports = wrap(newContent);`,
    `    Object.defineProperty(module.exports, MODULE_ID_KEY, { value: '' + module.id });`,
    `    if (window[EMITTER_KEY]) {`,
    `      window[EMITTER_KEY].emit(module.exports[MODULE_ID_KEY], module.exports);`,
    `    }`,
    '  });',
    '}'
  ].join('\n');
  return [
    `var content = require(${requestString});`,
    `var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };`,
    `var _define = Object.defineProperty || function(o, p, d) { o[p] = d.value; };`,
    `function wrap(c) {`,
    `  var o = _extends({}, c.locals || {});`,
    `  _define(o, '_', { value: function() { return c; } });`,
    `  _define(o, 'toString', { value: function() { return typeof c.toString === 'function' ? c.toString() : '' } });`,
    `  return o;`,
    `}`,
    `if(typeof content === 'string') content = [[module.id, content, '']];`,
    `module.exports = wrap(content);`,
    hmr
  ].join('\n');
};
