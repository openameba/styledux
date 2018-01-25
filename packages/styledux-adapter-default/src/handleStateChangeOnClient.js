import getOptions from './getOptions';
import createModuleToStylesConverter from './createModuleToStylesConverter';
import updateDomStyles from './updateDomStyles';

function diff(oldState, newState) {
  const toAdd = newState
    .filter((v, k) => !oldState.has(k))
    .reduce((r, v) => r.concat(v), []);
  const toRemove = oldState
    .filter((v, k) => !newState.has(k))
    .reduce((r, v) => r.concat(v), []);
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
