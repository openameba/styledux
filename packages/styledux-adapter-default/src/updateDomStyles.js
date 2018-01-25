/*
  From https://github.com/webpack-contrib/style-loader/blob/master/lib/addStyles.js with modifications.
  MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
 */

/*global window,document*/
import cssWithMappingToString from './cssWithMappingToString';

const stylesInDom = {};

function applyToTag(style, obj) {
  const css = cssWithMappingToString(obj, true);
  const media = obj.media;
  if (media) {
    style.setAttribute('media', media);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }
    style.appendChild(document.createTextNode(css));
  }
}

const getElement = (function(fn) {
  const memo = {};
  return function(selector) {
    if (typeof memo[selector] === 'undefined') {
      let styleTarget = fn.call(this, selector);
      // Special case to return head of iframe instead of iframe itself
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
})(function(target) {
  return document.querySelector(target);
});

function insertStyleElement(options, style) {
  const target = getElement(options.insertInto);
  if (!target) {
    throw new Error(
      "Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid."
    );
  }
  if (!options.insertAt) {
    target.appendChild(style);
  } else {
    const nextSibling = getElement(options.insertInto + ' ' + options.insertAt);
    target.insertBefore(style, nextSibling);
  }
}

function removeStyleElement(style) {
  if (!style || style.parentNode === null) return false;
  style.parentNode.removeChild(style);
}

function addAttrs(el, attrs) {
  Object.keys(attrs).forEach(function(key) {
    el.setAttribute(key, attrs[key]);
  });
}

function createStyleElement(id, options) {
  const style = document.createElement('style');
  style.id = id;
  addAttrs(style, options.attrs);
  insertStyleElement(options, style);
  return style;
}

function addStyle(obj, options) {
  // If a transform function was defined, run it on the css
  if (!obj.css) {
    return function() {
      // noop
    };
  }
  const exist = document.getElementById(obj.id);
  const style = exist || createStyleElement(obj.id, options);
  const update = obj => applyToTag(style, obj);
  const remove = () => removeStyleElement(style);
  !exist && update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (
        newObj.css === obj.css &&
        newObj.media === obj.media &&
        newObj.sourceMap === obj.sourceMap
      ) {
        return;
      }
      update((obj = newObj));
    } else {
      remove();
    }
  };
}

export default function updateDomStyles(toAdd, toRemove, options) {
  for (let i = 0, len = toAdd.length; i < len; i += 1) {
    const item = toAdd[i];
    const domStyle = stylesInDom[item.id];
    if (domStyle) {
      domStyle.refs++;
      domStyle.content(item);
      domStyle.content = addStyle(item, options);
    } else {
      const content = addStyle(item, options);
      stylesInDom[item.id] = { id: item.id, refs: 1, content };
    }
  }

  for (let i = 0, len = toRemove.length; i < len; i += 1) {
    const item = toRemove[i];
    const domStyle = stylesInDom[item.id];
    if (domStyle) {
      domStyle.refs--;
      if (domStyle.refs <= 0) {
        domStyle.content();
        delete stylesInDom[domStyle.id];
      }
    } else {
      const el = document.getElementById(item.id);
      if (el) {
        removeStyleElement(el);
      }
    }
  }
}
