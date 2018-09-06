import { StyleSheet } from 'react-native';
import colors from '../../config/colors';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    width: '80%',
    height: '100%',
    backgroundColor: '#fff',
    left: 0,
    top: 0,
    zIndex: 20,
    transform: [{ translateX: -500 }],
  },

  containerBig: {
    width: '100%',
  },

  header: {
    position: 'relative',
    width: '100%',
    height: '30%',
    backgroundColor: colors.primaryRed,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },

  headerMini: {
    position: 'relative',
    width: '100%',
    height: '12%',
    backgroundColor: colors.primaryRed,
    alignItems: 'baseline',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingTop: 10,
  },
  title: {
    color: '#fff',
    fontSize: 40,
    padding: '10%',
    textAlign: 'left',
  },
  titleMini: {
    color: '#fff',
    fontSize: 30,
    paddingLeft: 15,
  },
  content: {
    position: 'relative',
    padding: '10%',
    width: '100%',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
    flexDirection: 'column',
  },
  listItem: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingLeft: 0,
    paddingTop: 10,
    paddingBottom: 10,
  },
  menuEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    justifyContent: 'center',
  },
  switchButton: {
    color: 'black',
    paddingBottom: '15',
  },
  logo: {
    position: 'absolute',
    top: 20,
    left: 190,
    width: 70,
    height: 70,
  },
});
