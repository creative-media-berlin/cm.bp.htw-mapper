import React from 'react';
import { AppRegistry } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MapboxGL from '@mapbox/react-native-mapbox-gl';

import styles from './styles';

const SelectedRoom = (props) => {
  if (!props.selectedRoom || props.selectedFloor !== +props.selectedRoom.properties.floor) {
    return (null);
  }

  const selectionStyle = MapboxGL.StyleSheet.create(styles.room);

  return (
    <MapboxGL.Animated.ShapeSource id="source" shape={props.selectedRoom}>
      <MapboxGL.Animated.FillLayer id="fill" style={selectionStyle} />
    </MapboxGL.Animated.ShapeSource>
  );
};

SelectedRoom.propTypes = {
  selectedFloor: PropTypes.number,
  selectedRoom: PropTypes.object,
};

const mapStateToProps = state => ({
  selectedFloor: state.selection.floor.floorLevel,
  selectedRoom: state.selection.room,
});

export default connect(mapStateToProps, null)(SelectedRoom);

AppRegistry.registerComponent('SelectedRoom', () => SelectedRoom);
