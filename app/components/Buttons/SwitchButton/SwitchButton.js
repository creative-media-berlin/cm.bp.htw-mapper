import colors from '../../../config/colors';
import React from 'react';
import {
  AppRegistry,
  View,
  Switch,
  Text,
} from 'react-native';
import styles from './styles';
import PropTypes from 'prop-types';

const SwitchButton = (props) => (
  <View style={styles.container}>
    <Switch
      style={styles.switchButton}
      onValueChange={() => props.onChange()}
      value={props.value}
      onTintColor={colors.primaryRed}
      tintColor={colors.lightGrey}
    />
    <Text style={styles.text}> {props.text} </Text>
  </View>
);

SwitchButton.propTypes = {
  text: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
};

export default SwitchButton;

AppRegistry.registerComponent('SwitchButton', () => SwitchButton);
