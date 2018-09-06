import nearestPoint from '@turf/nearest/index';
import centroid from '@turf/centroid/index';

const getFeaturePointsForFloor = (featurePoints, floor) => {
  return featurePoints.find(featurePointsCollection => (
    featurePointsCollection.properties.r_floor === +floor
  ));
};

export function getPointFeaturesForPathfinding(featurePoints, position, room) {
  const roomfeaturePoints = getFeaturePointsForFloor(featurePoints, room.properties.floor);
  const positionfeaturePoints = getFeaturePointsForFloor(featurePoints, position.floorLevel);
  const nearestFeature = nearestPoint(position.coordinates, positionfeaturePoints);
  const startPoint = [...nearestFeature.geometry.coordinates, position.floorLevel];
  const roomCentroid = centroid(room);
  const roomPoint = nearestPoint(roomCentroid, roomfeaturePoints);
  const finishPoint = [...roomPoint.geometry.coordinates, +room.properties.floor];

  return {
    startPoint,
    finishPoint,
  };
}
