import React from 'react';
import { createContext } from 'react-broadcast';

const { Provider, Consumer } = createContext();

function StyleduxProvider({ store, children }) {
  return <Provider value={store}>{children}</Provider>;
}

export { StyleduxProvider, Consumer as StyleduxConsumer };
