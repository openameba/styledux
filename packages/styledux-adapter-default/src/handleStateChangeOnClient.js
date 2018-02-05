import getOptions from './getOptions';
import createModuleToStylesConverter from './createModuleToStylesConverter';
import updateDomStyles from './updateDomStyles';
import flatStyles from './flatStyles';

function diff(oldState, newState) {
  let toAdd = [];
  let toRemove = [];
  const oldStyles = flatStyles(oldState.values);
  const newStyles = flatStyles(newState.values);

  for (let k = 0, newLen = newStyles.length; k < newLen; k += 1) {
    const style = newStyles[k];
    if (oldStyles.indexOf(style) === -1 && toAdd.indexOf(style) === -1) {
      toAdd.push(style);
    }
  }
  for (let k = 0, oldLen = oldStyles.length; k < oldLen; k += 1) {
    const style = oldStyles[k];
    if (newStyles.indexOf(style) === -1 && toRemove.indexOf(style) === -1) {
      toRemove = toRemove.concat(style);
    }
  }
  return [toAdd, toRemove];
}

export default function handleStateChangeOnClient(options = {}) {
  const opts = getOptions(options);
  const convertModules = createModuleToStylesConverter(opts);
  return ({ getState }) => next => action => {
    const prevState = getState();
    const result = next(action);
    const nextState = getState();
    if (prevState !== nextState) {
      const [toAdd, toRemove] = diff(prevState, nextState, opts);
      if (toAdd.length > 0 || toRemove.length > 0) {
        updateDomStyles(convertModules(toAdd), convertModules(toRemove), opts);
      }
    }
    return result;
  };
}
