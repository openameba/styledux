import { Map } from 'immutable';

export const ADD_STYLE = 'styledux/ADD_STYLE';
export const REMOVE_STYLE = 'styledux/REMOVE_STYLE';

export function addStyle(target, style) {
  return {
    type: ADD_STYLE,
    payload: {
      target,
      style
    }
  };
}

export function removeStyle(target) {
  return {
    type: REMOVE_STYLE,
    payload: {
      target
    }
  };
}

const INIT_STATE = new Map();

export default function rootReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case ADD_STYLE: {
      const { target, style } = action.payload;
      if (state.has(target)) {
        return state;
      }
      return state.set(target, style);
    }
    case REMOVE_STYLE: {
      const { target } = action.payload;
      if (state.has(target)) {
        return state.delete(target);
      }
      return state;
    }
    default:
      return state;
  }
}
