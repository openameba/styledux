const isArray =
  Array.isArray ||
  function isArray(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };

export default function flatStyles(styles) {
  const result = [];
  for (let i = 0, len = styles.length; i < len; i += 1) {
    const style = styles[i];
    if (isArray(style)) {
      result.push(...style);
    } else {
      result.push(style);
    }
  }
  return result;
}
