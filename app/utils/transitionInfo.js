import { getTransitionRoomName } from './inTransitionRoom';
import FLOORS from '../consts/floors';

function addTransitionGoToFloor(transitionInfo) {
  const fullTransitionInfo = FLOORS.map(() => []);
  for (let i = 0; i < transitionInfo.length; i ++) {
    const transitionBlocks = transitionInfo[i];
    fullTransitionInfo[i] = transitionBlocks.map(transitionBlock => {
      const newTransitionBlock = transitionBlock;
      const goToFloorLevel = transitionBlock.fromFloor + transitionBlock.transition;
      newTransitionBlock.goToFloorString = FLOORS[goToFloorLevel].name;
      return newTransitionBlock;
    });
  }
  return fullTransitionInfo;
}


function findTransitionBlocks(transitionId, floorInfos) {
  const allBlocks = [];
  for (let i = 0; i < floorInfos.length; i ++) {
    const floor = floorInfos[i];
    const transitionBlock = floor.find(block => block.transitionName === transitionId);
    if (transitionBlock) {
      allBlocks.push(transitionBlock);
    }
  }
  return allBlocks;
}

export function getFloorTransitionInfo(path, rooms) {
  /* Generates marker information from path.
  *  FromFloor marks the position where to draw the marker,
  *  the transition shows the difference until the final
  *  floor of one transition (for stairs and elevators).
  * */
  const transitionInfo = FLOORS.map(() => []);
  let lastFloor = path[0][2];
  for (let i = 0; i < path.length; i ++) {
    const point = path[i];
    const currFloor = point[2];
    if (lastFloor !== currFloor) {
      const transition = currFloor - lastFloor;
      for (let n = lastFloor; transition < 0 ? n > currFloor : n < currFloor; transition < 0 ? n-- : n++) {
        let floorChange = transition < 0 ? -1 : 1;
        let fromFloor = n;
        const transitionRoomName = getTransitionRoomName(point, rooms);
        const transitionBlocks = findTransitionBlocks(transitionRoomName, transitionInfo);
        if (transitionBlocks.length > 0) {
          floorChange = transitionBlocks[0].transition + floorChange;
          fromFloor = transitionBlocks[0].fromFloor;
          for (let m = 0; m < transitionBlocks.length; m ++) {
            transitionBlocks[m].transition = floorChange;
            transitionBlocks[m].fromFloor = fromFloor;
          }
        }
        transitionInfo[n].push({
          transitionName: transitionRoomName,
          fromFloor,
          transition: floorChange,
        });
      }
    }
    lastFloor = currFloor;
  }
  return addTransitionGoToFloor(transitionInfo);
}

