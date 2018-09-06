import React, { Component } from 'react';
import { Animated, Text, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import Logo from '../../assets/images/logo_transparent.png';
import LogoFont from '../../assets/images/logo_font.png';
import styles from './styles';

class Spinner extends Component {
  constructor(props) {
    super(props);
    this.state = { rotation: new Animated.Value(0) };
  }

  componentDidMount() {
    this.spin();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.error && !nextProps.error) {
      this.spin();
    }
  }

  getRotationStyle() {
    const rotate = this.state.rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    return { transform: [{ rotate }] };
  }

  spin() {
    this.state.rotation.setValue(0);
    Animated.timing(this.state.rotation, {
      toValue: 1,
      duration: 2000,
    }).start(() => {
      if (!this.props.error) {
        this.spin();
      }
    });
  }

  render() {
    const text = this.props.error ? (
      <Text style={[styles.subtitle, styles.text]} >{this.props.error}</Text>
    ) : (
      <Image source={LogoFont} style={[styles.subtitle, styles.fontImage]} />
    );
    return (
      <View style={styles.container}>
        <Animated.Image
          source={Logo}
          style={[styles.spinner, this.getRotationStyle()]}
        />
        {text}
      </View>
    );
  }
}

Spinner.propTypes = {
  error: PropTypes.string,
};

export default Spinner;
