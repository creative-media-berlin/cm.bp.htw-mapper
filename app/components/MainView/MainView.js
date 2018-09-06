import React, { Component } from 'react';
import {
  AppRegistry,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleMenu } from '../../actions/menuActions';

import { MapHandler } from '../MapHandler';
import { SearchHandler } from '../SearchHandler';
import { Menu } from '../Menu';

class MainView extends Component {

  onMenuButtonPressed() {
    this.props.toggleMenu();
  }

  render() {
    return (
      <View>
        <MapHandler />
        <SearchHandler onMenuButtonPressed={() => this.onMenuButtonPressed()} />
        <Menu />
      </View>
    );
  }
}

MainView.propTypes = {
  toggleMenu: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  toggleMenu: () => dispatch(toggleMenu()),
});

export default connect(null, mapDispatchToProps)(MainView);

AppRegistry.registerComponent('MainView', () => MainView);
