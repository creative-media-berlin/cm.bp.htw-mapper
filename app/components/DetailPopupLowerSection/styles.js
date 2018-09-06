import { StyleSheet } from 'react-native';
import colors from '../../config/colors';

export default StyleSheet.create({
  whiteContainer: {
    height: 70,
    backgroundColor: colors.white,
  },
  item: {
    color: colors.white,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    bottom: 2,
    left: 3,
    marginHorizontal: 20,
  },
  bottomSpacer: {
    marginBottom: 40,
  },
  rowButton: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  rowButtonText: {
    marginTop: 40,
    paddingTop: 0,
    position: 'absolute',
  },
  share: {
    paddingLeft: 5,
  },
  roomStatus: {
    marginLeft: 8,
  },
});
