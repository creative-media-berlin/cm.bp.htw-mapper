import React from 'react';
import { AppRegistry, Picker, View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from './styles';
import * as floorChangeModes from '../../../consts/modeTypes';
import { setMode, setMinElevatorLevelDiff } from '../../../actions/navigationActions';
import * as settings from '../../../utils/settingsAPI';
import { RadioButton } from '../../Buttons/RadioButton';

const Settings = (props) => {
  const selectFloorChangeMode = (value) => {
    switch (value) {
      case 'standard':
        props.setFloorChangeMode(floorChangeModes.STANDARD);
        settings.setFloorChangeMode(floorChangeModes.STANDARD);
        break;
      case 'stairs':
        props.setFloorChangeMode(floorChangeModes.STAIRS_ONLY);
        settings.setFloorChangeMode(floorChangeModes.STAIRS_ONLY);
        break;
      case 'elevators':
        props.setFloorChangeMode(floorChangeModes.ELEVATORS_ONLY);
        settings.setFloorChangeMode(floorChangeModes.ELEVATORS_ONLY);
        break;
      default:
        break;
    }
  };

  const selectMinFloorLevel = (level) => {
    props.setMinFloorLevel(level);
    settings.setMinElevatorLevelDiff(level);
  };

  const isSelected = (mode) => (
    mode.name === props.floorChangeMode.name
  );

  const standard = isSelected(floorChangeModes.STANDARD);
  const stairsOnly = isSelected(floorChangeModes.STAIRS_ONLY);
  const elevatorsOnly = isSelected(floorChangeModes.ELEVATORS_ONLY);
  const floorLevelChoices = [];
  for (let i = 1; i < 6; i++) {
    floorLevelChoices.push(
      <Picker.Item key={i} label={String(i)} value={i} />
    );
  }

  return (
    <View style={styles.content}>
      <Text style={styles.labelCategory}> Etagen Übergänge </Text>
      <View style={styles.radioButtonView}>
        <TouchableOpacity
          onPress={() => selectFloorChangeMode('standard')}
          style={styles.radioButtonView}
        >
          <RadioButton isSelected={standard} label="Standard" />
        </TouchableOpacity>
      </View>
      <View style={styles.dropdownView}>
        <Text style={styles.labelSubheading}> Aufzug verwenden ab Etage </Text>
        <View style={{ width: 150, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
          <Picker
            selectedValue={props.minFloorLevel}
            onValueChange={(level) => selectMinFloorLevel(level)}
            enabled={standard}
            mode="dropdown"
          >
            {floorLevelChoices}
          </Picker>
        </View>
      </View>
      <View style={styles.radioButtonView}>
        <TouchableOpacity
          onPress={() => selectFloorChangeMode('stairs')}
          style={styles.radioButtonView}
        >
          <RadioButton
            isSelected={stairsOnly}
            label="Nur Treppen"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.radioButtonView}>
        <TouchableOpacity
          onPress={() => selectFloorChangeMode('elevators')}
          style={styles.radioButtonView}
        >
          <RadioButton
            isSelected={elevatorsOnly}
            label="Nur Aufzüge"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

Settings.propTypes = {
  floorChangeMode: PropTypes.object,
  setFloorChangeMode: PropTypes.func,
  minFloorLevel: PropTypes.number,
  setMinFloorLevel: PropTypes.func,
};

const mapStateToProps = state => ({
  floorChangeMode: state.navigation.activeGraph,
  minFloorLevel: state.navigation.minElevatorLevelDiff,
});

const mapDispatchToProps = dispatch => ({
  setFloorChangeMode: mode => dispatch(setMode(mode)),
  setMinFloorLevel: level => dispatch(setMinElevatorLevelDiff(level)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

AppRegistry.registerComponent('Settings', () => Settings);
