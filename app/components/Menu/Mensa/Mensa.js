import React from 'react';
import {
  AppRegistry,
  WebView,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';

// Local imports
import styles from './styles';

export const Mensa = () => {
  function loadingIndicator() {
    return (
      <View style={styles.content}>
        <Text> Bitte warten ... </Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <WebView
      source={{
        uri: 'https://www.imensa.de/berlin/mensa-wilhelminenhof/index.html',
      }}
      javaScriptEnabled
      domStorageEnabled
      renderLoading={loadingIndicator}
      startInLoadingState
    />
  );
};

export default Mensa;
AppRegistry.registerComponent('Schedule', () => Mensa);
