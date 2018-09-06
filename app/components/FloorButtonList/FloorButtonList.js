import React from 'react';
import { AppRegistry, View } from 'react-native';
import { connect } from 'react-redux';
import PopupDialog, { FadeAnimation } from 'react-native-popup-dialog';
import PropTypes from 'prop-types';

import { RoundButton } from '../Buttons/RoundButton';
import styles, { overlayPos } from './styles';
import { selectFloor } from '../../actions/selectionActions';
import FLOORS from '../../consts/floors';


const FloorButtonList = props => {
  if (!props.selectedFloor) {
    props.selectFloor(0);
    return null;
  }

  const readFloors = (startIndex, endIndex) => {
    const surroundingFloors = [];
    for (let i = startIndex; i >= endIndex; i--) {
      surroundingFloors.push(FLOORS[i]);
    }
    return surroundingFloors;
  };

  const getSurroundingFloors = () => {
    const floorId = FLOORS.findIndex(
      floor => floor.floorLevel === props.selectedFloor.floorLevel
    );
    if (FLOORS[floorId + 1] && FLOORS[floorId - 1]) {
      return readFloors(floorId + 1, floorId - 1);
    } else if (FLOORS[floorId + 2]) {
      return readFloors(floorId + 2, floorId);
    }
    return readFloors(floorId, floorId - 2);
  };

  const surroundingFloors = getSurroundingFloors();

  const floorsMenuButton =
    FLOORS.length > 3 ? (
      <RoundButton
        style={styles.button}
        icon="layers"
        size={40}
        onPress={() => {
          this.popupDialog.show();
        }}
      />
    ) : null;

  const fadeAnimation = new FadeAnimation({
    animationDuration: 250,
  });

  const setPos = (floorLevel) => {
    return overlayPos[floorLevel];
  };

  return (
    <View style={styles.superContainer}>
      <View style={styles.container}>
        {floorsMenuButton}
        {surroundingFloors.map((floor, idx) => (
          <RoundButton
            style={styles.button}
            size={40}
            key={idx}
            text={floor.name}
            onPress={() => props.selectFloor(floor.floorLevel)}
            marked={floor.floorLevel === props.selectedFloor.floorLevel}
          />
        ))}
      </View>
      <PopupDialog
        ref={popupDialog => { this.popupDialog = popupDialog; }}
        dialogAnimation={fadeAnimation}
        haveOverlay
        dialogStyle={styles.popupDialog}
        height={350}
        overlayOpacity={0.8}
      >
        <View style={styles.overlayButtonContainer}>
          {FLOORS.map((floor, idx) => {
            return (
              <RoundButton
                style={setPos(floor.floorLevel)}
                size={60}
                key={idx}
                text={floor.name}
                onPress={() => props.selectFloor(floor.floorLevel) && this.popupDialog.dismiss()}
                marked={floor.floorLevel === props.selectedFloor.floorLevel}
              />
           );
          })}
        </View>
      </PopupDialog>
    </View>
  );
};

FloorButtonList.propTypes = {
  selectedFloor: PropTypes.object,
  selectFloor: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  selectFloor: floor => dispatch(selectFloor(floor)),
});

const mapStateToProps = state => ({
  selectedFloor: state.selection.floor,
});

export default connect(mapStateToProps, mapDispatchToProps)(FloorButtonList);

AppRegistry.registerComponent('FloorButtonList', () => FloorButtonList);
