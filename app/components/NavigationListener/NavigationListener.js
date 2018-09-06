import { Component } from 'react';
import PropTypes from 'prop-types';
import { AppRegistry } from 'react-native';
import { connect } from 'react-redux';

import { WH_TRAM } from '../../consts/coordinates';
import { getPath, orderPathByFloor, getGraphs } from '../../utils/pathfinder';
import { getFloorTransitionInfo } from '../../utils/transitionInfo';
import { getPointFeaturesForPathfinding } from '../../utils/nearestFeatures';
import { updateGraph, updatePath, deactivateNavigation } from '../../actions/navigationActions';
import { getDistance, getEstimatedTime } from '../../utils/eta';
import calculateDistance from '../../utils/distance';
import { getTransitionSettings } from '../../selectors/transitionSelector';

/*
* This component is a renderless component,
* a listener to update the redux store with the current route/ path.
* */

class NavigationListener extends Component {
  componentWillReceiveProps(nextProps) {
    const isNewTarget = nextProps.selectedRoom && (nextProps.previousTarget !== nextProps.selectedRoom);
    const navigationGetsActive = !this.props.navigationActive && nextProps.navigationActive;
    const newFeatures = !this.props.featureLines && nextProps.featureLines;
    if (newFeatures) {
      this.props.updateGraph(getGraphs(nextProps.featureLines));
    }
    if (navigationGetsActive) {
      this.activateNewNavigation(nextProps.position, nextProps.selectedRoom);
    } else if (nextProps.navigationActive && isNewTarget) {
      this.props.deactivateNavigation();
    }
  }

  updatePathInformation(path, previousTarget) {
    if (!path) {
      this.props.deactivateNavigation();
    } else {
      const totalDistanceInMeters = getDistance(path);
      const eta = getEstimatedTime(path, totalDistanceInMeters);
      const formattedTime = eta < 60 ? `${Math.round(eta)} s` : `${Math.round(eta / 60)} min`;
      const pathArray = orderPathByFloor(path);
      const transitionInfo = getFloorTransitionInfo(path, this.props.rooms);
      this.props.updatePath({
        path: pathArray,
        previousTarget,
        totalDistanceInMeters,
        estimatedTime: formattedTime,
        transitionInfo,
      });
    }
  }

  activateNewNavigation(position, room) {
    const path = this.generatePath(position, room);
    this.updatePathInformation(path, room);
  }

  generatePath(position, room) {
    const MAX_HTW_DISTANCE = 500; // in meters
    if (!this.props.featureLines || !this.props.featurePoints) {
      alert('Sorry, we did not receive required map data for your navigation. Check your internet connection.');
      this.props.deactivateNavigation();
      return null;
    }
    const pathfindingPoints = getPointFeaturesForPathfinding(this.props.featurePoints, position, room); // finds all path points in user's floor
    if (!pathfindingPoints) {
      alert('Sorry, we could not match your position or target with the given map data.');
      this.props.deactivateNavigation();
      return null;
    }
    const distanceToStartPoint = calculateDistance(
      position.coordinates, pathfindingPoints.startPoint
    );
    const startPoint = distanceToStartPoint < MAX_HTW_DISTANCE ?
      pathfindingPoints.startPoint :
      [...WH_TRAM, 0];
    const finishPoint = pathfindingPoints.finishPoint;
    const path = getPath(this.props.transitionSettings, startPoint, finishPoint);
    if (!path) {
      alert('Sorry, there is no path available.');
      this.props.deactivateNavigation();
      return null;
    }
    return path;
  }

  render() {
    return null;
  }
}

NavigationListener.propTypes = {
  position: PropTypes.object,
  featureLines: PropTypes.object,
  featurePoints: PropTypes.array,
  selectedRoom: PropTypes.object,
  navigationActive: PropTypes.bool,
  deactivateNavigation: PropTypes.func,
  previousTarget: PropTypes.object,
  updateGraph: PropTypes.func,
  transitionSettings: PropTypes.object,
  updatePath: PropTypes.func,
  rooms: PropTypes.array,
};

const mapDispatchToProps = dispatch => ({
  updateGraph: graph => dispatch(updateGraph(graph)),
  updatePath: (path, previousTarget) => dispatch(updatePath(path, previousTarget)),
  deactivateNavigation: () => dispatch(deactivateNavigation()),
});

const mapStateToProps = state => ({
  featureLines: state.features.featureLines,
  featurePoints: state.features.featurePoints,
  position: state.position,
  selectedRoom: state.selection.room,
  transitionSettings: getTransitionSettings(state),
  navigationActive: state.navigation.navigationActive,
  previousTarget: state.navigation.previousTarget,
  rooms: state.features.rooms,
});

export default connect(mapStateToProps, mapDispatchToProps)(NavigationListener);

AppRegistry.registerComponent('NavigationListener', () => NavigationListener);
