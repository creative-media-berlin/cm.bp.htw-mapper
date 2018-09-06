import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  superContainer: {
    marginTop: 0,
    marginLeft: 0,
    height: '100%',
    position: 'absolute',
  },

  container: {
    marginTop: 80,
    marginLeft: 15,
    position: 'absolute',
    height: '100%',
    zIndex: 1,
  },
  button: {
    marginBottom: 8,
    margin: 5,
  },

  popupDialog: {
    backgroundColor: 'rgba(255,255,255,0.0)',
    zIndex: 9,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  overlayButtonContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

export const overlayPos = [
  {
    position: 'absolute',
    top: 140,
    left: 140,
  },
  {
    position: 'absolute',
    top: 10,
    left: 140,

  },
  {
    position: 'absolute',
    top: 80,
    left: 250,

  },
  {
    position: 'absolute',
    top: 190,
    left: 250,

  },
  {
    position: 'absolute',
    top: 260,
    left: 140,

  },
  {
    position: 'absolute',
    top: 190,
    left: 30,

  },
  {
    position: 'absolute',
    top: 80,
    left: 30,

  },
];
