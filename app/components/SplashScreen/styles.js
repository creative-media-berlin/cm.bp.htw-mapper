import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compassContainer: {
    position: 'absolute',
    top: 85,
    right: 15,
  },
  compass: {
    height: 40,
    width: 40,
  },
});
