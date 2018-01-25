import { createProvider } from 'react-redux';
import { STORE_KEY } from './constants';

const StyleduxProvider = createProvider(STORE_KEY);
StyleduxProvider.displayName = 'StyleduxProvider';

export default StyleduxProvider;
