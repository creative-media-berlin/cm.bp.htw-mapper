import {
  IGNORE_GPS_STATUS, IGNORE_WIFI_STATUS,
  UPDATE_GPS_STATUS, UPDATE_WIFI_STATUS,
} from '../consts/actionTypes';

const initialState = {
  gps: true,
  wifi: true,
  ignoreGps: false,
  ignoreWifi: false,
};

const statusReducer = (state = initialState, action) => {
  let newState = {};
  switch (action.type) {
    case UPDATE_GPS_STATUS:
      newState = { gps: action.status };
      break;
    case UPDATE_WIFI_STATUS:
      newState = { wifi: action.status };
      break;
    case IGNORE_GPS_STATUS:
      newState = { ignoreGps: true };
      break;
    case IGNORE_WIFI_STATUS:
      newState = { ignoreWifi: true };
      break;
    default: newState = state;
  }
  return Object.assign({}, state, newState);
};

export default statusReducer;
