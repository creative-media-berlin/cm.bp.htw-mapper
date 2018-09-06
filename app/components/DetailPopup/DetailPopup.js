import React, { Component } from 'react';
import { AppRegistry, View, Animated } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GestureRecognizer from 'react-native-swipe-gestures';

import { DetailPopupUpperSection } from '../DetailPopupUpperSection';
import { DetailPopupLowerSection } from '../DetailPopupLowerSection';
import { LSF_OCCUPATION_URL } from '../../config/urls';
import styles from './styles';
import { isFavorite, toggleFavoriteAttribute } from '../../utils/favoritesAPI';

class DetailPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomOccupied: null,
      fetchingOccupation: false,
      isFavorite: false,
    };
    this.toggleFavorite = this.toggleFavorite.bind(this);
  }

  async componentWillReceiveProps(nextProps) {
    if (this.props.selectedRoom !== nextProps.selectedRoom) {
      const favorite = await isFavorite(nextProps.selectedRoom);
      this.setState({ isFavorite: favorite });
      const { building, name } = nextProps.selectedRoom ? nextProps.selectedRoom.properties : '';
      this.setState({ fetchingOccupation: true });
      const res = await fetch(`${LSF_OCCUPATION_URL}/?room=${building}${name}`);
      const body = await res.json();
      this.setState({
        roomOccupied: body.occupied,
        fetchingOccupation: false,
      });
    }
  }

  async toggleFavorite(room) {
    await toggleFavoriteAttribute(room);
    const favorite = await isFavorite(room);
    this.setState({ isFavorite: favorite });
  }

  render() {
    return (
      <GestureRecognizer onSwipe={direction => this.props.onSwipe(direction)}>
        <Animated.View
          style={[
            styles.detailView,
            { transform: [{ translateY: this.props.bounceValue }] },
          ]}
        >
          <View>
            <DetailPopupUpperSection
              selectedRoom={this.props.selectedRoom}
              popupTrigger={this.props.popupTrigger}
            />
            <DetailPopupLowerSection
              occupied={this.state.roomOccupied}
              loading={this.state.fetchingOccupation}
              selectedRoom={this.props.selectedRoom}
              isFavorite={this.state.isFavorite}
              toggleFavorite={this.toggleFavorite}
            />
          </View>
        </Animated.View>
      </GestureRecognizer>
    );
  }
}

DetailPopup.propTypes = {
  bounceValue: PropTypes.object,
  onSwipe: PropTypes.func,
  selectedRoom: PropTypes.object,
  popupTrigger: PropTypes.func,
};

const mapStateToProps = state => ({
  selectedRoom: state.selection.room,
});

export default connect(mapStateToProps, null)(DetailPopup);

AppRegistry.registerComponent('DetailPopup', () => DetailPopup);
