import { StyleSheet } from 'react-native';
import colors from '../../../config/colors';

export default StyleSheet.create({
  radioButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonLabel: {
    paddingLeft: 10,
    paddingRight: 20,
    fontSize: 18,
  },
  radioButtonOff: {
    height: 30,
    width: 30,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonOn: {
    height: 15,
    width: 15,
    borderRadius: 6,
    backgroundColor: colors.darkRed,
  },
});
