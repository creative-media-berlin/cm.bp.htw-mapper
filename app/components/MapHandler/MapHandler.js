import React, { Component } from 'react';
import {
  AppRegistry, AppState,
  DeviceEventEmitter, View,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Map } from '../Map';
import { DetailPopupAnimationHandler } from '../DetailPopupAnimationHandler';
import { FloorButtonList } from '../FloorButtonList';
import inBuilding from '../../utils/inBuilding';
import { selectFloor } from '../../actions/selectionActions';
import { updatePosition, enterBuilding, exitBuilding } from '../../actions/positionActions';
import { updateGpsStatus } from '../../actions/statusActions';

class MapHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      positioningActive: false,
      gpsError: false,
      lastCenterUpdate: Date.now(),
      intervalId: null,
    };
    this.getCurrentPosition = this.getCurrentPosition.bind(this);
    this.positionMe = this.positionMe.bind(this);
  }

  componentDidMount() {
    this.addListeners();
    AppState.addEventListener('change', this.onAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.onAppStateChange);
  }

  onAppStateChange = (nextState) => {
    if (nextState === 'active') this.addListeners();
    else if (nextState === 'background') this.removeListeners();
  }

  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!this.props.gps) this.props.updateGpsStatus(true);
        this.setState({ gpsError: false });
        if (this.state.positioningActive) {
          const position = [pos.coords.longitude, pos.coords.latitude];
          const building = inBuilding(position);
          if (!building) {
            this.props.updatePosition(position, 0);
          }
          if (!building && this.props.building) {
            this.props.selectFloor(0);
            this.props.exitBuilding();
          } else if (building && !this.props.building) {
            this.props.enterBuilding(building);
          }
        }
      },
      (err) => {
        if (this.props.gps) this.props.updateGpsStatus(false);
        if (!this.state.gpsError) console.log(err);
        this.setState({ gpsError: true });
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    );
  }

  addListeners() {
    const intervalId = setInterval(this.getCurrentPosition, 1000);
    this.setState({ intervalId });

    DeviceEventEmitter.addListener('onStatusChanged', (e) => {
      // 0 : Out of Service, 1: Temporarily Unavailable
      // 2: Available, 10: Limited, 11: Calibration Changed
      console.log(`Status: ${e.status}`);
    });
    DeviceEventEmitter.addListener('onLocationChanged', (e) => {
      console.log(e);
      if (this.state.positioningActive && (this.props.building || this.state.gpsError)) {
        // e contains the passed params as properties
        const position = [e.longitude, e.latitude];
        this.props.updatePosition(position, e.floorLevel);
      }
    });
  }

  removeListeners() {
    clearInterval(this.state.intervalId);
    DeviceEventEmitter.removeListener('onStatusChanged');
    DeviceEventEmitter.removeListener('onLocationChanged');
  }

  positionMe() {
    if (!this.state.positioningActive) {
      this.setState({
        positioningActive: true,
        lastCenterUpdate: Date.now(),
      });
    } else {
      this.setState({ lastCenterUpdate: Date.now() });
    }
  }

  render() {
    return (
      <View>
        <Map lastCenterUpdate={this.state.lastCenterUpdate} />
        <DetailPopupAnimationHandler positionMe={this.positionMe} />
        <FloorButtonList />
      </View>
    );
  }
}

MapHandler.propTypes = {
  building: PropTypes.string,
  enterBuilding: PropTypes.func,
  exitBuilding: PropTypes.func,
  updatePosition: PropTypes.func,
  updateGpsStatus: PropTypes.func,
  gps: PropTypes.bool,
  selectFloor: PropTypes.func,
};

const mapStateToProps = (state) => ({
  building: state.position.building,
  gps: state.status.gps,
});

const mapDispatchToProps = dispatch => ({
  enterBuilding: building => dispatch(enterBuilding(building)),
  exitBuilding: () => dispatch(exitBuilding()),
  updatePosition: (coords, floor) => dispatch(updatePosition(coords, floor)),
  selectFloor: floor => dispatch(selectFloor(floor)),
  updateGpsStatus: status => dispatch(updateGpsStatus(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MapHandler);

AppRegistry.registerComponent('MapHandler', () => MapHandler);
