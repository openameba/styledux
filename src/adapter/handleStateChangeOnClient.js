import getOptions from './getOptions';
import createModuleToStylesConverter from './createModuleToStylesConverter';
import updateDomStyles from './updateDomStyles';
import flatStyles from './flatStyles';

function diff(oldState, newState) {
  const toAdd = [];
  const toRemove = [];
  const toUpdate = [];
  const oldKeys = oldState.keys;
  const newKeys = newState.keys;

  const oldStyles = oldState.values;
  const newStyles = newState.values;

  for (let k = 0, newLen = newKeys.length; k < newLen; k += 1) {
    const key = newKeys[k];
    const value = newStyles[k];
    if (oldKeys.indexOf(key) === -1) {
      toAdd.push(value);
    }
  }
  for (let k = 0, oldLen = oldStyles.length; k < oldLen; k += 1) {
    const key = oldKeys[k];
    const value = oldStyles[k];
    if (newKeys.indexOf(key) === -1) {
      toRemove.push(value);
    } else {
      const newIdx = newKeys.indexOf(key);
      if (oldStyles[k] !== newStyles[newIdx]) {
        toUpdate.push(newStyles[newIdx]);
      }
    }
  }
  return [flatStyles(toAdd), flatStyles(toRemove), flatStyles(toUpdate)];
}

export default function handleStateChangeOnClient(options = {}) {
  const opts = getOptions(options);
  const convertModules = createModuleToStylesConverter(opts);
  return ({ getState }) => next => action => {
    const prevState = getState();
    const result = next(action);
    const nextState = getState();
    if (prevState !== nextState) {
      const [toAdd, toRemove, toUpdate] = diff(prevState, nextState, opts);
      if (toAdd.length > 0 || toRemove.length > 0 || toUpdate.length > 0) {
        updateDomStyles(
          convertModules(toAdd),
          convertModules(toRemove),
          convertModules(toUpdate),
          opts
        );
      }
    }
    return result;
  };
}
