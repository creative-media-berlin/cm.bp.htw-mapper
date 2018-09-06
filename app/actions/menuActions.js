import { SET_MENU, TOGGLE_MENU } from '../consts/actionTypes';

export const toggleMenu = () => {
  return {
    type: TOGGLE_MENU,
  };
};

export const setMenu = (active) => {
  return {
    type: SET_MENU,
    active,
  };
};
