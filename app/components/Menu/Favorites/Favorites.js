import React, { Component } from 'react';
import { AppRegistry, Text, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Local imports
import styles from './styles';
import { toggleMenu } from '../../../actions/menuActions';
import { selectFloor, selectRoom } from '../../../actions/selectionActions';
import { getSortedSavedRooms, toggleFavoriteAttribute, deleteSavedRoom } from '../../../utils/favoritesAPI';
import { SavedRoomsList } from './SavedRoomsList';

class Favorites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savedRooms: {
        searches: [],
        favorites: [],
      },
    };
    this.selectSavedRoom = this.selectSavedRoom.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
    this.deleteSelectedSavedRoom = this.deleteSelectedSavedRoom.bind(this);
  }

  async componentWillMount() {
    try {
      const savedRooms = await getSortedSavedRooms();
      this.setState({ savedRooms });
    } catch (error) {
      console.log('An error occurred retrieving saved rooms.');
    }
  }

  selectSavedRoom(room) {
    this.props.selectRoom(room);
    this.props.selectFloor(+room.properties.floor);
    this.props.toggleMenu();
  }

  async toggleFavorite(room) {
    try {
      await toggleFavoriteAttribute(room);
      const savedRooms = await getSortedSavedRooms();
      this.setState({ savedRooms });
    } catch (error) {
      console.log('An error occurred retrieving saved rooms.');
    }
  }

  async deleteSelectedSavedRoom(room) {
    try {
      await deleteSavedRoom(room);
      const savedRooms = await getSortedSavedRooms();
      this.setState({ savedRooms });
    } catch (error) {
      console.log('An error occurred retrieving saved rooms.');
    }
  }

  render() {
    return (
      <View style={styles.content}>
        <SavedRoomsList
          minEntries={0}
          title={'Favoriten'}
          savedRooms={this.state.savedRooms.favorites}
          selectSavedRoom={this.selectSavedRoom}
          toggleFavorite={this.toggleFavorite}
          deleteSelectedSavedRoom={this.deleteSelectedSavedRoom}
        />
        <Text style={{ marginTop: 40 }}>Häufig gesucht</Text>
        <SavedRoomsList
          minEntries={2}
          title={'Suchbegriffe'}
          savedRooms={this.state.savedRooms.searches}
          selectSavedRoom={this.selectSavedRoom}
          toggleFavorite={this.toggleFavorite}
          deleteSelectedSavedRoom={this.deleteSelectedSavedRoom}
        />
      </View>
    );
  }
}

Favorites.propTypes = {
  selectRoom: PropTypes.func,
  selectFloor: PropTypes.func,
  toggleMenu: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  selectRoom: room => dispatch(selectRoom(room)),
  selectFloor: floor => dispatch(selectFloor(floor)),
  toggleMenu: () => dispatch(toggleMenu()),
});

export default connect(null, mapDispatchToProps)(Favorites);
AppRegistry.registerComponent('Favorites', () => Favorites);
