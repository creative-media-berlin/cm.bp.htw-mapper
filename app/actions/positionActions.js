import { UPDATE_POSITION, ENTER_BUILDING, EXIT_BUILDING } from '../consts/actionTypes';

export const updatePosition = (coordinates, floorLevel = null) => {
  return {
    type: UPDATE_POSITION,
    position: { coordinates, floorLevel },
  };
};

export const enterBuilding = (building) => {
  console.log(`REGION ENTER: ${building}`);
  return {
    type: ENTER_BUILDING,
    building,
  };
};

export const exitBuilding = () => {
  console.log('REGION EXIT');
  return {
    type: EXIT_BUILDING,
  };
};
