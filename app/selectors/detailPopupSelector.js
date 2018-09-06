import { createSelector } from 'reselect';
import { SELECT_ROOM, TOGGLE_MENU } from '../consts/actionTypes';
import { popupStates } from '../components/DetailPopupAnimationHandler/styles';

const menuActiveSelector = (state) => state.menu.isMenuActive;
const actionSelector = (state) => state.lastAction.type;
const roomIsSelectedSelector = (state) => state.selection.room !== null;

export const getDetailPopupState = createSelector(
  menuActiveSelector,
  roomIsSelectedSelector,
  actionSelector,
  (menuActive, roomIsSelected, action) => {
    let forcePopupState = null;
    if (roomIsSelected && action === TOGGLE_MENU) {
      if (menuActive) {
        forcePopupState = popupStates.hidden;
      } else if (!menuActive) {
        forcePopupState = popupStates.medium;
      }
    }
    if (action === SELECT_ROOM) {
      forcePopupState = roomIsSelected ? popupStates.medium : popupStates.hidden;
    }
    return {
      forcePopupState,
    };
  }
);
