import React from 'react';
import PropTypes from 'prop-types';
import { AppRegistry } from 'react-native';
import { connect } from 'react-redux';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import { lineString as makeLineString } from '@turf/helpers';

import styles from './styles';

const Path = (props) => {
  if (!props.path || !props.navigationActive || props.path[props.selectedFloor].length === 0) {
    return null;
  }
  const pathStyles = MapboxGL.StyleSheet.create(styles.path);
  const pathElements = [];
  props.path[props.selectedFloor].forEach((subpath, index) => {
    if (subpath.length > 1) {
      pathElements.push(
        <MapboxGL.ShapeSource key={index} id={`pathSource${index}`} shape={makeLineString(subpath)}>
          <MapboxGL.LineLayer id={`pathSource${index}`} style={pathStyles} />
        </MapboxGL.ShapeSource>
      );
    }
  });
  return (pathElements !== undefined ? pathElements : null);
};

Path.propTypes = {
  path: PropTypes.array,
  selectedFloor: PropTypes.number,
  navigationActive: PropTypes.bool,
};

const mapStateToProps = state => ({
  path: state.navigation.path,
  selectedFloor: state.selection.floor.floorLevel,
  navigationActive: state.navigation.navigationActive,
});

export default connect(mapStateToProps)(Path);

AppRegistry.registerComponent('Path', () => Path);
