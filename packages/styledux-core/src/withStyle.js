import PropTypes from 'prop-types';

import { addStyle, removeStyle } from './duck';
import { STORE_KEY } from './constants';
import copyProperties from './utils/copyProperties';
import patchComponent from './utils/patchComponent';

function isArray(value) {
  if (Array.isArray) {
    return Array.isArray(value);
  }
  return Object.prototype.toString.call(value) === '[object Array]';
}

const storeShape = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
});

export default function withStyle(style) {
  const styles = isArray(style) ? style : [style];
  return WrappedComponent => {
    const wrappedComponentName =
      WrappedComponent.displayName || WrappedComponent.name || 'Component';
    const PatchedComponent = patchComponent(WrappedComponent);

    const WithStyle = class extends PatchedComponent {
      constructor(props, context) {
        super(props, context);
        this.reactStyleduxStore = props[STORE_KEY] || context[STORE_KEY];
      }

      componentWillMount() {
        if (super.componentWillMount) {
          super.componentWillMount();
        }
        this.isReactStyleduxMounted = false;
      }

      componentWillUnmount() {
        if (super.componentWillUnmount) {
          super.componentWillUnmount();
        }
        if (this.isReactStyleduxMounted) {
          this.isReactStyleduxMounted = false;
          if (this.reactStyleduxStore) {
            this.reactStyleduxStore.dispatch(removeStyle(this));
          }
        }
      }

      render() {
        const result = super.render();
        if (result && !this.isReactStyleduxMounted) {
          this.isReactStyleduxMounted = true;
          if (this.reactStyleduxStore) {
            this.reactStyleduxStore.dispatch(addStyle(this, styles));
          }
        }
        if (!result && this.isReactStyleduxMounted) {
          this.isReactStyleduxMounted = false;
          if (this.reactStyleduxStore) {
            this.reactStyleduxStore.dispatch(removeStyle(this));
          }
        }
        return result;
      }
    };

    copyProperties(WrappedComponent, WithStyle);
    WithStyle.displayName = `WithStyle(${wrappedComponentName})`;
    WithStyle.contextTypes = {
      ...WrappedComponent.contextTypes,
      [STORE_KEY]: storeShape
    };
    return WithStyle;
  };
}
