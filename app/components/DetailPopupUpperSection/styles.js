import { StyleSheet } from 'react-native';
import colors from '../../config/colors';

export default StyleSheet.create({
  redContainer: {
    height: 140,
  },
  invisibleContainer: {
    height: 40,
    backgroundColor: 'transparent',
    marginBottom: -1,
  },
  poiTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: colors.primaryRed,
    color: colors.white,
  },
  navigationButton: {
    position: 'absolute',
    top: -35,
    bottom: 10,
    right: 20,
    zIndex: 1,
  },
  navigationButtonInnerClass: {
    margin: 5,
    marginRight: 4,
    alignItems: 'center',
  },
  redRow: {
    marginBottom: -1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 10,
    paddingTop: 5,
    backgroundColor: colors.primaryRed,
  },
  item: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 18,
  },
  bottomSpacer: {
    marginBottom: 40,
  },
});
