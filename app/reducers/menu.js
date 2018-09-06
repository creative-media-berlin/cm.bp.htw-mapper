import { SET_MENU, TOGGLE_MENU } from '../consts/actionTypes';

const initialState = {
  isMenuActive: false,
};

const menuReducer = (state = initialState, action) => {
  let newState = {};
  switch (action.type) {
    case TOGGLE_MENU:
      newState = { isMenuActive: !state.isMenuActive };
      break;
    case SET_MENU:
      newState = { isMenuActive: action.active };
      break;
    default: newState = state;
  }
  return Object.assign({}, state, newState);
};

export default menuReducer;
