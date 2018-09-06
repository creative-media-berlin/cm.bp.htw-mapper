import { SELECT_FLOOR, SELECT_ROOM } from '../consts/actionTypes';
import FLOORS from '../consts/floors';

export const selectFloor = (floorlevel) => {
  const floor = FLOORS.find(f => f.floorLevel === floorlevel);
  return {
    type: SELECT_FLOOR,
    floor: floor || FLOORS.find(f => f.floorLevel === 0),
  };
};

export const selectRoom = (room) => {
  const validatedRoom = room;
  if (room) {
    validatedRoom.properties.floor = +room.properties.floor; // make sure it's an int
  }
  return {
    type: SELECT_ROOM,
    room: validatedRoom,
  };
};
