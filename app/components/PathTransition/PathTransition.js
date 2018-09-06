import React from 'react';
import { AppRegistry, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import centroid from '@turf/centroid/index';
import Icon from 'react-native-vector-icons/Entypo';
import colors from '../../config/colors';
import 'core-js/es6/symbol';
import 'core-js/fn/symbol/iterator';

import { inTransitionRoom } from '../../utils/inTransitionRoom';
import styles, { roomStyle } from './styles';

const PathTransition = (props) => {
  const rooms = props.rooms ? props.rooms.filter(room => +room.properties.floor === props.selectedFloor) : null;

  if (!props.path || !props.navigationActive || !props.selectedRoom || !rooms || props.path[props.selectedFloor].length === 0) {
    return (null);
  }
  const path = props.path[props.selectedFloor];

  const transitionInfo = props.transitionInfo[props.selectedFloor];
  const selectedRooms = [];

  const selectionStyle = MapboxGL.StyleSheet.create(roomStyle);

  for (const [transitionIndex, subpath] of path.entries()) {
    const position = subpath[subpath.length - 1];
    for (const room of rooms) {
      if (inTransitionRoom(position, room)) {
        const roomId = room.properties.building + room.properties.name;
        selectedRooms.push(
          <MapboxGL.Animated.ShapeSource key={`shape_${roomId}`} id={`pathTransitionSource${roomId}`} shape={room}>
            <MapboxGL.Animated.FillLayer id={`pathTransitionSource${roomId}`} style={selectionStyle} />
          </MapboxGL.Animated.ShapeSource>
        );
        const floorTransitionInfo = transitionInfo[transitionIndex];
        if (floorTransitionInfo) {
          const goToFloorString = floorTransitionInfo.goToFloorString;
          const transition = floorTransitionInfo.transition;
          const center = centroid(room);
          let arrowIcon = '';
          if (transition > 0) {
            arrowIcon = 'arrow-up';
          } else {
            arrowIcon = 'arrow-down';
          }
          const transitionId = floorTransitionInfo.transitionName;
          selectedRooms.push(
            <MapboxGL.PointAnnotation
              key={`annotation_${transitionId}`}
              id={transitionId}
              title={'test'}
              snippet={'snippet_test'}
              coordinate={center.geometry.coordinates}
            >
              <View style={styles.circle}>
                <Icon name={arrowIcon} color={colors.white} size={9} />
                <Text style={styles.transitionText}>{goToFloorString}.</Text>
              </View>
            </MapboxGL.PointAnnotation>
          );
        }
      }
    }
  }

  return (selectedRooms !== undefined ? selectedRooms : null);
};

PathTransition.propTypes = {
  rooms: PropTypes.array,
  path: PropTypes.array,
  selectedFloor: PropTypes.number,
  selectedRoom: PropTypes.object,
  navigationActive: PropTypes.bool,
  transitionInfo: PropTypes.array,
};

const mapStateToProps = state => ({
  rooms: state.features.rooms,
  path: state.navigation.path,
  selectedFloor: state.selection.floor.floorLevel,
  selectedRoom: state.selection.room,
  navigationActive: state.navigation.navigationActive,
  transitionInfo: state.navigation.transitionInfo,
});

export default connect(mapStateToProps, null)(PathTransition);

AppRegistry.registerComponent('PathTransition', () => PathTransition);
