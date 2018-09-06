import {
  UPDATE_GRAPH, UPDATE_PATH,
  DEACTIVATE_NAVIGATION, TOGGLE_NAVIGATION,
  SET_FLOORCHANGE_MODE, SET_MIN_ELEVATOR_LEVEL_DIFF,
} from '../consts/actionTypes';

export const updateGraph = (graph) => {
  return {
    type: UPDATE_GRAPH,
    graph,
  };
};

export const updatePath = (pathInformation) => {
  return {
    type: UPDATE_PATH,
    pathInformation,
  };
};

export const setMode = (mode) => {
  return {
    type: SET_FLOORCHANGE_MODE,
    mode,
  };
};

export const setMinElevatorLevelDiff = (minLevel) => {
  return {
    type: SET_MIN_ELEVATOR_LEVEL_DIFF,
    minLevel,
  };
};

export const deactivateNavigation = () => {
  return {
    type: DEACTIVATE_NAVIGATION,
  };
};

export const toggleNavigation = () => {
  return {
    type: TOGGLE_NAVIGATION,
  };
};
