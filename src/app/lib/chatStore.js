const chatRooms = new Map();

//enum user states = not ready, ready
const UserState = {
  NOT_READY : 'not-ready',
  READY : 'ready'
}

const GameState = {
  WAITING : 'waiting',
  PLAYING : 'playing'
}


// CRUD ROOM FUNCTIONS----------------------------------------------
export function roomExists(roomId) {
  return chatRooms.has(roomId);
}

export function createRoom(roomId, userId) {
  chatRooms.set(roomId, { messages: [], users: new Set() });
  addUserToRoom(roomId, userId);
}

export function addUserToRoom(roomId, userId) {
  const room = chatRooms.get(roomId);
  // console.log(userId);
  if (room) {
    room.users.add({id: userId, state: UserState.NOT_READY });
    // console.log(room.users);
  }
  else {
    throw new Error('Room not found');
  }
}


export function removeUserFromRoom(roomId, userId) {
  const room = chatRooms.get(roomId);
  if (room) {
    for (let user of room.users) {
      if (user.id === userId) {
        room.users.delete(user);
      }
    }
    if (room.users.size === 0) {
      chatRooms.delete(roomId);
    }
  }
  else {
    throw new Error('Room not found');
  }
}

// State Functions----------------------------------------------
export function resetUserState(roomId) {
  const room = chatRooms.get(roomId);
  if (room) {
   for (let user of room.users) {
     user.state = UserState.NOT_READY;
   }
  }
  else {
    throw new Error('Room not found');
  }

}

export function setUserState(roomId, userId, state) {
  const room = chatRooms.get(roomId);
  if (room) {
    room.users.forEach((user) => {
      if (user.id === userId) {
        
        user.state = state;
      }
    });
  }
}

export function isRoomReady(roomId) {
  const room = chatRooms.get(roomId);
  // console.log(room);
  if (room) {
      for (const user of room.users) {
        if (user.state == UserState.NOT_READY) {
          return false;
        }
      
    // room.users.forEach((user) => {
    //     if (user.state == UserState.NOT_READY) {
    //       return false;
    //     }
    //   });
     
    }
    console.log('All users are ready');
    return true;
    }
    else {
      throw new Error('Room not found');
    }
}



// Message Functions----------------------------------------------
export function addMessage(roomId, message) {
  const room = chatRooms.get(roomId);
  if (room) {
    room.messages.push(message);
  }
  else {
    throw new Error('Room not found');
  }
}

export function getMessages(roomId) {
  const room = chatRooms.get(roomId);
  if (room) {
    return chatRooms.get(roomId)?.messages || [];
  }
  else {
    throw new Error('Room not found');
  }
}





