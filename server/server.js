const express = require("express");
const app = express();
const http = require("http").Server(app);
const PORT = 4000;
const Rooms = require("./ultilities/Rooms");
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

socketIO.on("connection", (socket) => {
  console.log("Client connected");

  // get new user from client
  socket.on("newRoom", (data) => {
    const { roomId, host, userId, VideoId } = data;
    console.log(`User ${host} Created ${roomId} with ${VideoId}`);

    socket.join(roomId);
    Rooms.addRoom(roomId);
    Rooms.addUser(roomId, host, userId);
    Rooms.setVideoId(roomId, VideoId);

    socket.emit("updateUserList", Rooms.getUserList(roomId));
    socket.to(roomId).emit("updateUserList", Rooms.getUserList(roomId));

    console.log(Rooms.getUserList(roomId));
  });

  socket.on("addUser", (data) => {
    const { room, user, userId } = data;
    console.log(`User ${user} Join ${room}`);

    socket.join(room);
    Rooms.addUser(room, user, userId);

    socket.emit("updateUserList", Rooms.getUserList(room));
    socket.to(room).emit("updateUserList", Rooms.getUserList(room));
  });

  socket.on("changeVideo", (data) => {
    const { videoId } = data;
    const user = Rooms.getUser(socket.id);

    Rooms.setVideoId(user.roomId, videoId);
  });

  socket.on("leave", (data) => {
    const { userId } = data;
    const user = Rooms.getUser(userId);
    console.log(`User ${user.name} Leave ${user.roomId}`);

    socket.leave(user.roomId);
    Rooms.removeUser(user.roomId, userId);

    socket.emit("updateUserList", Rooms.getUserList(user.roomId));
    socket
      .to(user.roomId)
      .emit("updateUserList", Rooms.getUserList(user.roomId));
  });

  // TODO fix user disconnect
  socket.on("disconnect", () => {
    const user = Rooms.removeUser(socket.id);

    console.log(`${user?.name} has left`);

    socket
      .to(user?.roomId)
      .emit("updateUserList", Rooms.getUserList(user?.roomId));
  });
});

http.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
