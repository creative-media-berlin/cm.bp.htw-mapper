import React from 'react';
import PropTypes from 'prop-types';
import { AppRegistry, Image, TouchableOpacity } from 'react-native';

import Logo from '../../assets/images/logo.png';
import styles from './styles';

const Compass = props => (
  <TouchableOpacity onPress={() => props.onPress()} >
    <Image source={Logo} style={styles.compass} />
  </TouchableOpacity>
);

Compass.propTypes = {
  onPress: PropTypes.func,
};

export default Compass;

AppRegistry.registerComponent('Compass', () => Compass);
