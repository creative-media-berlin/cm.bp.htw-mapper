import React from 'react';
import { AppRegistry, ScrollView, Text, View } from 'react-native';
import { Card, ThemeProvider } from 'react-native-material-ui';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';

import { getRoomName } from '../../utils/roomOperations';
import styles, { uiTheme } from './styles';

const SearchResults = props => {
  const getType = (result) => {
    const { type, descr } = result.item.properties;
    const capitalized = type.charAt(0).toUpperCase() + type.substr(1);
    switch (type) {
      case 'wc_f':
        return (<Ionicon name="md-woman" size={30} />);
      case 'wc_m':
        return (<Ionicon name="md-man" size={30} />);
      case 'wc_d':
        return (<Icon name="accessible" size={30} />);
      case 'snack':
      case 'drink':
      case 'printer':
        return null;
      case 'office': {
        const lecturer = descr ? ` (${descr.split(';')[0]})` : '';
        return (<Text>{capitalized}{lecturer}</Text>);
      }
      default:
        return (<Text>{capitalized}</Text>);
    }
  };

  let content;
  if (props.status) {
    content = <Text style={styles.status}>{props.status}</Text>;
  } else if (props.results && props.results.length > 0) {
    const results = props.results.slice(0, 15).map((result, i) => (
      <ThemeProvider uiTheme={uiTheme} key={i}>
        <Card onPress={() => props.onPress(result.item)}>
          <View style={styles.result}>
            <Text style={styles.roomName}>{getRoomName(result)}</Text>
            {getType(result)}
            {result.distance ? <Text>{result.distance} m</Text> : null}
          </View>
        </Card>
      </ThemeProvider>
    ));
    content = <ScrollView keyboardShouldPersistTaps={'handled'}>{results}</ScrollView>;
  } else {
    content = (
      <View>
        <ThemeProvider uiTheme={uiTheme}>
          <Card onPress={() => props.searchToilets()}>
            <View style={styles.result}>
              <Text style={styles.roomName}>Nächste Toilette</Text>
            </View>
          </Card>
        </ThemeProvider>
        <ThemeProvider uiTheme={uiTheme}>
          <Card onPress={() => props.searchSnacks()}>
            <View style={styles.result}>
              <Text style={styles.roomName}>Nächster Snack/Drink</Text>
            </View>
          </Card>
        </ThemeProvider>
        <ThemeProvider uiTheme={uiTheme}>
          <Card onPress={() => props.searchPrinters()}>
            <View style={styles.result}>
              <Text style={styles.roomName}>Nächster Drucker</Text>
            </View>
          </Card>
        </ThemeProvider>
      </View>
    );
  }
  return (
    <View style={styles.container}>{content}</View>
  );
};

SearchResults.propTypes = {
  onPress: PropTypes.func,
  results: PropTypes.array,
  searchToilets: PropTypes.func,
  searchSnacks: PropTypes.func,
  searchPrinters: PropTypes.func,
  status: PropTypes.string,
};

export default SearchResults;

AppRegistry.registerComponent('SearchResults', () => SearchResults);
