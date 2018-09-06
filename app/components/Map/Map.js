import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, AppRegistry, Dimensions, View } from 'react-native';
import { connect } from 'react-redux';
import MapboxGL from '@mapbox/react-native-mapbox-gl';

import styles from './styles';
import { Compass } from '../Compass';
import { SelectedRoom } from '../SelectedRoom';
import { NavigationListener } from '../NavigationListener';
import { Path } from '../Path';
import { PathTransition } from '../PathTransition';
import { Position } from '../Position';
import { MAPBOX_TOKEN } from '../../config/credentials';
import { INITIAL_POSITION } from '../../consts/coordinates';
import { selectRoom, selectFloor } from '../../actions/selectionActions';
import { toggleMenu } from '../../actions/menuActions';
import FLOORS from '../../consts/floors';
import { roomsAreSame, isClickable, getRoomFromFeaturesAtPoint } from '../../utils/roomOperations';
import { getCenterCoordinate } from '../../selectors/centerSelector';
import { getStatusErrors } from '../../selectors/statusSelector';

MapboxGL.setAccessToken(MAPBOX_TOKEN);

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      followUser: false,
      compassAnim: new Animated.Value(0),
      mapHeading: 0,
      compassHeading: 0,
    };
    this.onPress = this.onPress.bind(this);
    this.onRegionDidChange = this.onRegionDidChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const centerCoordinate = this.props.lastCenterUpdate !== nextProps.lastCenterUpdate ?
      nextProps.position.coordinates : nextProps.nextCenter.coordinate;
    if (this.state.followUser & nextProps.positionUpdated) {
      this.map.flyTo(nextProps.position.coordinates);
    } else if (centerCoordinate) {
      if (!nextProps.nextCenter.isSelectedRoomCenter) {
        this.props.selectFloor(nextProps.position.floorLevel);
        if (nextProps.followUser) this.setState({ followUser: true });
      }
      this.map.flyTo(centerCoordinate);
    }
    if (nextProps.navigationGotInactive) this.setState({ followUser: false });
  }

  onRegionDidChange(map) {
    const { animated, heading, isUserInteraction } = map.properties;
    const rotate = (start, end) => ((end - start) + 180) % 360 - 180;
    const rotation = this.state.compassHeading + rotate(this.state.mapHeading, heading);
    Animated.timing(this.state.compassAnim, {
      toValue: rotation,
    }).start();
    this.setState({ compassHeading: rotation, mapHeading: heading });
    if (this.state.followUser && !animated && isUserInteraction) {
      this.setState({ followUser: false });
    }
  }

  async onPress(e) {
    if (this.props.isMenuActive) {
      this.props.toggleMenu();
    } else if (!this.props.navigationActive) {
      const { screenPointX, screenPointY } = e.properties;

      const featureCollection = await this.map.queryRenderedFeaturesAtPoint([
        screenPointX,
        screenPointY,
      ]);
      const closestFeature = getRoomFromFeaturesAtPoint(featureCollection);

      if (closestFeature && isClickable(closestFeature)) {
        if (roomsAreSame(this.props.selectedRoom, closestFeature)) {
          this.props.selectRoom(null);
        } else {
          this.props.selectRoom(closestFeature);
        }
      } else {
        this.props.selectRoom(null);
      }
    }
  }

  getCompassRotationStyle() {
    const spin = this.state.compassAnim.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg'],
    });
    return {
      display: this.state.compassHeading % 360 === 0 ? 'none' : 'flex',
      transform: [{ rotate: spin }],
    };
  }

  getMapHeight() {
    const { height } = Dimensions.get('window');
    const { gpsError, wifiError } = this.props;
    return height - ((gpsError + wifiError + 1) * 24);
  }

  render() {
    return (
      <View>
        <NavigationListener />
        <MapboxGL.MapView
          styleURL={this.props.selectedFloor ? this.props.selectedFloor.url : FLOORS[0].url}
          style={{ height: this.getMapHeight() }}
          centerCoordinate={INITIAL_POSITION}
          zoomLevel={17}
          compassEnabled={false}
          onPress={this.onPress}
          ref={(ref) => { this.map = ref; }}
          onRegionDidChange={this.onRegionDidChange}
          maxZoomLevel={19.99}
        >
          <Position position={this.props.position} selectedFloor={this.props.selectedFloor} />
          <SelectedRoom />
          <Path />
          <PathTransition />
        </MapboxGL.MapView>
        <Animated.View style={[this.getCompassRotationStyle(), styles.compassContainer]}>
          <Compass
            onPress={() => this.map.setCamera({
              heading: 0,
              duration: 1000,
            })}
          />
        </Animated.View>
      </View>
    );
  }
}

Map.propTypes = {
  position: PropTypes.object,
  lastCenterUpdate: PropTypes.number,
  selectedFloor: PropTypes.object,
  selectRoom: PropTypes.func,
  selectFloor: PropTypes.func,
  selectedRoom: PropTypes.object,
  building: PropTypes.string,
  navigationActive: PropTypes.bool,
  toggleMenu: PropTypes.func,
  isMenuActive: PropTypes.bool,
  path: PropTypes.array,
  navigationGotInactive: PropTypes.bool,
  positionUpdated: PropTypes.bool,
  gpsError: PropTypes.bool,
  wifiError: PropTypes.bool,
  nextCenter: PropTypes.shape({
    coordinate: PropTypes.array,
    isSelectedRoomCenter: PropTypes.bool,
  }),
  followUser: PropTypes.bool,
};

const mapDispatchToProps = dispatch => ({
  selectRoom: room => dispatch(selectRoom(room)),
  selectFloor: floor => dispatch(selectFloor(floor)),
  toggleMenu: () => dispatch(toggleMenu()),
});

const mapStateToProps = state => ({
  position: state.position,
  building: state.position.building,
  selectedFloor: state.selection.floor,
  navigationActive: state.navigation.navigationActive,
  selectedRoom: state.selection.room,
  isMenuActive: state.menu.isMenuActive,
  path: state.navigation.path,
  ...getCenterCoordinate(state),
  ...getStatusErrors(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);

AppRegistry.registerComponent('Map', () => Map);
