import { SELECT_FLOOR, SELECT_ROOM } from '../consts/actionTypes';
import FLOORS from '../consts/floors';

const initialState = {
  floor: { ...FLOORS.find(floor => floor.floorLevel === 2) },
  room: null,
  lastAction: null,
};

const selectionReducer = (state = initialState, action) => {
  let newState = {};
  switch (action.type) {
    case SELECT_FLOOR: newState = { floor: action.floor }; break;
    case SELECT_ROOM: newState = { room: action.room }; break;
    default: newState = state;
  }
  newState.lastAction = action.type;
  return Object.assign({}, state, newState);
};

export default selectionReducer;
