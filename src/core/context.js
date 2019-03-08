import React from 'react';

const { Provider, Consumer } = React.createContext();

function StyleduxProvider({ store, children }) {
  return <Provider value={store}>{children}</Provider>;
}

export { StyleduxProvider, Consumer as StyleduxConsumer };
