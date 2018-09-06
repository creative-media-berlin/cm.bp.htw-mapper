import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  Animated,
  Easing,
  TouchableHighlight,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Favorites } from './Favorites';
import { Schedule } from './Schedule';
import { Mensa } from './Mensa';
import { Settings } from './Settings';

import Logo from '../../assets/images/logo.png';
import styles from './styles';
import colors from '../../config/colors';
import menuPoints from '../../consts/menuPoints';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      slideValue: new Animated.Value(-500),
      activeWindow: 'HTW Mapper',
      bigHeader: true,
    };
  }

  componentWillReceiveProps(menu) {
    if (menu.isActive) {
      this.setActiveWindow('HTW Mapper');
      this.slide(1);
    } else {
      this.slide(0);
    }
  }

  setActiveWindow(window) {
    const bigHeader = !(window !== 'HTW Mapper');
    this.setState({
      activeWindow: window,
      bigHeader,
    });
  }

  slide(toVal) {
    Animated.spring(
      this.state.slideValue,
      {
        toValue: toVal,
        friction: 10,
        easing: Easing.linear,
      }
    ).start();
  }

  renderHeader() {
    if (this.state.bigHeader) {
      return (
        <View style={styles.header}>
          <Text style={styles.title}>{'HTW\nMapper'}</Text>
          <Image style={styles.logo} source={Logo} />
        </View>
      );
    }
    return (
      <View style={styles.headerMini}>
        <Icon.Button
          name={'arrow-back'}
          backgroundColor={colors.primaryRed}
          color={'white'}
          size={35}
          onPress={() => this.setActiveWindow('HTW Mapper')}
        />
        <Text style={styles.titleMini}> {this.state.activeWindow} </Text>
      </View>
    );
  }

  renderMenu() {
    switch (this.state.activeWindow) {
      case 'Favoriten':
        return (<Favorites />);
      case 'Stundenplan':
        return (<Schedule />);
      case 'Mensa':
        return (<Mensa />);
      case 'Einstellungen':
        return (<Settings />);
      default:
        return this.renderMainMenu();
    }
  }

  renderMenuEntry(button, text) {
    return (
      <View style={styles.menuEntry}>
        <Icon.Button
          name={button}
          backgroundColor={colors.white}
          color={colors.darkGrey}
          size={25}
        />
        <Text style={styles.listItem}>{text}</Text>
      </View>
    );
  }

  renderMainMenu() {
    return (
      <View style={styles.content}>
        {menuPoints.map(menuPoint => {
          return (
            <TouchableHighlight
              key={menuPoint.name}
              underlayColor={colors.white}
              onPress={() => this.setActiveWindow(menuPoint.name)}
            >
              {this.renderMenuEntry(menuPoint.button, menuPoint.name)}
            </TouchableHighlight>
          );
        })}
      </View>
    );
  }

  render() {
    const slide = this.state.slideValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-500, 0],
    });
    return (
      <Animated.View
        style={[styles.container, !this.state.bigHeader && styles.containerBig, {
          transform: [{ translateX: slide }],
        }]}
      >
        {this.renderHeader()}
        {this.renderMenu()}
      </Animated.View>
    );
  }
}

Menu.propTypes = {
  isActive: PropTypes.bool,
};

const mapStateToProps = state => ({
  isActive: state.menu.isMenuActive,
});

export default connect(mapStateToProps)(Menu);

AppRegistry.registerComponent('Menu', () => Menu);
