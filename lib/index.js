'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var redux = require('redux');

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var _React$createContext = React.createContext(),
    Provider = _React$createContext.Provider,
    Consumer = _React$createContext.Consumer;

function StyleduxProvider(_ref) {
  var store = _ref.store,
      children = _ref.children;
  return React.createElement(Provider, {
    value: store
  }, children);
}

var ADD_STYLE = 'styledux/ADD_STYLE';
var REMOVE_STYLE = 'styledux/REMOVE_STYLE';
var UPDATE_STYLE = 'styledux/UPDATE_STYLE';
function addStyle(target, style) {
  return {
    type: ADD_STYLE,
    payload: {
      target: target,
      style: style
    }
  };
}
function removeStyle(target) {
  return {
    type: REMOVE_STYLE,
    payload: {
      target: target
    }
  };
}
function updateStyle(target, style) {
  return {
    type: UPDATE_STYLE,
    payload: {
      target: target,
      style: style
    }
  };
}

function getInitState() {
  return {
    keys: [],
    values: []
  };
}

function rootReducer(state, action) {
  if (state === void 0) {
    state = getInitState();
  }

  switch (action.type) {
    case ADD_STYLE:
      {
        var _action$payload = action.payload,
            target = _action$payload.target,
            style = _action$payload.style;
        var idx = state.keys.indexOf(target);

        if (idx !== -1) {
          return state;
        }

        return {
          keys: [].concat(state.keys, [target]),
          values: [].concat(state.values, [style])
        };
      }

    case REMOVE_STYLE:
      {
        var _state = state,
            keys = _state.keys,
            values = _state.values;
        var _target = action.payload.target;

        var _idx = keys.indexOf(_target);

        if (_idx === -1) {
          return state;
        }

        return {
          keys: keys.slice(0, _idx).concat(keys.slice(_idx + 1)),
          values: values.slice(0, _idx).concat(values.slice(_idx + 1))
        };
      }

    case UPDATE_STYLE:
      {
        var _action$payload2 = action.payload,
            _target2 = _action$payload2.target,
            _style = _action$payload2.style;

        var _idx2 = state.keys.indexOf(_target2);

        if (_idx2 === -1) {
          return state;
        }

        var newValue = state.values.slice();
        newValue[_idx2] = _style;
        return {
          keys: [].concat(state.keys),
          values: newValue
        };
      }

    default:
      return state;
  }
}

function isArray(value) {
  if (Array.isArray) {
    return Array.isArray(value);
  }

  return Object.prototype.toString.call(value) === '[object Array]';
}

function isStateless(component) {
  return !component.render && !(component.prototype && component.prototype.render);
}

