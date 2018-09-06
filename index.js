import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';

import { createStore } from 'redux';
import reducer from './app/reducers';
import { Provider } from 'react-redux';
import { SplashScreen } from './app/components/SplashScreen';

const store = createStore(reducer);

// Action Button from react-native-material-ui supports passing a custom element,
// but it doesn't allow it in its prop types.
// eslint-disable-next-line no-console
console.ignoredYellowBox = [
  'Warning: Failed prop type: Invalid prop `icon` of type `object` supplied to `ActionButton`',
];

class HTWMapper extends Component {
  constructor() {
    super();
    this.state = store.getState();
  }

  render() {
    return (
      <Provider store={store}>
        <View style={{ position: 'relative' }}>
          <SplashScreen />
        </View>
      </Provider>
    );
  }
}

export default HTWMapper;

AppRegistry.registerComponent('HTWMapper', () => HTWMapper);
