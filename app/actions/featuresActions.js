import { UPDATE_FEATURES, UPDATE_ROOMS, UPDATE_POI } from '../consts/actionTypes';

export const updateFeatures = (response) => {
  const featureLines = response[0];
  const featurePoints = response[1];
  return {
    type: UPDATE_FEATURES,
    features: { featureLines, featurePoints },
  };
};

export const updateRooms = (rooms) => ({
  type: UPDATE_ROOMS,
  rooms,
});

export const updatePOI = (poi) => ({
  type: UPDATE_POI,
  poi,
});