function withStyle(style) {
  var styles = isArray(style) ? style : [style];

  function startHmrListener(that) {
    var noop = function noop() {};

    if (typeof window === 'undefined') return noop;
    var EMITTER_KEY = '__styledux_update_emitter__';
    var MODULE_ID_KEY = '__styledux_module_id__';
    var emitter = window[EMITTER_KEY];
    if (!emitter) throw new Error('Emitter does not exist');

    var handler = function handler(newStyle) {
      if (!that.reactStyleduxStore) {
        return;
      }

      var moduleId = newStyle[MODULE_ID_KEY];
      var idx = styles.findIndex(function (s) {
        return s[MODULE_ID_KEY] === moduleId;
      });

      if (idx !== -1) {
        styles = styles.slice();
        styles[idx] = newStyle;
        that.reactStyleduxStore.dispatch(updateStyle(that, styles));
      }
    };

    for (var i = 0, len = styles.length; i < len; i += 1) {
      var s = styles[i];
      emitter.on(s[MODULE_ID_KEY], handler);
    }

    return function () {
      for (var _i = 0, _len = styles.length; _i < _len; _i += 1) {
        var _s = styles[_i];
        emitter.off(_s[MODULE_ID_KEY], handler);
      }
    };
  }

  return function (WrappedComponent) {
    var wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    /* eslint-disable react/prefer-stateless-function */

    var WithStyle = isStateless(WrappedComponent) ?
    /*#__PURE__*/
    function (_React$Component) {
      _inheritsLoose(_class, _React$Component);

      function _class() {
        return _React$Component.apply(this, arguments) || this;
      }

      var _proto = _class.prototype;

      _proto.render = function render() {
        return React.createElement(WrappedComponent, this.props);
      };

      return _class;
    }(React.Component) : WrappedComponent;
    /* eslint-enable react/prefer-stateless-function */

    var _WithStyle$prototype = WithStyle.prototype,
        originalComponentDidMount = _WithStyle$prototype.componentDidMount,
        originalComponentDidUpdate = _WithStyle$prototype.componentDidUpdate,
        originalComponentWillUnmount = _WithStyle$prototype.componentWillUnmount,
        originalRender = _WithStyle$prototype.render;

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
      var _this = this;

      var result = originalRender.apply(this, arguments);
      return React.createElement(Consumer, null, function (store) {
        _this.reactStyleduxStore = store;

        if (result && !_this.isReactStyleduxMounted) {
          _this.isReactStyleduxMounted = true;

          if (_this.reactStyleduxStore) {
            _this.reactStyleduxStore.dispatch(addStyle(_this, styles));
          }
        }

        if (!result && _this.isReactStyleduxMounted) {
          _this.isReactStyleduxMounted = false;

          if (_this.reactStyleduxStore) {
            _this.reactStyleduxStore.dispatch(removeStyle(_this));
          }
        }

        return result;
      });
    };
    /* eslint-enable react/no-this-in-sfc */


    WithStyle.displayName = "WithStyle(" + wrappedComponentName + ")";
    return WithStyle;
  };
}

function createStyleduxStore() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  if (middlewares && middlewares.length > 0) {
    return redux.createStore(rootReducer, redux.applyMiddleware.apply(void 0, middlewares));
  }

  return redux.createStore(rootReducer);
}

function defaultTransformId(moduleId, index) {
  var id = typeof moduleId === 'number' ? String(moduleId) : moduleId.replace(/[^A-Za-z0-9\-_:.]/g, '');
  return "rs_" + id + "_" + index;
}

function getOptions(options) {
  if (options === void 0) {
    options = {};
  }

  return {
    attrs: options.attrs || {},
    transform: options.transform || null,
    transformId: options.transformId || defaultTransformId,
    insertAt: options.insertAt || null,
    // null | '#id'
    insertInto: options.insertInto || 'head'
  };
}

/*
  From https://github.com/webpack-contrib/style-loader/blob/master/lib/addStyles.js with modifications.
  MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
 */
var caches = {};
var transformStyles = [];
var transformIds = [];

var isProd = function () {
  if (typeof process === 'undefined' || !process.env) {
    return true;
  }

  return process.env.NODE_ENV === 'production';
}(); // Transform item that genreated by loader to style object


function listToStyles(cssModule, options) {
  if (options === void 0) {
    options = {};
  }

  var transformStyle = options.transform || Object;
  var transformId = options.transformId || Object;

  if (transformStyles.indexOf(transformStyle) === -1) {
    transformStyles.push(transformStyle);

    if (transformIds.length > 10) {
      console.log("Possible memory leak detected. " + transformIds.length + " transformStyle functions added.");
    }
  }

  if (transformIds.indexOf(transformId) === -1) {
    transformIds.push(transformId);

    if (transformIds.length > 10) {
      console.log("Possible memory leak detected. " + transformIds.length + " transformId functions added.");
    }
  }

  var cacheKey = transformStyles.indexOf(transformStyle) + ":" + transformIds.indexOf(transformId);
  var cache = caches[cacheKey];

  if (!cache) {
    cache = new WeakMap();
    caches[cacheKey] = cache;
  }

  var styles = cache.get(cssModule);

  if (styles && isProd && !module.hot) {
    return styles;
  }

  var list = cssModule._();

  styles = [];

  for (var i = 0, len = list.length; i < len; i += 1) {
    var item = list[i];
    var id = options.transformId(item[0], i);
    var css = item[1];
    var media = item[2];
    var sourceMap = item[3];
    var obj = {
      id: id,
      css: css,
      media: media,
      sourceMap: sourceMap
    };
    styles.push(options.transform ? options.transform(obj) : obj);
  }

  cache.set(cssModule, styles);
  return styles;
}

