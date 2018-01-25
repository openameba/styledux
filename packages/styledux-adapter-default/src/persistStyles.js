import cssWithMappingToString from "./cssWithMappingToString";

export default function persistStyles(styles, options) {
  const result = [];
  const addedIds = [];
  for (let i = 0, len = styles.length; i < len; i += 1) {
    const obj = styles[i];
    if (!obj.css) {
      continue;
    }
    const id = obj.id;
    if (addedIds.indexOf(id) !== -1) {
      continue;
    }
    const attrs = {
      ...options.attrs
    };
    if (obj.media) {
      attrs.media = obj.media;
    }
    const css = cssWithMappingToString(obj, true);
    const attrString = Object.keys(attrs)
      .map(k => `${k}="${attrs[k]}"`)
      .join(" ");
    result.push(
      `<style id="${id}"${attrString ? " " + attrString : ""}>${css}</style>`
    );
    addedIds.push(obj.id);
  }
  return result;
}
