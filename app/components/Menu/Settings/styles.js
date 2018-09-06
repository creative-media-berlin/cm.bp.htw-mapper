import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  content: {
    padding: '5%',
    width: '100%',
    flexWrap: 'nowrap',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  radioButtonView: {
    padding: 5,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dropdownView: {
    margin: 5,
    marginLeft: 62,
  },
  labelCategory: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  labelSubheading: {
    fontSize: 14,
    paddingBottom: 10,
  },
  radioButton: {
    backgroundColor: 'red',
  },
});
