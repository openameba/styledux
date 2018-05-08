/*
  From https://github.com/webpack-contrib/css-loader/blob/master/lib/css-base.js with modifications.
  MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
 */

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  const base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  const data = `sourceMappingURL=data:application/json;charset=utf-8;base64,${base64}`;
  return `/*# ${data} */`;
}

export default function cssWithMappingToString(item, useSourceMap = true) {
  const content = item.css;
  const cssMapping = item.sourceMap;
  if (!cssMapping) {
    return content;
  }
  if (useSourceMap && typeof btoa === 'function') {
    const sourceMapping = toComment(cssMapping);
    const sourceURLs = cssMapping.sources.map(
      source => `/*# sourceURL=${cssMapping.sourceRoot}${source} */`
    );

    return [content]
      .concat(sourceURLs)
      .concat([sourceMapping])
      .join('\n');
  }
  return [content].join('\n');
}
