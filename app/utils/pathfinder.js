import PF from 'pathfinding';
import FLOORS from '../consts/floors';
import { STANDARD, ELEVATORS_ONLY, STAIRS_ONLY } from '../consts/modeTypes';

const getExistingNode = (nodeArray, node) => {
  const length = nodeArray.length;
  for (let i = 0; i < length; i++) {
    if (nodeArray[i].x === node.x && nodeArray[i].y === node.y && nodeArray[i].z === node.z) {
      return nodeArray[i];
    }
  }
  return null;
};

export function orderPathByFloor(path) {
  const pathParts = FLOORS.map(() => []);
  let lastFloor = null;
  path.forEach(point => {
    const floorArray = pathParts[point[2]];
    if (point[2] !== lastFloor) {
      if (lastFloor != null) {
        const upperPoint = Math.max(point[2], lastFloor);
        const lowerPoint = Math.min(point[2], lastFloor);
        for (let i = lowerPoint + 1; i < upperPoint; i++) {
          const transitionFloorArray = pathParts[i];
          transitionFloorArray.push([]);
          transitionFloorArray[transitionFloorArray.length - 1].push([point[0], point[1]]);
        }
      }
      floorArray.push([]);
    }
    floorArray[floorArray.length - 1].push([point[0], point[1]]);
    lastFloor = point[2];
  });
  return pathParts;
}

export const buildGraph = (features, mode) => {
  const nodes = [];
  features.features.forEach(feature => {
    // generates pathfinding graph
    if (mode && feature.properties.type !== mode.except) {
      const nodeA = new PF.Node(...feature.geometry.coordinates[0]);
      const nodeB = new PF.Node(...feature.geometry.coordinates[1]);
      const existingNodeA = getExistingNode(nodes, nodeA);
      const existingNodeB = getExistingNode(nodes, nodeB);
      // put point in graph if not existing, add neighbour node if not existing
      if (existingNodeA && !getExistingNode(existingNodeA.neighbors, nodeB)) {
        existingNodeA.neighbors.push(existingNodeB || nodeB);
      } else {
        nodeA.neighbors.push(existingNodeB || nodeB);
        nodes.push(nodeA);
      }
      if (existingNodeB && !getExistingNode(existingNodeB.neighbors, nodeA)) {
        existingNodeB.neighbors.push(existingNodeA || nodeA);
      } else {
        nodeB.neighbors.push(existingNodeA || nodeA);
        nodes.push(nodeB);
      }
    }
  });

  // create a dictionary for faster graph copying
  const nodeDict = new Map();
  nodes.forEach((node, index) => {
    nodeDict.set(node, index);
  });

  return {
    nodes,
    dict: nodeDict,
    type: mode,
  };
};

const copyNode = (node) => {
  return new PF.Node(node.x, node.y, node.z);
};

const createCopy = (graph) => {
  const newNodes = [];
  graph.nodes.forEach((node) => {
    newNodes.push(copyNode(node));
  });
  graph.nodes.forEach((node, index) => {
    node.neighbors.forEach(neighborNode => {
      const neighborIndex = graph.dict.get(neighborNode);
      newNodes[index].neighbors.push(newNodes[neighborIndex]);
    });
  });
  return newNodes;
};


function getGraph(transitionSettings, pointPairs) {
  const { graph, activeGraph, minElevatorLevelDiff } = transitionSettings;
  const floorLevelDiff = Math.abs(pointPairs[0][2] - pointPairs[1][2]);
  if (activeGraph.name === STANDARD.name) {
    if (floorLevelDiff >= minElevatorLevelDiff) {
      return graph[ELEVATORS_ONLY.name];
    }
    return graph[STAIRS_ONLY.name];
  }
  return graph[activeGraph.name];
}


export function getPath(specificTransitionSettings, start, finish) {
  if (start != null && start.constructor !== [].constructor) {
    throw new Error('Start point must be an array with [ lat, long ]');
  }

  if (finish != null && finish.constructor !== [].constructor) {
    throw new Error('Finish point must be an array with [ lat, long ]');
  }
  const applicableGraph = getGraph(specificTransitionSettings, [start, finish]);
  const graphNodes = createCopy(applicableGraph); // cannot use same graph twice, needs to be a copy

  const startPoint = getExistingNode(graphNodes, new PF.Node(...start));
  const finishPoint = getExistingNode(graphNodes, new PF.Node(...finish));

  if (!startPoint || !finishPoint) {
    console.log('Could not find start or finish point within the path graph.');
    return null;
  }

  const pathFinder = new PF.AStarFinder();

  const path = pathFinder.findPath(startPoint, finishPoint, graphNodes);
  if (!path || path.length < 2) {
    console.log('Did not find any path.');
    return null;
  }

  return path;
}

export function getPaths(generalTransitionSettings, pointsPairs) {
  return pointsPairs.map((pair) => {
    const [start, finish] = pair;
    const path = getPath(generalTransitionSettings, start, finish);
    if (!path || path.length < 2) {
      return null;
    }
    return path;
  });
}

export function getGraphs(featureLines) {
  const graph = {};
  graph[STAIRS_ONLY.name] = buildGraph(featureLines, STAIRS_ONLY);
  graph[ELEVATORS_ONLY.name] = buildGraph(featureLines, ELEVATORS_ONLY);
  return graph;
}
