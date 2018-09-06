import { AsyncStorage } from 'react-native';
import { roomsAreSame } from './roomOperations';

async function addSavedRoomsInAsyncStorage() {
  const newSavedRooms = {
    values: [],
  };
  try {
    await AsyncStorage.setItem('@HTWMapperCache:savedRooms', JSON.stringify(newSavedRooms));
    return newSavedRooms;
  } catch (error) { console.log('Error creating new saved rooms list in application storage.'); }
  return null;
}

function sortSavedRooms(savedRoomsArray) {
  return savedRoomsArray.sort((a, b) => {
    return b.frequency - a.frequency;
  });
}

async function getAsyncStorage() {
  try {
    const value = await AsyncStorage.getItem('@HTWMapperCache:savedRooms');
    if (value !== null) {
      const savedRooms = JSON.parse(value);
      return savedRooms;
    }
    return await addSavedRoomsInAsyncStorage();
  } catch (error) { console.log('Error getting previous saved rooms.'); }
  return null;
}

async function updateAsyncStorage(savedRooms) {
  try {
    await AsyncStorage.setItem('@HTWMapperCache:savedRooms', JSON.stringify(savedRooms));
    return true;
  } catch (error) {
    console.log('Error setting saved rooms.');
    return false;
  }
}

function getIndexInSavedRooms(savedRooms, room) {
  return savedRooms.values.findIndex(roomEntry => roomsAreSame(roomEntry.input, room));
}

function getEntryInSavedRooms(savedRooms, room) {
  return savedRooms.values.find(roomEntry => roomsAreSame(roomEntry.input, room));
}

export async function updateSavedRoomInAsyncStorage(room) {
  const newSavedRoom = room;
  if (!newSavedRoom) {
    return false;
  }
  const savedRooms = await getAsyncStorage();
  const index = getIndexInSavedRooms(savedRooms, room);
  if (index >= 0) {
    savedRooms.values[index].frequency += 1;
  } else {
    const newRoomEntry = {
      input: newSavedRoom,
      frequency: 1,
      isFavorite: false,
    };
    savedRooms.values.push(newRoomEntry);
  }
  const status = await updateAsyncStorage(savedRooms);
  return status;
}

export async function getSortedSavedRooms() {
  try {
    const savedRooms = await getAsyncStorage();
    if (savedRooms) {
      return {
        favorites: sortSavedRooms(savedRooms.values.filter(entry => entry.isFavorite)),
        searches: sortSavedRooms(savedRooms.values.filter(entry => !entry.isFavorite)),
      };
    }
  } catch (error) { console.log('An error occured retrieving the sorted saved rooms list.'); }
  return null;
}

export async function isFavorite(room) {
  try {
    const savedRooms = await getAsyncStorage();
    if (savedRooms) {
      const savedRoom = getEntryInSavedRooms(savedRooms, room);
      if (savedRoom) {
        return savedRoom.isFavorite;
      }
      return false;
    }
  } catch (error) { console.log('An error occured checking a room the saved rooms list.'); }
  return false;
}

export async function deleteSavedRoom(room) {
  try {
    const savedRooms = await getAsyncStorage();
    if (savedRooms) {
      const index = getIndexInSavedRooms(savedRooms, room);
      if (index >= 0) {
        savedRooms.values.splice(index, 1);
        return await updateAsyncStorage(savedRooms);
      }
    }
  } catch (error) { console.log('An error occured deleting a room from the saved rooms list.'); }
  return false;
}

export async function toggleFavoriteAttribute(room) {
  try {
    const savedRooms = await getAsyncStorage();
    if (savedRooms) {
      const savedRoom = getEntryInSavedRooms(savedRooms, room);
      if (savedRoom) {
        savedRoom.isFavorite = !savedRoom.isFavorite;
      } else {
        const newRoomEntry = {
          input: room,
          frequency: 1,
          isFavorite: true,
        };
        savedRooms.values.push(newRoomEntry);
      }
      return await updateAsyncStorage(savedRooms);
    }
  } catch (error) { console.log('An error occured marking or unmarking a room as a favorite in the saved rooms list.'); }
  return false;
}
