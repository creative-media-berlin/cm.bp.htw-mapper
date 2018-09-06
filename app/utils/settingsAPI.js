import { AsyncStorage } from 'react-native';
import * as floorChangeModes from '../consts/modeTypes';

const DEFAULT_MODE = floorChangeModes.STANDARD;
const DEFAULT_LEVEL_DIFF = 4;

export const setFloorChangeMode = async (mode = DEFAULT_MODE) => {
  try {
    await AsyncStorage.setItem(
      '@HTWMapperCache:floorChangeMode',
      JSON.stringify(mode)
    );
  } catch (error) {
    console.error(error);
  }
};

export const getFloorChangeMode = async () => {
  try {
    const value = await AsyncStorage.getItem('@HTWMapperCache:floorChangeMode');
    if (value) {
      return JSON.parse(value);
    }
    await setFloorChangeMode();
    return DEFAULT_MODE;
  } catch (error) {
    console.error(error);
    return DEFAULT_MODE;
  }
};

export const setMinElevatorLevelDiff = async (level = DEFAULT_LEVEL_DIFF) => {
  try {
    await AsyncStorage.setItem(
      '@HTWMapperCache:minElevatorLevelDiff',
      String(level)
    );
  } catch (error) {
    console.error(error);
  }
};

export const getMinElevatorLevelDiff = async () => {
  try {
    const value = await AsyncStorage.getItem('@HTWMapperCache:minElevatorLevelDiff');
    if (value) {
      return +value;
    }
    await setMinElevatorLevelDiff();
    return DEFAULT_LEVEL_DIFF;
  } catch (error) {
    console.error(error);
    return DEFAULT_LEVEL_DIFF;
  }
};
