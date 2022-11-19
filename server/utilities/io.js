const Rooms = require("./Rooms");

exports.setupIO = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // ! Criar sala
    socket.on("join", (data) => {
      //
      const { name, videoId, userId, roomId } = data;

      console.log(
        `User ${name} joined id ${userId} and video ${videoId} room ${roomId}`
      );

      socket.join(roomId);
      Rooms.addRoom(roomId, videoId);
      Rooms.addUser(roomId, name, userId);

      // * tell everyone in the room to update their userlist

      io.to(roomId).emit("updateUserList", Rooms.getUserList(roomId));
    });

    // * DC
    socket.on("disconnect", () => {
      console.log(`User not: ${socket.id}`);
      socket.disconnect();
    });
  });
};
