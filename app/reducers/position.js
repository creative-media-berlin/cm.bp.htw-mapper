import { UPDATE_POSITION, ENTER_BUILDING, EXIT_BUILDING } from '../consts/actionTypes';
import { INITIAL_POSITION } from '../consts/coordinates';

const initialState = {
  coordinates: INITIAL_POSITION,
  floorLevel: 2,
  building: 'wh_c',
};

const positionReducer = (state = initialState, action) => {
  let newState = {};
  switch (action.type) {
    case UPDATE_POSITION:
      newState = action.position;
      break;
    case ENTER_BUILDING:
      newState = { building: action.building };
      break;
    case EXIT_BUILDING:
      newState = { building: null, floorLevel: 0 };
      break;
    default: newState = state;
  }
  return Object.assign({}, state, newState);
};

export default positionReducer;
