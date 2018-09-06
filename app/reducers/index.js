import { combineReducers } from 'redux';
import features from './features';
import position from './position';
import selection from './selection';
import menu from './menu';
import navigation from './navigation';
import status from './status';
import lastAction from './lastAction';

export default combineReducers({
  features,
  position,
  selection,
  menu,
  navigation,
  status,
  lastAction,
});
