import React, { Component } from 'react';
import { AppRegistry, View, Animated } from 'react-native';
import { connect } from 'react-redux';
import { swipeDirections } from 'react-native-swipe-gestures';
import PropTypes from 'prop-types';

import { RoundButton } from '../Buttons/RoundButton';
import { DetailPopup } from '../DetailPopup';
import styles, { popupStates, locateMeStyle } from './styles';
import { getDetailPopupState } from '../../selectors/detailPopupSelector';
import { selectRoom } from '../../actions/selectionActions';

class DetailPopupAnimationHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popup: popupStates.hidden,
      bounceValue: new Animated.Value(popupStates.hidden),
    };
    this.toggleDetailPopupOnClick = this.toggleDetailPopupOnClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.forcePopupState) {
      this.changePopupState(nextProps.forcePopupState);
    }
  }

  onSwipe(gestureName) {
    const { SWIPE_UP, SWIPE_DOWN } = swipeDirections;
    switch (gestureName) {
      case SWIPE_UP:
        this.changePopupState(popupStates.full); break;
      case SWIPE_DOWN:
        this.changePopupState(popupStates.medium); break;
      default: break;
    }
  }

  toggleDetailPopupOnClick() {
    if (this.state.popup === popupStates.medium) {
      this.onSwipe('SWIPE_UP');
    } else if (this.state.popup === popupStates.full) {
      this.onSwipe('SWIPE_DOWN');
    }
  }


  changePopupState(state) {
    this.setState({ popup: state });
    Animated.spring(this.state.bounceValue, {
      toValue: state,
      velocity: 3,
      tension: 2,
      friction: 8,
    }).start();
  }

  render() {
    const positionMeStyles = [
      styles.positionMe,
      { transform: [{ translateY: this.state.bounceValue }] },
    ];
    return (
      <View>
        <Animated.View style={positionMeStyles}>
          <RoundButton
            icon="my-location"
            size={50}
            style={locateMeStyle}
            onPress={() => this.props.positionMe()}
          />
        </Animated.View>
        <DetailPopup
          velocityThreshold={0.1}
          onSwipe={direction => this.onSwipe(direction)}
          bounceValue={this.state.bounceValue}
          popupTrigger={this.toggleDetailPopupOnClick}
        />
      </View>
    );
  }
}

DetailPopupAnimationHandler.propTypes = {
  forcePopupState: PropTypes.number,
  positionMe: PropTypes.func,
  selectedRoom: PropTypes.object,
  selectRoom: PropTypes.func,
};

const mapStateToProps = (state, props) => {
  return {
    selectedRoom: state.selection.room,
    ...getDetailPopupState(state, props),
  };
};

const mapDispatchToProps = dispatch => ({
  selectRoom: room => dispatch(selectRoom(room)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailPopupAnimationHandler);

AppRegistry.registerComponent('DetailPopupAnimationHandler', () => DetailPopupAnimationHandler);
