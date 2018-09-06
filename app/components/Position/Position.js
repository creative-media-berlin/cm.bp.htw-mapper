import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AppRegistry } from 'react-native';
import { PulseIndicator } from 'react-native-indicators';
import MapboxGL from '@mapbox/react-native-mapbox-gl';

import Interpolate from '../../utils/Interpolate';

class Position extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPoint: null,
      currentPosition: null,
      interpolation: null,
      interpolatedPosition: null,
    };
    this.interpolation = new Interpolate();
  }

  componentDidMount() {
    this.onStart();
  }

  componentWillReceiveProps() {
    this.setState({ currentPosition: this.props.position.coordinates });
    if (this.props.position.coordinates) {
      this.interpolation.updateCurrentPosition(this.props.position.coordinates);
    }

    if (this.state.currentPosition && this.state.interpolatedPosition == null) {
      this.setState({ currentPoint: this.state.currentPosition });
    }
  }

  onStart() {
    this.interpolation.addListener((interpolatedPosition) => this.setState({ interpolatedPosition }));
    this.interpolation.start();
  }

  render() {
    const positionOnFloor = this.props.position.floorLevel === this.props.selectedFloor.floorLevel;
    if (this.state.interpolatedPosition && positionOnFloor) {
      return (
        <MapboxGL.PointAnnotation
          id="position"
          coordinate={this.state.interpolatedPosition}
        >
          <PulseIndicator color="#4386F5" size={25} />
        </MapboxGL.PointAnnotation>
      );
    }
    return null;
  }

}

Position.propTypes = {
  position: PropTypes.object,
  selectedFloor: PropTypes.object,
};

export default Position;
AppRegistry.registerComponent('Position', () => Position);
