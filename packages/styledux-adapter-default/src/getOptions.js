function defaultTransformId(moduleId, index) {
  const id =
    typeof moduleId === 'number'
      ? String(moduleId)
      : moduleId.replace(/[^A-Za-z0-9\-_:.]/g, '');
  return `rs_${id}_${index}`;
}

export default function getOptions(options = {}) {
  return {
    attrs: options.attrs || {},
    transform: options.transform || null,
    transformId: options.transformId || defaultTransformId,
    insertAt: options.insertAt || null, // null | '#id'
    insertInto: options.insertInto || 'head'
  };
}
