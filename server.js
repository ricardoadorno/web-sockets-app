const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

let rooms = [];

// types rooms = {roomName: string, videoUrl: string, users: {userId: string, username}[], allMessages: {id: string, userName: string, message: string}[]}

// types storageData = { storeRoomName: string, storeUsername: string, storeUserId: string }

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("createRoom", (room) => {
    const createRoom = {
      roomName: room.roomName,
      videoUrl: room.videoUrl,
      users: [
        {
          userId: socket.id,
          userName: room.userName,
        },
      ],
      allMessages: [],
    };

    if (rooms.find((r) => r.roomName === room.roomName)) {
      console.log("Room already exists");
      return;
    }

    rooms.push(createRoom);
    socket.join(room.roomName);

    io.to(room.roomName).emit("roomCreated", {
      storeRoomName: room.roomName,
      storeUsername: room.userName,
      storeUserId: socket.id,
    });
  });

  socket.on("enterRoom", (enterData) => {
    const { userName, roomCode } = enterData;
    const roomExists = rooms.find((r) => r.roomName === roomCode);
    if (!roomExists || roomExists.users.includes(userName)) {
      console.log("Room not found or user already exists");
      return;
    }

    roomExists.users.push({
      userId: socket.id,
      userName: userName,
    });

    rooms.map((r) => {
      if (r.roomName === roomCode) {
        r.users = roomExists.users;
        r.allMessages.push({
          id: Math.random().toString(36).substr(2, 9),
          userName: userName,
          message: "has joined the room",
        });
      }
    });

    socket.join(roomExists.roomName);
    io.to(roomExists.roomName).emit("roomEntered", {
      storeRoomName: roomExists.roomName,
      storeUsername: userName,
      storeUserId: socket.id,
    });
  });

  socket.on("getRoomData", (roomName) => {
    const room = rooms.find((room) => room.roomName === roomName);

    if (!room) return;

    io.to(roomName).emit("roomDataRequested", room);
  });

  // !

  socket.on("videoState", (stateChange) => {
    console.log(stateChange);
    const { room, time, isPlaying } = stateChange;

    io.to(room).emit("videoStateChanged", {
      time,
      isPlaying,
    });
  });

  //!

  socket.on("newMessage", (data) => {
    const { roomName, userName, message } = data;

    const room = rooms.find((room) => room.roomName === roomName);

    if (!room) {
      console.error("Error room not found");
      return;
    }

    room.allMessages.push({ id: room.allMessages.length, userName, message });

    io.to(roomName).emit("updateChat", {
      messages: room.allMessages,
      users: room.users,
    });
  });

  socket.on("changeVideo", (data) => {
    const { roomName, newVideoUrl } = data;

    rooms.map((room) => {
      if (room.roomName === roomName) {
        room.videoUrl = newVideoUrl;
      }
    });

    io.to(roomName).emit("videoChanged", newVideoUrl);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    rooms.map((room) => {
      if (room.users.find((user) => user.userId === socket.id)) {
        const user = room.users.find((user) => user.userId === socket.id);
        room.users = room.users.filter((user) => user.userId !== socket.id);
        room.allMessages.push({
          id: Math.random().toString(36).substr(2, 9),
          userName: user.userName,
          message: "has left the room",
        });
        io.to(room.roomName).emit("updateChat", {
          messages: room.allMessages,
          users: room.users,
        });
      }
    });

    socket.disconnect();
  });
});

server.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
