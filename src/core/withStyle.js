/* global window */
/* eslint no-underscore-dangle:0,prefer-rest-params:0 */
import React from 'react';

import { StyleduxConsumer } from './context';
import { addStyle, removeStyle, updateStyle } from './duck';

function isArray(value) {
  if (Array.isArray) {
    return Array.isArray(value);
  }
  return Object.prototype.toString.call(value) === '[object Array]';
}

function isStateless(component) {
  return (
    !component.render && !(component.prototype && component.prototype.render)
  );
}

export default function withStyle(style) {
  let styles = isArray(style) ? style : [style];
  function startHmrListener(that) {
    const noop = () => {};
    if (typeof window === 'undefined') return noop;
    const EMITTER_KEY = '__styledux_update_emitter__';
    const MODULE_ID_KEY = '__styledux_module_id__';
    const emitter = window[EMITTER_KEY];
    if (!emitter) throw new Error('Emitter does not exist');

    const handler = newStyle => {
      if (!that.reactStyleduxStore) {
        return;
      }
      const moduleId = newStyle[MODULE_ID_KEY];
      const idx = styles.findIndex(s => s[MODULE_ID_KEY] === moduleId);
      if (idx !== -1) {
        styles = styles.slice();
        styles[idx] = newStyle;
        that.reactStyleduxStore.dispatch(updateStyle(that, styles));
      }
    };

    for (let i = 0, len = styles.length; i < len; i += 1) {
      const s = styles[i];
      emitter.on(s[MODULE_ID_KEY], handler);
    }
    return () => {
      for (let i = 0, len = styles.length; i < len; i += 1) {
        const s = styles[i];
        emitter.off(s[MODULE_ID_KEY], handler);
      }
    };
  }

  return WrappedComponent => {
    const wrappedComponentName =
      WrappedComponent.displayName || WrappedComponent.name || 'Component';

    /* eslint-disable react/prefer-stateless-function */
    const WithStyle = isStateless(WrappedComponent)
      ? class extends React.Component {
          render() {
            return <WrappedComponent {...this.props} />;
          }
        }
      : WrappedComponent;
    /* eslint-enable react/prefer-stateless-function */
    const {
      componentDidMount: originalComponentDidMount,
      componentDidUpdate: originalComponentDidUpdate,
      componentWillUnmount: originalComponentWillUnmount,
      render: originalRender
    } = WithStyle.prototype;

    if (module.hot) {
      WithStyle.prototype.componentDidMount = function componentDidMount() {
        if (!this.styleduxUnlistenHmr) {
          this.styleduxUnlistenHmr = startHmrListener(this);
        }
        if (originalComponentDidMount) {
          originalComponentDidMount.apply(this, arguments);
        }
      };
      WithStyle.prototype.componentDidUpdate = function componentDidUpdate() {
        if (!this.styleduxUnlistenHmr) {
          this.styleduxUnlistenHmr = startHmrListener(this);
        }
        if (originalComponentDidUpdate) {
          originalComponentDidUpdate.apply(this, arguments);
        }
      };
    }

    WithStyle.prototype.componentWillUnmount = function componentWillUnmount() {
      if (module.hot && this.unlistenHmr) {
        if (this.styleduxUnlistenHmr) {
          this.styleduxUnlistenHmr();
        }
      }
      if (originalComponentWillUnmount) {
        originalComponentWillUnmount.apply(this, arguments);
      }
      if (this.isReactStyleduxMounted) {
        this.isReactStyleduxMounted = false;
        if (this.reactStyleduxStore) {
          this.reactStyleduxStore.dispatch(removeStyle(this));
        }
      }
    };

    /* eslint-disable react/no-this-in-sfc */
    WithStyle.prototype.render = function render() {
      const result = originalRender.apply(this, arguments);
      return (
        <StyleduxConsumer>
          {store => {
            this.reactStyleduxStore = store;
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
          }}
        </StyleduxConsumer>
      );
    };
    /* eslint-enable react/no-this-in-sfc */
    WithStyle.displayName = `WithStyle(${wrappedComponentName})`;
    return WithStyle;
  };
}
