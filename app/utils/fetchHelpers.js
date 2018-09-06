import FLOORS from '../consts/floors';
import { lineString as makeLineString } from '@turf/helpers';

/*
  Connectors are the transition points in our map data.
  The connections between floors must be generated manually.
  Example connector point:
    {
      "type": "Feature",
      "properties": {
        "name": "A1",
        "toFloor": "2",
        "type": "elevator",
        "connector": "true",
        "floor": 2,
        "building": "h"
      },
      "geometry": {
        "coordinates": [
          13.525316,
          52.455051
        ],
        "type": "Point"
      }
    }
 */

const getTransitionId = (floorPoint) => (
  floorPoint.properties.building + floorPoint.properties.name
);

const filterTransitionDetails = (floorpoint) => {
  const pointFrom = floorpoint.geometry.coordinates;
  pointFrom[2] = floorpoint.properties.floor;
  const goesToFloor = floorpoint.properties.toFloor;
  return {
    pointFrom,
    goesToFloor,
    name: floorpoint.properties.name,
    type: floorpoint.properties.type,
  };
};

const orderConnectorsByTransitionId = (allConnectors) => {
  // allConnectors - array of arrays of connectors (one for each floor of each building)
  // transitionElement - array of points to be connected to create a vertical linestring for floorchange
  const transitionElements = new Map();
  allConnectors.forEach(floorPoints => {
    floorPoints.forEach(floorpoint => {
      const transitionId = getTransitionId(floorpoint);
      let transitionElement = transitionElements.get(transitionId);
      const transitionPoint = filterTransitionDetails(floorpoint);
      if (!transitionElement) {
        transitionElements.set(transitionId, FLOORS.map(() => { return {}; }));
        transitionElement = transitionElements.get(transitionId);
      }
      transitionElement[floorpoint.properties.floor] = transitionPoint;
    });
  });
  return transitionElements;
};

const isObjectEmpty = (object) => (
  object.constructor === Object && Object.keys(object).length === 0
);

const generateLineStrings = (transitionElements) => {
  /* Elevator connector points always point to the top level
     while stairs points point to the next upper point.
     Those elevator connectors connect to each level until the
     top one directly. Stairs connectors connect only to the
     next upper point.
  */
  const floorChangeLineStrings = [];
  transitionElements.forEach((transitionElement) => {
    transitionElement.forEach(transitionPoint => {
      if (transitionPoint && !isObjectEmpty(transitionPoint)) {
        const pointFrom = transitionPoint.pointFrom;
        const goesToFloor = transitionPoint.goesToFloor;
        goesToFloor.forEach(toFloorValue => {
          const targetPoint = transitionElement[toFloorValue];
          if (targetPoint && transitionPoint !== targetPoint) {
            const pointTo = transitionElement[toFloorValue].pointFrom;
            const linestring = makeLineString([pointFrom, pointTo]);
            linestring.properties.type = transitionPoint.type;
            linestring.properties.name = transitionPoint.name;
            floorChangeLineStrings.push(linestring);
          }
        });
      }
    });
  });
  return floorChangeLineStrings;
};


export const generateLineStringsFromConnectors = (connectors) => {
  const orderedTransitionElements = orderConnectorsByTransitionId(connectors);
  return generateLineStrings(orderedTransitionElements);
};
