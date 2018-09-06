import { createSelector } from 'reselect';

const gpsStatusSelector = (state) => {
  const { gps, ignoreGps } = state.status;
  const { building } = state.position;
  return !gps && !building && !ignoreGps;
};
const wifiStatusSelector = (state) => {
  const { wifi, ignoreWifi } = state.status;
  const { building } = state.position;
  return !wifi && building !== null && !ignoreWifi;
};

export const getStatusErrors = createSelector(
  gpsStatusSelector,
  wifiStatusSelector,
  (gpsError, wifiError) => ({ gpsError, wifiError })
);
