import React from 'react';
import { AppRegistry, Text, View, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import colors from '../../config/colors';
import styles from './styles';
import { getRoomTypeText } from '../../utils/roomOperations';
import { toggleNavigation } from '../../actions/navigationActions';

const DetailPopupUpperSection = props => {
  if (!props.selectedRoom) {
    return null;
  }

  const getTitle = () => {
    const { building, name, type } = props.selectedRoom.properties;
    if (!building || !name) return '';
    if (type && type.startsWith('wc')) return 'Toilette';
    // room name is number ? add building to name
    return parseInt(name, 10) ? building.toUpperCase() + name : name;
  };

  const distance = props.distance && props.navigationActive ? `${props.distance} m` : '';
  const time = props.estimatedTime && props.navigationActive ? props.estimatedTime : '';
  const getSelectedBuilding = () => {
    if (props.selectedRoom.properties.building) {
      const building = props.selectedRoom.properties.building.toUpperCase();
      return `Gebäude ${building}`;
    }
    return '';
  };

  const navigate = () => {
    if (props.selectedRoom) {
      props.toggleNavigation();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => props.popupTrigger()}>
      <View>
        <View style={styles.invisibleContainer} />
        <View style={styles.redContainer}>
          <View style={styles.navigationButton}>
            <Icon.Button
              name={props.navigationActive ? 'close' : 'directions'}
              borderRadius={50}
              backgroundColor={colors.darkRed}
              size={50}
              iconStyle={styles.navigationButtonInnerClass}
              onPress={() => navigate()}
            />
          </View>
          <View style={styles.redRow}>
            <Text style={styles.poiTitle}>{getTitle()}</Text>
          </View>
          <View style={styles.redRow}>
            <Text style={styles.item}>{getRoomTypeText(props.selectedRoom)}</Text>
            <Text style={styles.item}>{distance}</Text>
          </View>
          <View style={styles.redRow}>
            <Text style={styles.item}>{getSelectedBuilding()}</Text>
            <Text style={[styles.item, styles.bottomSpacer]}>{time}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

DetailPopupUpperSection.propTypes = {
  selectedRoom: PropTypes.object,
  toggleNavigation: PropTypes.func,
  estimatedTime: PropTypes.string,
  distance: PropTypes.number,
  navigationActive: PropTypes.bool,
  popupTrigger: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  toggleNavigation: () => dispatch(toggleNavigation()),
});

const mapStateToProps = state => ({
  estimatedTime: state.navigation.estimatedTime,
  distance: state.navigation.totalDistanceInMeters,
  navigationActive: state.navigation.navigationActive,
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailPopupUpperSection);

AppRegistry.registerComponent('DetailPopupUpperSection', () => DetailPopupUpperSection);
