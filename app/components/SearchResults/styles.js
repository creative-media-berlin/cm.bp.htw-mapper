import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: '#f2f2f2',
    zIndex: 5,
    paddingTop: 75,
    paddingHorizontal: 7.5,
  },
  status: {
    padding: 10,
    textAlign: 'center',
  },
  result: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomName: {
    fontSize: 20,
  },
});

export const uiTheme = {
  card: {
    container: {
      height: 50,
      paddingHorizontal: 15,
    },
  },
};
