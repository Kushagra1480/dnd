const chatRooms = new Map();

export function createRoom(roomId) {
  chatRooms.set(roomId, { messages: [], users: new Set() });
}

export function addMessage(roomId, message) {
  const room = chatRooms.get(roomId);
  if (room) {
    room.messages.push(message);
  }
}

export function getMessages(roomId) {
  return chatRooms.get(roomId)?.messages || [];
}

export function roomExists(roomId) {
  return chatRooms.has(roomId);
}

export function addUserToRoom(roomId, userId) {
  const room = chatRooms.get(roomId);
  if (room) {
    room.users.add(userId);
  }
}

export function removeUserFromRoom(roomId, userId) {
  const room = chatRooms.get(roomId);
  if (room) {
    room.users.delete(userId);
    if (room.users.size === 0) {
      chatRooms.delete(roomId);
    }
  }
}