function createModuleToStylesConverter(options) {
  return function (modules) {
    var result = [];

    for (var k = 0, len = modules.length; k < len; k += 1) {
      result.push.apply(result, listToStyles(modules[k], options));
    }

    return result;
  };
}

/*
  From https://github.com/webpack-contrib/css-loader/blob/master/lib/css-base.js with modifications.
  MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
 */
// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64," + base64;
  return "/*# " + data + " */";
}

function cssWithMappingToString(item, useSourceMap) {
  if (useSourceMap === void 0) {
    useSourceMap = true;
  }

  var content = item.css;
  var cssMapping = item.sourceMap;

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=" + cssMapping.sourceRoot + source + " */";
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
}

var isArray$1 = Array.isArray || function isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
};

function flatStyles(styles) {
  var result = [];

  for (var i = 0, len = styles.length; i < len; i += 1) {
    var style = styles[i];

    if (isArray$1(style)) {
      result.push.apply(result, style);
    } else {
      result.push(style);
    }
  }

  return result;
}

function persistStyles(styles, options) {
  var result = [];
  var addedIds = [];

  for (var i = 0, len = styles.length; i < len; i += 1) {
    var obj = styles[i];
    var id = obj.id;

    if (obj.css && addedIds.indexOf(id) === -1) {
      (function () {
        var attrs = _objectSpread({}, options.attrs);

        if (obj.media) {
          attrs.media = obj.media;
        }

        var css = cssWithMappingToString(obj, true);
        var attrString = Object.keys(attrs).map(function (k) {
          return k + "=\"" + attrs[k] + "\"";
        }).join(' ');
        result.push("<style id=\"" + [id, attrString || ''].join('') + "\">" + css + "</style>");
        addedIds.push(obj.id);
      })();
    }
  }

  return result;
}

function mapStateOnServer(store, options) {
  if (options === void 0) {
    options = {};
  }

  var opts = getOptions(options);

  var _store$getState = store.getState(),
      values = _store$getState.values;

  return persistStyles(createModuleToStylesConverter(opts)(flatStyles(values)), opts);
}

/*
  From https://github.com/webpack-contrib/style-loader/blob/master/lib/addStyles.js with modifications.
  MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
 */
var stylesInDom = {};

var noop = function noop() {};

function applyToTag(style, obj) {
  var css = cssWithMappingToString(obj, true);
  var media = obj.media;

  if (media) {
    style.setAttribute('media', media);
  }

  if (style.styleSheet) {
    // eslint-disable-next-line no-param-reassign
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var getElement = function (fn) {
  var memo = {};
  return function (selector) {
    if (typeof memo[selector] === 'undefined') {
      var styleTarget = fn(selector); // Special case to return head of iframe instead of iframe itself

      if (styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          styleTarget = null;
        }
      }

      memo[selector] = styleTarget;
    }

    return memo[selector];
  };
}(function (target) {
  return document.querySelector(target);
});

function insertStyleElement(options, style) {
  var target = getElement(options.insertInto);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
  }

  if (!options.insertAt) {
    target.appendChild(style);
  } else {
    var nextSibling = getElement(options.insertInto + " " + options.insertAt);
    target.insertBefore(style, nextSibling);
  }
}

function removeStyleElement(style) {
  if (!style || style.parentNode === null) return;
  style.parentNode.removeChild(style);
}

function addAttrs(el, attrs) {
  Object.keys(attrs).forEach(function (key) {
    el.setAttribute(key, attrs[key]);
  });
}

function createStyleElement(id, options) {
  var style = document.createElement('style');
  style.id = id;
  addAttrs(style, options.attrs);
  insertStyleElement(options, style);
  return style;
}

