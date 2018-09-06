export const roomsAreSame = (roomA, roomB) => {
  return (
    roomA &&
    roomB &&
    roomA.properties.name === roomB.properties.name &&
    roomA.properties.building === roomB.properties.building
  );
};

export const isClickable = (room) => {
  if (!room) return false;
  return room.properties.type !== 'hallway' &&
    room.properties.type !== 'stairs' &&
    room.properties.type !== 'elevator';
};

export const getRoomFromFeaturesAtPoint = (featureCollection) => {
  const roomFeature = featureCollection.features.find((feature) => {
    return feature.properties && feature.properties.name;
  });
  return roomFeature;
};


export const getLecturer = (item) => {
  const { type, descr } = item.properties;
  if (type === 'office' && descr) {
    const destruct = descr.split(';')[0].split(' ');
    let returnname = '';
    for (let index = 0; index < destruct.length; ++index) {
      returnname += `${destruct[index].charAt(0).toUpperCase()}. `;
    }
    return returnname.substring(0, returnname.length - 3) + destruct[destruct.length - 1];
  }
  return '';
};

export const getRoomKeyDescription = (item) => {
  const { type } = item.properties;

  return getLecturer(item) || type.charAt(0).toUpperCase() + type.substr(1);
};

export const getRoomTypeText = (room) => {
  const { type, floor } = room.properties;
  if (!type) return '';
  switch (type) {
    case 'other':
      return 'Sonstiges';
    case 'wc_m':
      return 'Herren';
    case 'wc_f':
      return 'Damen';
    case 'wc_d':
      return 'Barrierefrei';
    case 'office': {
      const lecturer = getLecturer(room);
      return `Office${lecturer ? ` (${lecturer})` : ''}`;
    }
    case 'printer':
    case 'snack':
    case 'drink':
      return `Etage ${floor}`;
    default:
      return type.charAt(0).toUpperCase() + type.substr(1);
  }
};

export const getRoomOccupationText = (loading, occupied) => {
  const occupation = {
    occupiedText: 'Lade...',
    occupiedAlert: 'Der Raumstatus wird abgefragt \nBitte warte...',
    occupiedButton: 'loop',
  };
  if (!loading) {
    switch (occupied) {
      case true:
        occupation.occupiedText = 'Belegt';
        occupation.occupiedAlert = 'Dieser Raum ist gerade belegt';
        occupation.occupiedButton = 'close';
        break;
      case false:
        occupation.occupiedText = 'Frei';
        occupation.occupiedAlert = 'Dieser Raum ist gerade frei';
        occupation.occupiedButton = 'check';
        break;
      default:
        occupation.occupiedText = 'Privat';
        occupation.occupiedAlert = 'Dieser Raum ist privat. \nEr kann nicht genutzt werden';
        occupation.occupiedButton = 'md-hand';
        break;
    }
  }
  return occupation;
};

export const getRoomName = (result) => {
  const { building, name, type } = result.item.properties;
  const isRoom = name !== 'Drucker' && type !== 'snack' && type !== 'drink';
  return isRoom ? building.toUpperCase() + name : name;
};
