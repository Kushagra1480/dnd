const {Redis} = require("@upstash/redis");
const chatRooms = new Redis({
  url: "url-here",
  token: "token-here",
});

const UserState = {
  NOT_READY : 'not-ready',
  READY : 'ready'
}
const GameState = {
  WAITING : 'waiting',
  PLAYING : 'playing'
}

chatRooms.exists()

// CRUD ROOM FUNCTIONS----------------------------------------------
export async function roomExists(roomId) {
  return await chatRooms.exists(roomId)==1;
}


export async function createRoom(roomId, userId) {
  const users = [{
    id: userId,
    state: "not-ready"
  }]
  return await chatRooms.set(roomId, { messages: [], users: users});
}

export async function addUserToRoom(roomId, userId) {
  await chatRooms.get(roomId)
  .then(async(room) => {
    if (room === null) {
      throw new Error("Room not found");
    }
    else{
        room.users.push({
          id: userId,
          state: 'not-ready'
        });
      return await chatRooms.set(roomId, room);
    }
  });
}



// export function removeUserFromRoom(roomId, userId) {
//   chatRooms.get(roomId).
//   then((room) => {
//   if (room) {
//     for (let user of room.users) {
//       if (user.id === userId) {
//         room.users.delete(user);
//       }
//     }
//     if (room.users.size === 0) {
//       chatRooms.delete(roomId);
//     }
//   }
//   else {
//     throw new Error('Room not found');
//   }
//   });
// }

// State Functions----------------------------------------------
export async function resetUserState(roomId) {
  await chatRooms.get(roomId).then(async (room) => {
     if (room) {
       for (let user of room.users) {
         user.state = 'not-ready';
       }
       return await chatRooms.set(roomId, room);
     }
     else {
       throw new Error('Room not found');
     }
   });
 }

export async function setUserState(roomId, userId, state) {
  await chatRooms.get(roomId).then(async (room) => {
    if (room) {
      for (let user of room.users) {
        if (user.id === userId) {
          user.state = state;
          break;
        }
      }
      return await chatRooms.set(roomId, room);
    }
  });
}

export async function isRoomReady(roomId) {
  let res;
  await chatRooms.get(roomId).then((room)=>{
  if (room) {
    for (const user of room.users) {
      res = true;
      if (user.state == 'not-ready') {
          res = false;
        }    
      }
  }
  else {
    throw new Error('Room not found');
  }
  });
  return res;  
}



// Message Functions----------------------------------------------
export async function addMessage(roomId, message) {
  const room = await chatRooms.get(roomId).then((room)=>{
  if (room) {
    room.messages.push(message);
    chatRooms.set(roomId,room);
  }
  else {
    throw new Error('Room not found');
  }
})
}

export async function getMessages(roomId) {
  let res;
  await chatRooms.get(roomId).then((room) => {
    if (room) {
      res = room.messages;
    }
    else {
      throw new Error('Room not found');
    }
  })
  return res;
}





