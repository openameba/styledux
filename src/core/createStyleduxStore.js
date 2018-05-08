import { createStore, applyMiddleware } from 'redux';

import rootReducer from './duck';

export default function createStyleduxStore(...middlewares) {
  if (middlewares && middlewares.length > 0) {
    return createStore(rootReducer, applyMiddleware(...middlewares));
  }
  return createStore(rootReducer);
}
