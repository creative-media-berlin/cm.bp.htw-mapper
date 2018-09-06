import React from 'react';
import { AppRegistry, Text, View, FlatList, Alert, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

// Local imports
import { getRoomKeyDescription } from '../../../../utils/roomOperations';
import colors from '../../../../config/colors';
import styles, { separatorStyle } from './styles';

const SavedRoomsList = props => {
  const renderSeparator = () => {
    return (<View style={separatorStyle} />);
  };

  const getItems = () => {
    return props.savedRooms.filter(item => item.frequency >= props.minEntries);
  };

  const roomNumber = (item) => {
    const { building, floor, name } = item.input.properties;
    if (parseInt(name, 10)) {
      return building.toUpperCase() + name;
    }
    return building.toUpperCase() + floor;
  };

  return (
    <View>
      <FlatList
        data={getItems()}
        keyExtractor={(item, index) => index}
        ItemSeparatorComponent={renderSeparator}
        renderItem={({ item, index }) => {
          if (item.frequency >= props.minEntries) {
            return (
              <View>
                <View style={styles.flatList} key={index}>
                  <Icon.Button
                    name={"star"}
                    backgroundColor={colors.white}
                    color={item.isFavorite ? colors.primaryRed : colors.lightGrey}
                    size={35}
                    onPress={() => props.toggleFavorite(item.input)}
                  />
                  <Icon.Button
                    style={styles.trashButton}
                    name={"delete"}
                    backgroundColor={colors.white}
                    color={colors.lightGrey}
                    size={35}
                    onPress={() =>
                      Alert.alert(
                        'Warnung',
                        `Wollen Sie wirklich ${item.input.properties.name} aus Ihrer Liste der ${props.title} löschen?`,
                        [
                          {
                            text: 'Abbrechen',
                            style: 'cancel',
                          },
                          {
                            text: 'Löschen',
                            onPress: () => props.deleteSelectedSavedRoom(item.input),
                          },
                        ],
                        { cancelable: false }
                      )
                    }
                  />
                  <TouchableHighlight underlayColor={colors.white} onPress={() => props.selectSavedRoom(item.input)}>
                    <View style={styles.itemWrapper}>
                      <View style={styles.itemTextColumn}>
                        <Text style={styles.itemRoomNumber}>
                          {roomNumber(item)}
                        </Text>
                      </View>
                      <Icon.Button
                        name={"arrow-forward"}
                        backgroundColor={colors.white}
                        color={colors.primaryRed}
                        size={40}
                        onPress={() => props.selectSavedRoom(item.input)}
                        style={styles.navArrow}
                      />
                    </View>

                  </TouchableHighlight>
                </View>
                <Text style={styles.itemRoomType}>{getRoomKeyDescription(item.input)}</Text>
              </View>
            );
          } return null;
        }}
      />

    </View>
  );
};


SavedRoomsList.propTypes = {
  savedRooms: PropTypes.array,
  toggleFavorite: PropTypes.func,
  selectSavedRoom: PropTypes.func,
  deleteSelectedSavedRoom: PropTypes.func,
  minEntries: PropTypes.number,
  title: PropTypes.string,
};

export default SavedRoomsList;

AppRegistry.registerComponent('SavedRoomsList', () => SavedRoomsList);
