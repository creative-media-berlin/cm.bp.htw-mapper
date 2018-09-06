const initialState = { type: null };

const lastActionReducer = (state = initialState, action) => {
  let newState = {};
  if (action.type) {
    newState = { type: action.type };
  } else {
    newState = state;
  }
  return Object.assign({}, state, newState);
};

export default lastActionReducer;
