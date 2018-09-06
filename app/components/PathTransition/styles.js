import { StyleSheet } from 'react-native';
import colors from '../../config/colors';

export default StyleSheet.create({
  circle: {
    width: 25,
    height: 25,
    borderRadius: 100 / 2,
    backgroundColor: colors.blue,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  transitionText: {
    color: colors.white,
    fontSize: 9,
  },
});

export const roomStyle = {
  fillOpacity: 0.6,
  fillColor: colors.blue,
};
