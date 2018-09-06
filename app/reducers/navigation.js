import {
  UPDATE_GRAPH, UPDATE_PATH,
  DEACTIVATE_NAVIGATION, TOGGLE_NAVIGATION,
  SET_FLOORCHANGE_MODE, SET_MIN_ELEVATOR_LEVEL_DIFF,
} from '../consts/actionTypes';
import { STANDARD } from '../consts/modeTypes';

const initialState = {
  graph: {
    stairsOnly: null,
    elevatorsOnly: null,
  },
  minElevatorLevelDiff: 4,
  activeGraph: STANDARD,
  navigationActive: false,
  path: null,
  previousTarget: null,
  totalDistanceInMeters: null,
  estimatedTime: null,
  transitionInfo: null,
};

const navigationReducer = (state = initialState, action) => {
  let newState = {};
  switch (action.type) {
    case SET_FLOORCHANGE_MODE: newState = { activeGraph: action.mode }; break;
    case SET_MIN_ELEVATOR_LEVEL_DIFF: newState = { minElevatorLevelDiff: action.minLevel }; break;
    case UPDATE_GRAPH: newState = { graph: action.graph }; break;
    case UPDATE_PATH: newState = { ...action.pathInformation }; break;
    case TOGGLE_NAVIGATION: newState = { navigationActive: !state.navigationActive }; break;
    case DEACTIVATE_NAVIGATION: newState = { navigationActive: false, path: null }; break;
    default: newState = state;
  }
  return Object.assign({}, state, newState);
};

export default navigationReducer;
