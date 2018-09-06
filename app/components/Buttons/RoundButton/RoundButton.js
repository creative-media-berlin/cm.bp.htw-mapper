import React from 'react';
import { AppRegistry, Text, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { ActionButton, ThemeProvider } from 'react-native-material-ui';

import colors from '../../../config/colors';
import uiTheme from './styles';

const RoundButton = (props) => {
  const size = props.size ? props.size : 50;
  const background = props.marked ? colors.primaryRed : colors.white;
  const color = props.marked ? colors.white : colors.primaryGrey;

  const icon = props.text ? (
    <Text style={{ color }}>{props.text}</Text>
  ) : props.icon;

  const buttonStyle = {
    container: {
      height: size,
      width: size,
      backgroundColor: background,
      borderRadius: 100,
    },
    icon: {
      color,
    },
  };

  return (
    <View style={props.style || {}}>
      <ThemeProvider uiTheme={uiTheme}>
        <ActionButton
          icon={icon} style={buttonStyle}
          onPress={props.onPress ? () => props.onPress() : () => {}}
        />
      </ThemeProvider>
    </View>
  );
};

RoundButton.propTypes = {
  icon: PropTypes.string,
  marked: PropTypes.bool,
  onPress: PropTypes.func,
  size: PropTypes.number,
  text: PropTypes.string,
  style: ViewPropTypes.style,
};

export default RoundButton;

AppRegistry.registerComponent('RoundButton', () => RoundButton);