function addStyle$1(obj, options) {
  // If a transform function was defined, run it on the css
  if (!obj.css) {
    return noop;
  }

  var exist = document.getElementById(obj.id);
  var style = exist || createStyleElement(obj.id, options);

  var update = function update(o) {
    return applyToTag(style, o);
  };

  var remove = function remove() {
    return removeStyleElement(style);
  };

  if (!exist) {
    update(obj);
  }

  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      } // eslint-disable-next-line no-param-reassign


      obj = newObj;
      update(obj);
    } else {
      remove();
    }
  };
}

function updateDomStyles(toAdd, toRemove, toUpdate, options) {
  for (var i = 0, len = toAdd.length; i < len; i += 1) {
    var item = toAdd[i];
    var domStyle = stylesInDom[item.id];

    if (domStyle) {
      domStyle.refs += 1;
      domStyle.content(item);
    } else {
      var content = addStyle$1(item, options);
      stylesInDom[item.id] = {
        id: item.id,
        refs: 1,
        content: content
      };
    }
  }

  for (var _i = 0, _len = toRemove.length; _i < _len; _i += 1) {
    var _item = toRemove[_i];
    var _domStyle = stylesInDom[_item.id];

    if (_domStyle) {
      _domStyle.refs -= 1;

      if (_domStyle.refs <= 0) {
        _domStyle.content();

        delete stylesInDom[_domStyle.id];
      }
    } else {
      var el = document.getElementById(_item.id);

      if (el) {
        removeStyleElement(el);
      }
    }
  }

  for (var _i2 = 0, _len2 = toUpdate.length; _i2 < _len2; _i2 += 1) {
    var _item2 = toUpdate[_i2];
    var _domStyle2 = stylesInDom[_item2.id];

    if (_domStyle2) {
      _domStyle2.content(_item2);
    }
  }
}

function diff(oldState, newState) {
  var toAdd = [];
  var toRemove = [];
  var toUpdate = [];
  var oldKeys = oldState.keys;
  var newKeys = newState.keys;
  var oldStyles = oldState.values;
  var newStyles = newState.values;

  for (var k = 0, newLen = newKeys.length; k < newLen; k += 1) {
    var key = newKeys[k];
    var value = newStyles[k];

    if (oldKeys.indexOf(key) === -1) {
      toAdd.push(value);
    }
  }

  for (var _k = 0, oldLen = oldStyles.length; _k < oldLen; _k += 1) {
    var _key = oldKeys[_k];
    var _value = oldStyles[_k];

    if (newKeys.indexOf(_key) === -1) {
      toRemove.push(_value);
    } else {
      var newIdx = newKeys.indexOf(_key);

      if (oldStyles[_k] !== newStyles[newIdx]) {
        toUpdate.push(newStyles[newIdx]);
      }
    }
  }

  return [flatStyles(toAdd), flatStyles(toRemove), flatStyles(toUpdate)];
}

function handleStateChangeOnClient(options) {
  if (options === void 0) {
    options = {};
  }

  var opts = getOptions(options);
  var convertModules = createModuleToStylesConverter(opts);
  return function (_ref) {
    var getState = _ref.getState;
    return function (next) {
      return function (action) {
        var prevState = getState();
        var result = next(action);
        var nextState = getState();

        if (prevState !== nextState) {
          var _diff = diff(prevState, nextState, opts),
              toAdd = _diff[0],
              toRemove = _diff[1],
              toUpdate = _diff[2];

          if (toAdd.length > 0 || toRemove.length > 0 || toUpdate.length > 0) {
            updateDomStyles(convertModules(toAdd), convertModules(toRemove), convertModules(toUpdate), opts);
          }
        }

        return result;
      };
    };
  };
}

exports.withStyle = withStyle;
exports.StyleduxProvider = StyleduxProvider;
exports.createStyleduxStore = createStyleduxStore;
exports.mapStateOnServer = mapStateOnServer;
exports.handleStateChangeOnClient = handleStateChangeOnClient;
