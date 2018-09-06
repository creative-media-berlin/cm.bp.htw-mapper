import React, { Component } from 'react';
import { AppRegistry, View, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { SearchBar } from '../SearchBar';
import { SearchResults } from '../SearchResults';
import { setMenu } from '../../actions/menuActions';
import { selectFloor, selectRoom } from '../../actions/selectionActions';
import { isSearchDataValid, search } from '../../utils/search';
import { updateSavedRoomInAsyncStorage } from '../../utils/favoritesAPI';
import { getTransitionSettings } from '../../selectors/transitionSelector';
import styles from './styles';

class SearchHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearchActive: false,
      searchResults: [],
      searchStatus: null,
      searchText: '',
      searchBuffered: null, // search submitted before graph got generated?
    };
    this.onSearchResultPressed = this.onSearchResultPressed.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.transitionSettings.graph
      && this.props.transitionSettings.graph
      && this.state.searchBuffered) {
      this.searchFromBuffer();
    }
  }

  onSearchTextChange(searchText) {
    const textCleared = this.state.searchText !== '' && searchText === '';
    let searchBuffered;
    let searchResults = [];
    let searchStatus;
    if (!textCleared && searchText.length > 1) {
      searchResults = this.getSearchResults('rooms', searchText);
      if (!searchResults) {
        searchBuffered = 'rooms';
      } else if (searchResults.length === 0) {
        searchStatus = 'Keine Suchergebnisse gefunden.';
      }
    }
    this.setState({ searchBuffered, searchResults, searchStatus, searchText });
  }

  async onSearchResultPressed(room) {
    this.setState({
      isSearchActive: false,
      searchResults: [],
      searchText: '',
    });
    this.props.selectFloor(+room.properties.floor);
    this.props.selectRoom(room);
    await updateSavedRoomInAsyncStorage(room);
  }

  getSearchData = (type, input) => ({
    type,
    input,
    rooms: this.props.rooms,
    poi: this.props.poi,
    pathfinding: {
      transitionSettings: this.props.transitionSettings,
      position: this.props.position,
      featurePoints: this.props.featurePoints,
    },
  });

  getSearchResults(type, input = this.state.searchText) {
    this.setState({ searchStatus: 'Suche läuft...' });
    const data = this.getSearchData(type, input);
    return isSearchDataValid(data) ? search(data) : null;
  }

  search(type) {
    const results = this.getSearchResults(type);
    if (!results) {
      this.setState({ searchBuffered: type });
    } else if (results.length === 0) {
      this.setState({ searchStatus: 'Keine Suchergebnisse gefunden.' });
    } else {
      this.setState({
        searchBuffered: false,
        searchResults: results,
        searchStatus: null,
      });
    }
    Keyboard.dismiss();
  }

  searchFromBuffer() {
    this.search(this.state.searchBuffered);
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.isSearchActive ? (
          <SearchResults
            results={this.state.searchResults}
            status={this.state.searchStatus}
            onPress={(room) => this.onSearchResultPressed(room)}
            searchToilets={() => this.search('toilets')}
            searchSnacks={() => this.search('snacks')}
            searchPrinters={() => this.search('printers')}
          />
        ) : null}
        <SearchBar
          onMenuButtonPressed={() => this.props.onMenuButtonPressed()}
          onChange={(text) => this.onSearchTextChange(text)}
          onSearch={() => this.search('rooms')}
          onSearchOpened={() => {
            this.setState({ isSearchActive: true });
            this.props.closeMenu();
          }}
          onSearchClosed={() => this.setState({
            isSearchActive: false,
            searchResults: [],
            searchStatus: null,
            searchText: '',
          })}
          isSearchActive={this.state.isSearchActive}
        />
      </View>
    );
  }
}

SearchHandler.propTypes = {
  rooms: PropTypes.array,
  poi: PropTypes.array,
  transitionSettings: PropTypes.object,
  position: PropTypes.object,
  featurePoints: PropTypes.array,
  closeMenu: PropTypes.func,
  selectFloor: PropTypes.func,
  selectRoom: PropTypes.func,
  onMenuButtonPressed: PropTypes.func,
};

const mapStateToProps = state => ({
  rooms: state.features.rooms,
  poi: state.features.poi,
  position: state.position,
  featurePoints: state.features.featurePoints,
  transitionSettings: getTransitionSettings(state),
});

const mapDispatchToProps = dispatch => ({
  closeMenu: () => dispatch(setMenu(false)),
  selectRoom: room => dispatch(selectRoom(room)),
  selectFloor: floor => dispatch(selectFloor(floor)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchHandler);

AppRegistry.registerComponent('SearchHandler', () => SearchHandler);
