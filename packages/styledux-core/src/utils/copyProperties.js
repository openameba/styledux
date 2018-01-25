/*
  A patch to solve the problem between native es6 class inheritance and babel.
  This solution is from https://github.com/FormidableLabs/radium/blob/master/src/enhancer.js
 */

const KEYS_TO_IGNORE_WHEN_COPYING_PROPERTIES = [
  'arguments',
  'callee',
  'caller',
  'length',
  'name',
  'prototype',
  'type'
];

export default function copyProperties(source, target) {
  Object.getOwnPropertyNames(source).forEach(key => {
    if (
      KEYS_TO_IGNORE_WHEN_COPYING_PROPERTIES.indexOf(key) < 0 &&
      !target.hasOwnProperty(key)
    ) {
      const descriptor = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, descriptor);
    }
  });
}
