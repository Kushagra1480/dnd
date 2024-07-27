const { Redis } = require("@upstash/redis");



// const { roomExists } = require("./chatStore");
const chatRooms = new Redis({
  url: "url-here",
  token: "token-here",
});

// // example use of roomExists
// roomExists("0").then((res) => {
//   console.log(res)
// });



async function createRoom(roomId, userId) {
  const users = [{
    id: userId,
    state: "not-ready"
  }]
  return await chatRooms.set(roomId, { messages: [], users: users });
}

// createRoom("0", "1").then((res) => {
//   console.log(res)
// });



async function addUserToRoom(roomId, userId) {
  await chatRooms.get(roomId)
    .then(async (room) => {
      if (room === null) {
        throw new Error("Room not found");
      }
      else {
        room.users.push({
          id: userId,
          state: 'not-ready'
        });
        return await chatRooms.set(roomId, room);
      }
    });
}

// addUserToRoom("0", "3").then((res) => {
//   console.log(res)
// });


async function resetUserState(roomId) {
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

// resetUserState("0").then((res) => {
//   console.log(res)
// })

async function setUserState(roomId, userId, state) {
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

// setUserState("0", "3", "not-ready").then((res) => {
//   console.log(res)
// } )



async function isRoomReady(roomId) {
  let res;
  await chatRooms.get(roomId).then((room) => {
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

// isRoomReady("0").then((res)=>{console.log(res)})


async function addMessage(roomId, message) {
  const room = await chatRooms.get(roomId).then((room) => {
    if (room) {
      room.messages.push(message);
      chatRooms.set(roomId, room);
    }
    else {
      throw new Error('Room not found');
    }
  })
}

// addMessage("0", {user:"1", content:"hello"} );

async function getMessages(roomId) {
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

// getMessages("0").then(res => console.log(res))