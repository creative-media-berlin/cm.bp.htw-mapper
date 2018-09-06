/* eslint-disable no-use-before-define */
import Fuse from 'fuse.js';
import { getPointFeaturesForPathfinding } from './nearestFeatures';
import { getPaths } from './pathfinder';
import { getDistance } from './eta';

export const search = (data) => {
  const { type, input, rooms, poi, pathfinding } = data;
  switch (type) {
    case 'rooms':
      return searchRooms(input.replace(' ', ''), rooms);
    case 'toilets':
      return searchToilets(rooms, pathfinding);
    case 'snacks':
      return searchSnacks(poi, pathfinding);
    case 'printers':
      return searchPrinters(rooms, poi, pathfinding);
    default:
      return [];
  }
};

const searchRooms = (input, rooms) => {
  const toSearch = rooms.filter(room => (
    room.properties.type === 'office' ||
    room.properties.type === 'seminar' ||
    room.properties.type === 'lab'
  )).map(room => ({
    ...room,
    fullName: room.properties.building + room.properties.name,
  }));
  const options = {
    shouldSort: true,
    includeScore: true,
    threshold: 0.2,
    keys: ['fullName', 'properties.descr'],
  };
  const fuse = new Fuse(toSearch, options);
  return fuse.search(input);
};

const searchToilets = (rooms, pathfinding) => {
  const toilets = rooms.filter(room =>
    room.properties.type && room.properties.type.startsWith('wc')
  );
  const paths = generatePaths(toilets, pathfinding);
  return mapDistances(toilets, paths)
    .sort((a, b) => (a.distance - b.distance));
};

const searchSnacks = (poi, pathfinding) => {
  const snacks = poi.filter((point) => {
    const { type } = point.properties;
    return type && (type === 'snack' || type === 'drink');
  });
  const paths = generatePaths(snacks, pathfinding);
  const withDistances = mapDistances(snacks, paths);
  return mapTypeToName(withDistances)
    .sort((a, b) => (a.distance - b.distance));
};

const searchPrinters = (rooms, poi, pathfinding) => {
  const printerRooms = rooms.filter(room => room.properties.type === 'printer');
  const printerPOI = poi
    .filter(point => point.properties.type === 'printer')
    .map(point => ({
      ...point,
      properties: {
        ...point.properties,
        name: 'Drucker',
      },
    }));
  const printers = printerPOI.concat(printerRooms);
  const paths = generatePaths(printers, pathfinding);
  return mapDistances(printers, paths)
    .sort((a, b) => (a.distance - b.distance));
};

const generatePaths = (rooms, pathfinding) => {
  const { position, featurePoints, transitionSettings } = pathfinding;
  const pointsPairs = rooms.map(room => {
    const pathfindingPoints = getPointFeaturesForPathfinding(featurePoints, position, room);
    return pathfindingPoints ?
      [pathfindingPoints.startPoint, pathfindingPoints.finishPoint] :
      [null, null];
  });
  return getPaths(transitionSettings, pointsPairs);
};

const mapDistances = (rooms, paths) => (
  rooms.map((room, index) => {
    const path = paths[index];
    const distance = path ? getDistance(path) : 10000;
    return {
      item: room,
      distance,
    };
  })
);

const mapTypeToName = (rooms) => (
  rooms.map((room) => {
    const { type } = room.item.properties;
    const capitalized = type.charAt(0).toUpperCase() + type.substr(1);
    return {
      ...room,
      item: {
        ...room.item,
        properties: { ...room.item.properties, name: capitalized },
      },
    };
  })
);

export const isSearchDataValid = (data) => {
  const { type, rooms, pathfinding, poi } = data;
  const { transitionSettings, featurePoints, position } = pathfinding;
  if (type !== 'rooms' && (!transitionSettings || !featurePoints)) {
    return false;
  }
  let valid = false;
  switch (type) {
    case 'snacks': valid = poi && position; break;
    case 'toilets': valid = rooms && position; break;
    default: valid = rooms !== null;
  }
  return valid;
};
