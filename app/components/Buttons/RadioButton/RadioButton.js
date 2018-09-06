import React from 'react';
import { AppRegistry, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

const RadioButton = (props) => {
  return (
    <View style={styles.radioButtonWrapper}>
      <View style={styles.radioButtonOff}>
        {props.isSelected ? (
          <View style={styles.radioButtonOn} />
        ) : null}
      </View>
      <Text style={styles.radioButtonLabel}> {props.label} </Text>
    </View>
  );
};

RadioButton.propTypes = {
  isSelected: PropTypes.bool,
  label: PropTypes.string,
};

export default RadioButton;

AppRegistry.registerComponent('RadioButton', () => RadioButton);

