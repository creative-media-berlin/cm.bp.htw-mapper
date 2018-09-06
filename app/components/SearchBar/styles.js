import { StyleSheet } from 'react-native';
import colors from '../../config/colors';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    zIndex: 10,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
});

export const uiTheme = {
  palette: {
    primaryColor: colors.white,
    alternateTextColor: colors.primaryGrey,
  },
  toolbar: {
    container: {
      height: 50,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
};
