import dist from '@turf/distance';

// values are in SI units
const AVERAGE_WALKING_SPEED = 1.39;
const AVERAGE_FLOOR_CHANGE_TIME = 6.9;

export const getDistance = (path) => {
  let totalDistance = 0;
  for (let index = 0; index < path.length - 1; index++) {
    const firstElememt = path[index];
    const secondElement = path[index + 1];
    totalDistance += dist(firstElememt, secondElement) * 1000;
  }
  const floorsToTravel = Math.abs(path[0][2] - path[path.length - 1][2]);
  const totalFloorChangeTime = floorsToTravel * AVERAGE_FLOOR_CHANGE_TIME;
  totalDistance += totalFloorChangeTime * AVERAGE_WALKING_SPEED;
  return Math.round(totalDistance);
};

export const getEstimatedTime = (path, distance) => {
  const totalDistance = distance || getDistance(path);
  return totalDistance / AVERAGE_WALKING_SPEED;
};
