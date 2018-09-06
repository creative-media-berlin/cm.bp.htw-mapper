import FLOORS from '../consts/floors';
import { MAPBOX_TOKEN } from '../config/credentials';
import { point } from '@turf/helpers';
import { generateLineStringsFromConnectors } from './fetchHelpers';

/* Features = GeoJSON data for our map

*  Data we need to process manually for this app that must be fetched:
*  LineStrings (edges for pathfinding), Connectors (points indicating stairs/elevators),
*  Points of Interests (printers, etc.), Rooms
* */

const fetchLayerFeatures = async (layerId) => {
  try {
    const url = `https://api.mapbox.com/datasets/v1/htw-team/${layerId}/features?access_token=${MAPBOX_TOKEN}`;
    const response = await fetch(url);
    const body = await response.json();
    return body.features;
  } catch (error) {
    throw error;
  }
};

const fetchConnectors = async () => {
  try {
    const layers = FLOORS.reduce((acc, floor) => acc.concat(floor.layers), []);
    const connectorLayers = layers.filter(layer => layer.connectors);
    const connectorsPromises = connectorLayers.map(layer => fetchLayerFeatures(layer.connectors));
    const allConnectors = await Promise.all(connectorsPromises);
    return generateLineStringsFromConnectors(allConnectors);
  } catch (error) {
    throw error;
  }
};

const point3DTo2D = (pointIn3D) => {
  const pointIn2D = [pointIn3D[0], pointIn3D[1]];
  return pointIn2D;
};

const getFeaturePointsCollections = (allPoints) => {
  const featurePointsCollections = [];
  allPoints.forEach((value, key) => {
    featurePointsCollections.push({
      type: 'FeatureCollection',
      features: allPoints.get(key),
      properties: { r_floor: +key },
    });
  });
  return featurePointsCollections;
};

const getLineStringsAndPoints = (allFeatures, connectors) => {
  const allLineStrings = [];
  const allPoints = new Map();
  allFeatures.forEach(features => {
    const lineStrings = features.filter(feature => feature.properties.r_floor);
    lineStrings.forEach(lineString => {
      const floor = lineString.properties.r_floor;
      const pointA = lineString.geometry.coordinates[0];
      const pointB = lineString.geometry.coordinates[1];
      if (!allPoints.has(floor)) {
        allPoints.set(floor, [point(point3DTo2D(pointA))]);
        allPoints.set(floor, [point(point3DTo2D(pointB))]);
      } else {
        allPoints.get(floor).push(point(point3DTo2D(pointA)));
        allPoints.get(floor).push(point(point3DTo2D(pointB)));
      }
      allLineStrings.push(lineString);
    });
  });

  const featureCollectionLineStrings = {
    type: 'FeatureCollection',
    features: allLineStrings.concat(connectors),
  };
  return [featureCollectionLineStrings, getFeaturePointsCollections(allPoints)];
};

export const fetchData = async () => {
  try {
    const layers = FLOORS.reduce((acc, floor) => acc.concat(floor.layers), []);
    const pathLayerPromises = layers.map(layer => fetchLayerFeatures(layer.paths));
    const allFeatures = await Promise.all(pathLayerPromises);

    // read single point features indicating a floorchange point, generate linestrings through floors
    const floorChangeLineStrings = await fetchConnectors();

    return getLineStringsAndPoints(allFeatures, floorChangeLineStrings);
  } catch (error) {
    throw error;
  }
};

export const fetchRooms = async () => {
  try {
    const layers = FLOORS.reduce((acc, floor) => acc.concat(floor.layers), []);
    const roomLayers = layers.filter(layer => layer.rooms);
    const roomLayerPromises = roomLayers.map(layer => fetchLayerFeatures(layer.rooms));
    const allRooms = await Promise.all(roomLayerPromises);
    let rooms = [].concat(...allRooms);
    rooms = rooms.filter(r => r.geometry.type === 'Polygon');
    return rooms;
  } catch (error) {
    throw error;
  }
};

export const fetchPOI = async () => {
  try {
    const layers = FLOORS.reduce((acc, floor) => acc.concat(floor.layers), []);
    const poiLayers = layers.filter(layer => layer.poi);
    const poiLayerPromises = poiLayers.map(layer => fetchLayerFeatures(layer.poi));
    const allPoi = await Promise.all(poiLayerPromises);
    const poi = [].concat(...allPoi);
    return poi;
  } catch (error) {
    throw error;
  }
};

