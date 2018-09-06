import {
  IGNORE_GPS_STATUS, IGNORE_WIFI_STATUS,
  UPDATE_GPS_STATUS, UPDATE_WIFI_STATUS,
} from '../consts/actionTypes';

export const updateGpsStatus = (status) => ({
  type: UPDATE_GPS_STATUS,
  status,
});

export const updateWifiStatus = (status) => ({
  type: UPDATE_WIFI_STATUS,
  status,
});

export const ignoreGpsStatus = () => ({
  type: IGNORE_GPS_STATUS,
});

export const ignoreWifiStatus = () => ({
  type: IGNORE_WIFI_STATUS,
});
