import { point, polygon } from '@turf/helpers';
import inPolygon from '@turf/boolean-point-in-polygon';

import BUILDINGS from '../consts/buildings';

export default (position) => {
  for (const building of BUILDINGS) {
    // build area and close it with its first point
    const area = polygon([building.bounds.concat(building.bounds[0])]);
    if (inPolygon(point(position), area)) {
      return building.name;
    }
  }
  return null;
};
