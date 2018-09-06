import { UPDATE_FEATURES, UPDATE_ROOMS, UPDATE_POI } from '../consts/actionTypes';

const initialState = {
  featureLines: null,
  featurePoints: null,
  rooms: null,
  poi: null,
};

const featuresReducer = (state = initialState, action) => {
  let newState = {};
  switch (action.type) {
    case UPDATE_FEATURES: newState = action.features; break;
    case UPDATE_ROOMS: newState = { rooms: action.rooms }; break;
    case UPDATE_POI: newState = { poi: action.poi }; break;
    default: newState = state;
  }
  return Object.assign({}, state, newState);
};

export default featuresReducer;
