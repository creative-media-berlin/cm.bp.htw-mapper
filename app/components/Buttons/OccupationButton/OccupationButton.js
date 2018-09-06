import React from 'react';
import { AppRegistry } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';

// Local imports
import colors from '../../../config/colors';
import alertUser from '../../../utils/alert';

const OccupationButton = (props) => {
  if (props.buttonId !== 'md-hand') {
    return (
      <Icon.Button
        name={props.buttonId}
        color={colors.lightGrey}
        backgroundColor={colors.white}
        size={30}
        onPress={() => { alertUser('Raumbelegung', props.alert); }}
      />
    );
  }
  return (
    <Ionicon.Button
      name={props.buttonId}
      color={colors.lightGrey}
      backgroundColor={colors.white}
      size={30}
      onPress={() => { alertUser('Raumbelegung', props.alert); }}
    />
  );
};

OccupationButton.propTypes = {
  buttonId: PropTypes.string,
  alert: PropTypes.string,
};

export default OccupationButton;

AppRegistry.registerComponent('OccupationButton', () => OccupationButton);

