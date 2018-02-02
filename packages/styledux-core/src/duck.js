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

function getInitState() {
  return {
    keys: [],
    values: []
  };
}

export default function rootReducer(state = getInitState(), action) {
  switch (action.type) {
    case ADD_STYLE: {
      const { target, style } = action.payload;
      const idx = state.keys.indexOf(target);
      if (idx !== -1) {
        return state;
      }
      return {
        keys: [...state.keys, target],
        values: [...state.values, style]
      };
    }
    case REMOVE_STYLE: {
      const { keys, values } = state;
      const { target } = action.payload;
      const idx = keys.indexOf(target);
      if (idx === -1) {
        return state;
      }
      return {
        keys: keys.slice(0, idx).concat(keys.slice(idx + 1)),
        values: values.slice(0, idx).concat(values.slice(idx + 1))
      };
    }
    default:
      return state;
  }
}
