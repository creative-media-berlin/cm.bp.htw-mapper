import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NetInfo, View } from 'react-native';
import StatusBarAlert from 'react-native-statusbar-alert';
import PropTypes from 'prop-types';

import { MainView } from '../MainView';
import { Spinner } from '../Spinner';
import { setMode, setMinElevatorLevelDiff } from '../../actions/navigationActions';
import { updateFeatures, updateRooms, updatePOI } from '../../actions/featuresActions';
import { ignoreGpsStatus, ignoreWifiStatus, updateWifiStatus } from '../../actions/statusActions';
import { fetchData, fetchRooms, fetchPOI } from '../../utils/fetch';
import { getFloorChangeMode, getMinElevatorLevelDiff } from '../../utils/settingsAPI';
import { getStatusErrors } from '../../selectors/statusSelector';
import colors from '../../config/colors';
import styles from './styles';

class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchDone: false,
      error: null,
      connected: null,
    };
  }

  async componentWillMount() {
    NetInfo.addEventListener('connectionChange', this.onConnectionChange);
  }

  async componentDidMount() {
    const mode = await getFloorChangeMode();
    const level = await getMinElevatorLevelDiff();
    this.props.setFloorChangeMode(mode);
    this.props.setMinElevatorLevelDiff(level);
  }

  componentWillUnmount() {
    NetInfo.removeEventListener('connectionChange', this.onConnectionChange);
  }

  onConnectionChange = (connection) => {
    const connected = connection.type !== 'none';
    this.props.updateWifiStatus(connection.type === 'wifi');
    if (connected && !this.state.connected && !this.state.fetchDone) {
      this.fetchAll();
    } else if (!connected && !this.state.connected) {
      this.setState({ error: 'Keine Internetverbindung.' });
    }
    this.setState({ connected });
  }

  fetchAll = async () => {
    try {
      this.setState({ error: null, fetchDone: false });
      const [features, rooms, poi] = await Promise.all([fetchData(), fetchRooms(), fetchPOI()]);
      this.setState({ fetchDone: true });
      this.props.updateFeatures(features);
      this.props.updateRooms(rooms);
      this.props.updatePOI(poi);
    } catch (error) {
      console.log(error);
      this.setState({ error: 'Verbindung fehlgeschlagen.' });
    }
  }

  dismissStatusError = (status) => {
    switch (status) {
      case 'gps':
        this.props.ignoreGpsStatus(); break;
      case 'wifi':
        this.props.ignoreWifiStatus(); break;
      default:
        break;
    }
  }

  render() {
    if (!this.state.fetchDone || this.state.error) {
      return (
        <View style={styles.container} >
          <Spinner error={this.state.error} />
        </View>
      );
    }
    return (
      <View>
        <StatusBarAlert
          visible={this.props.wifiError}
          message="Keine Verbindung zum WLAN"
          backgroundColor={colors.darkRed}
          color="white"
          onPress={() => this.dismissStatusError('wifi')}
          style={{ elevation: 3 }}
        />
        <StatusBarAlert
          visible={this.props.gpsError}
          message="Kein GPS Signal"
          backgroundColor={colors.darkRed}
          color="white"
          onPress={() => this.dismissStatusError('gps')}
          style={{ elevation: 3 }}
        />
        <MainView />
      </View>
    );
  }
}

SplashScreen.propTypes = {
  gpsError: PropTypes.bool,
  wifiError: PropTypes.bool,
  updateFeatures: PropTypes.func,
  updateRooms: PropTypes.func,
  updatePOI: PropTypes.func,
  ignoreGpsStatus: PropTypes.func,
  ignoreWifiStatus: PropTypes.func,
  updateWifiStatus: PropTypes.func,
  setFloorChangeMode: PropTypes.func,
  setMinElevatorLevelDiff: PropTypes.func,
};

const mapStateToProps = state => ({
  ...getStatusErrors(state),
});

const mapDispatchToProps = dispatch => ({
  updateFeatures: features => dispatch(updateFeatures(features)),
  updateRooms: rooms => dispatch(updateRooms(rooms)),
  updatePOI: poi => dispatch(updatePOI(poi)),
  ignoreGpsStatus: () => dispatch(ignoreGpsStatus()),
  ignoreWifiStatus: () => dispatch(ignoreWifiStatus()),
  updateWifiStatus: status => dispatch(updateWifiStatus(status)),
  setFloorChangeMode: mode => dispatch(setMode(mode)),
  setMinElevatorLevelDiff: level => dispatch(setMinElevatorLevelDiff(level)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
