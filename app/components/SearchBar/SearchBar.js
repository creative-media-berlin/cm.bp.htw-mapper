import React, { Component } from 'react';
import {
  AppRegistry,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import { Toolbar, ThemeProvider } from 'react-native-material-ui';
import colors from '../../config/colors';
import styles, { uiTheme } from './styles';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearchActive: false,
    };
  }

  setToolbarAttributes() {
    const attributes = {
      color: colors.white,
      leftElement: 'menu',
      onLeftElementPress: () => this.props.onMenuButtonPressed(),
      centerElement: (
        <View style={{ height: 40 }} />
      ), // placeholder element to make it clickable
      onPress: this.props.onSearchOpened, // pressing on center element
      isSearchActive: this.props.isSearchActive,
      searchable: {
        autoFocus: true,
        placeholder: 'Suche nach Räumen, Dozenten',
        onSearchClosed: this.props.onSearchClosed,
        onSearchPressed: this.props.onSearchOpened,
        onChangeText: this.props.onChange,
        onSubmitEditing: this.props.onSearch,
      },
    };
    return attributes;
  }

  render() {
    return (
      <View style={styles.container}>
        <ThemeProvider uiTheme={uiTheme}>
          <Toolbar {...this.setToolbarAttributes()} />
        </ThemeProvider>
      </View>
    );
  }
}

SearchBar.propTypes = {
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  isSearchActive: PropTypes.bool,
  onMenuButtonPressed: PropTypes.func,
  onSearchOpened: PropTypes.func,
  onSearchClosed: PropTypes.func,
  rooms: PropTypes.array,
};

export default SearchBar;

AppRegistry.registerComponent('SearchBar', () => SearchBar);
