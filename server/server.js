const express = require("express");
const app = express();
const http = require("http").Server(app);
const ioUtilities = require("./utilities/io");

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const PORT = process.env.PORT || 4000;

ioUtilities.setupIO(socketIO);

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
