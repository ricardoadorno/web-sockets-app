const express = require("express");
const app = express();
const http = require("http").Server(app);
const PORT = 4000;
const Rooms = require("./Rooms");
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

socketIO.on("connection", (socket) => {
  console.log("Client connected");

  // get new user from client
  socket.on("newRoom", (data) => {
    const { roomId, user, userId } = data;
    console.log(`User ${user} Created ${roomId}`);

    socket.join(roomId);
    Rooms.addRoom(roomId);
    Rooms.addUser(roomId, user, userId);

    console.log(Rooms.getRoom(roomId));
  });

  socket.on("addUser", (data) => {
    console.log(data);
    const { room, user, userId } = data;
    console.log(`User ${user} Join ${room}`);

    socket.join(room);
    Rooms.addUser(room, user, userId);

    socket.to(room).emit("updateUserList", Rooms.getUserList(room));
  });

  //   socket.on("message", (message) => {
  //     console.log("Message received: ", message);
  //     socketIO.emit("message", message);
  //   });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

http.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
