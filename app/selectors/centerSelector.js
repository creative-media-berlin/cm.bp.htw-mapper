import { createSelector } from 'reselect';
import centroid from '@turf/centroid/index';
import { UPDATE_PATH, UPDATE_POSITION, SELECT_ROOM, TOGGLE_NAVIGATION } from '../consts/actionTypes';
import calculateDistance from '../utils/distance';

const navigationGotInactiveSelector = (state) => (
  !state.navigation.navigationActive && state.lastAction.type === TOGGLE_NAVIGATION
);
const navigationActiveSelector = (state) => state.navigation.navigationActive;
const nextCenterCoordinateSelector = (state) => {
  if (state.navigation.path && state.lastAction.type === UPDATE_PATH) {
    const position = state.position.floorLevel;
    const path = state.navigation.path;
    return path[position][0][0];
  }
  return null;
};
const positionUpdatedSelector = (state) => UPDATE_POSITION === state.lastAction.type;
const selectedRoomSelector = (state) => state.selection.room;
const actionSelector = (state) => state.lastAction.type;
const positionSelector = (state) => state.position;


const getRoomCoordinate = (room) => {
  if (!room) {
    return null;
  }
  const roomCentroid = centroid(room);
  return roomCentroid.geometry.coordinates;
};

export const getCenterCoordinate = createSelector(
  actionSelector,
  navigationActiveSelector,
  navigationGotInactiveSelector,
  nextCenterCoordinateSelector,
  selectedRoomSelector,
  positionUpdatedSelector,
  positionSelector,
  (
    action,
    navigationActive,
    navigationGotInactive,
    nextCenterCoordinate,
    selectedRoom,
    positionUpdated,
    position,
  ) => {
    const nextCenter = {
      coordinate: nextCenterCoordinate,
      isSelectedRoomCenter: false,
    };
    if (action === SELECT_ROOM) {
      nextCenter.coordinate = getRoomCoordinate(selectedRoom);
      nextCenter.isSelectedRoomCenter = true;
    }
    let followUser = navigationActive;
    if (nextCenterCoordinate && calculateDistance(position.coordinates, nextCenterCoordinate) > 250) {
      followUser = false; // user is too far away to follow
    }
    const center = {
      nextCenter,
      navigationGotInactive,
      nextCenterCoordinate,
      positionUpdated,
      followUser,
    };
    return center;
  }
);
