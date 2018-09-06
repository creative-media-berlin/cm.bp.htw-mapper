import React from 'react';
import {
  AppRegistry,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

// Local imports
import { getRoomOccupationText } from '../../utils/roomOperations';
import { OccupationButton } from '../Buttons/OccupationButton';
import alertUser from '../../utils/alert';
import colors from '../../config/colors';
import styles from './styles';


const DetailPopupLowerSection = (props) => {
  if (!props.selectedRoom) {
    return (null);
  }

  const { occupiedText, occupiedAlert, occupiedButton } = getRoomOccupationText(props.loading, props.occupied);

  return (
    <View style={styles.whiteContainer}>
      <View style={styles.buttonRow}>
        <View style={styles.rowButton}>
          <OccupationButton
            alert={occupiedAlert}
            buttonId={occupiedButton}
          />
          <Text style={[styles.rowButtonText, styles.roomStatus]}>{occupiedText}</Text>
        </View>
        <View style={styles.rowButton}>
          <Icon.Button
            name="star"
            color={props.isFavorite ? colors.primaryRed : colors.lightGrey}
            backgroundColor={colors.white}
            size={30}
            onPress={() => props.toggleFavorite(props.selectedRoom)}
          >
          </Icon.Button>
          <Text style={styles.rowButtonText}>Favorite</Text>
        </View>
        <View style={styles.rowButton}>
          <Icon.Button
            name="info"
            color={colors.lightGrey}
            backgroundColor={colors.white}
            size={30}
            onPress={() => alertUser(
              'Mehr Informationen',
               props.selectedRoom.properties.descr || 'Keine weiteren Informationen verfügbar'
            )}
          >
          </Icon.Button>
          <Text style={[styles.rowButtonText, styles.share]}>  Info</Text>
        </View>
      </View>
    </View>
  );
};

DetailPopupLowerSection.propTypes = {
  selectedRoom: PropTypes.object,
  occupied: PropTypes.bool,
  loading: PropTypes.bool,
  isFavorite: PropTypes.bool,
  toggleFavorite: PropTypes.func,
};

export default DetailPopupLowerSection;

AppRegistry.registerComponent('DetailPopupLowerSection', () => DetailPopupLowerSection);
