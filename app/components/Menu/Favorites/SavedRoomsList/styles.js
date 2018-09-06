import { StyleSheet } from 'react-native';
// import colors from '../../../../config/colors';

export default StyleSheet.create({
  flatList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 0,
    marginBottom: 0,
  },
  trashButton: {
    paddingRight: 0,
  },
  titleSavedRoomsya: {
    marginLeft: 0,
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 0,
    marginBottom: 14,

    width: 150,
  },
  itemTextColumn: {
    flexDirection: 'column',
    width: 80,
    paddingBottom: 3,
    paddingRight: 5,
  },
  itemRoomNumber: {
    fontSize: 25,
    paddingTop: 0,
    paddingRight: 0,
    paddingLeft: 0,
    paddingBottom: 0,
  },
  itemRoomType: {
    position: 'absolute',
    fontSize: 14,
    paddingVertical: 7,
    left: 145,
    top: 37,


  },

  navArrow: {

    width: 60,

  },
});

export const separatorStyle = {
  height: 1,
  width: '100%',
  backgroundColor: '#CED0CE',
};
