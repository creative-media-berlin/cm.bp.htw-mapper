import { point } from '@turf/helpers';
import inPolygon from '@turf/boolean-point-in-polygon';

export const inTransitionRoom = (position, room) => {
  if (inPolygon(point(position), room)) {
    if (room.properties.type === 'stairs' || room.properties.type === 'elevator') {
      return true;
    }
  }
  return false;
};

export const getTransitionRoomName = (coordinate, rooms) => {
  const roomsOnPointFloor = rooms ? rooms.filter(room => +room.properties.floor === coordinate[2]) : null;
  if (!roomsOnPointFloor) {
    return null;
  }
  for (const room of roomsOnPointFloor) {
    if (inTransitionRoom(coordinate, room)) {
      return room.properties.building + room.properties.name;
    }
  }
  return null;
};
