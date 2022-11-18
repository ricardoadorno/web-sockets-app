const express = require("express");
const app = express();
const http = require("http").Server(app);
const PORT = 4000;
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// ! CONEXÂO
socketIO.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join", (data) => {
    console.log("joining user", data);
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
