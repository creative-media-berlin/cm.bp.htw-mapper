import { StyleSheet } from 'react-native';
import colors from '../../../config/colors';

export default StyleSheet.create({
  content: {
    padding: '10%',
    width: '100%',
    flexWrap: 'nowrap',
    flexDirection: 'column',
  },
  itemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',

  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  courseTitle: {
    fontSize: 23,
    color: 'black',
    flex: 1,
  },
  today: {
    fontSize: 22,
    color: colors.primaryRed,
    fontWeight: 'bold',
    paddingBottom: 20,
    paddingTop: -5,
  },


});
