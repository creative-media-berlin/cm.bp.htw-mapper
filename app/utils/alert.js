import { Alert } from 'react-native';

export default function alertUser(title, message) {
  Alert.alert(
    title,
    message,
    [
      { text: 'OK', onPress: () => console.log('OK Pressed') },
    ],
    { cancelable: false }
  );
}
