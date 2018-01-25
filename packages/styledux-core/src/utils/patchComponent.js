/*
  A patch to solve the problem between native es6 class inheritance and babel.
  This solution is from https://github.com/FormidableLabs/radium/blob/master/src/enhancer.js
 */

import React from 'react';

import copyProperties from './copyProperties';

// Check if value is a real ES class in Native / Node code.
// See: https://stackoverflow.com/a/30760236
function isNativeClass(component) {
  return (
    typeof component === 'function' && /^\s*class\s+/.test(component.toString())
  );
}

function isStateless(component) {
  return (
    !component.render && !(component.prototype && component.prototype.render)
  );
}

// Manually apply babel-ish class inheritance.
function inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      `Super expression must either be null or a function, not ${typeof superClass}`
    );
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (superClass) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(subClass, superClass);
    } else {
      subClass.__proto__ = superClass; // eslint-disable-line no-proto
    }
  }
}

export default function patch(component) {
  let ComposedComponent = component;
  if (isNativeClass(ComposedComponent)) {
    ComposedComponent = (function(OrigComponent) {
      function NewComponent() {
        // Ordinarily, babel would produce something like:
        //
        // ```
        // return _possibleConstructorReturn(this, OrigComponent.apply(this, arguments));
        // ```
        //
        // Instead, we just call `new` directly without the `_possibleConstructorReturn` wrapper.
        const source = new OrigComponent(...arguments);

        // Then we manually update context with properties.
        copyProperties(source, this);
        return this;
      }
      inherits(NewComponent, OrigComponent);

      return NewComponent;
    })(ComposedComponent);
  }

  // Handle stateless components
  if (isStateless(ComposedComponent)) {
    ComposedComponent = class extends React.Component {
      render() {
        return component(this.props, this.context);
      }
    };
    ComposedComponent.displayName = component.displayName || component.name;
  }
  return ComposedComponent;
}
