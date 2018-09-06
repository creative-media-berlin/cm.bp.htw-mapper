import { createSelector } from 'reselect';

const transitionSettingsSelector = (state) => {
  const { graph, activeGraph, minElevatorLevelDiff } = state.navigation;
  return {
    graph,
    activeGraph,
    minElevatorLevelDiff,
  };
};

export const getTransitionSettings = createSelector(
  transitionSettingsSelector,
  (transitionSettings) => (transitionSettings)
);
