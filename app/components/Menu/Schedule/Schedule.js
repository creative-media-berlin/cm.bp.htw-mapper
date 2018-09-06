import React, { Component } from 'react';
import { AppRegistry, Text, View, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import dateFormat from 'dateformat';


// Local imports
import colors from '../../../config/colors';
import styles from './styles';

class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // dummy data
      courses: [
        {
          name: 'Informatik 3',
          room: 'C302',
          cycle: 'wöchentlich',
          timestamp: 'Mo 09:45 - 11:15',
        },
        {
          name: 'Computergrafik (SU)',
          room: 'C501',
          cycle: 'wöchentlich',
          timestamp: 'Mo 08:00 - 09:30',
        },
        {
          name: 'Wi. A. mit LaTeX',
          room: 'PBH 5003',
          cycle: 'wöchentlich',
          timestamp: 'Mo 14:00 - 15:30',
        },
      ],
    };
  }

  getToday() {
    const now = new Date();
    return dateFormat(now, 'dddd, dS mmmm yyyy');
  }

  renderSeparator() {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#CED0CE',
        }}
      />
    );
  }

  render() {
    return (
      <View style={styles.content}>
        <Text style={styles.today}>{this.getToday()}</Text>
        <FlatList
          data={this.state.courses}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              <View>
                <Text style={styles.courseTitle}> {item.name}</Text>
                <Text>
                  {' '}
                  {item.room} {item.cycle}
                  {'\n'} {item.timestamp}
                </Text>
              </View>
              <Icon.Button
                name={'directions'}
                backgroundColor={colors.white}
                color={colors.primaryRed}
                size={40}
                onPress={() => alert('Todo')}
              />
            </View>
          )}
          keyExtractor={item => item.name}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </View>
    );
  }
}

export default Schedule;
AppRegistry.registerComponent('Schedule', () => Schedule);
