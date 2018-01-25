const loaderUtils = require('loader-utils');

module.exports = function loader() {};
module.exports.pitch = function pitch(request) {
  if (this.cacheable) {
    this.cacheable();
  }
  return [
    'var content = require(' +
      loaderUtils.stringifyRequest(this, '!!' + request) +
      ');',
    "if(typeof content === 'string') content = [[module.id, content, '']];",
    'if(content.locals) module.exports = content.locals;',
    'module.exports._ = function() { return content; };'
  ].join('\n');
};
