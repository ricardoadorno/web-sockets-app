class Rooms {
  /* 
        userId = socket.id
        roomId = hosts's socket id
    */
  constructor() {
    this.rooms = {}; // { users: [...{name, id, roomId}], videoURL: ''}
    this.userMap = {}; // maps socket id to rooms
  }

  addRoom(roomId, videoId) {
    if (!this.rooms[roomId]) this.rooms[roomId] = { users: [], videoId };
  }

  getRoom(roomId) {
    return this.rooms[roomId];
  }

  addUser(roomId, name, userId) {
    this.rooms[roomId].users?.push({ name, id: userId, roomId });
    this.userMap[userId] = roomId;
  }

  getUser(userId) {
    const room = this.userMap[userId];
    const users = this.getUserList(room);
    return users.find((user) => user.id === userId);
  }

  // !

  getUserList(roomId) {
    const room = this.rooms[roomId];
    if (room) {
      return room;
    }
  }

  removeUser(userId) {
    const roomId = this.userMap[userId];

    let _user = null;

    if (roomId) {
      // remove user from the room
      const users = this.rooms[roomId]["users"];
      this.rooms[roomId]["users"] = users.filter((user) => {
        if (user.id === userId) {
          _user = user;
        }
        return user.id !== userId;
      });

      // remove user from the user-room mapping
      delete this.userMap[userId];

      // remove room if applicable
      this.removeRoom(roomId);

      return _user;
    }

    return null;
  }

  // !

  setVideoId(roomId, videoId) {
    if (this.rooms[roomId]) {
      this.rooms[roomId]["videoId"] = videoId;
    }
  }

  removeRoom(roomId) {
    if (this.rooms[roomId]["users"].length === 0) delete this.rooms[roomId];
  }

  showInfo() {
    const userMap = Object.keys(this.userMap);
  }
}

module.exports = new Rooms();
