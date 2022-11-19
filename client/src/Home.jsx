import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home({ socket }) {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [userNew, setUserNew] = useState("");
  const [room, setRoom] = useState("");

  // get user from the form
  const handleCreateRoom = (e) => {
    e.preventDefault();
    socket.emit("newRoom", {
      roomId: socket.id,
      userId: socket.id,
      user,
    });
    navigate("/chat", { replace: true });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    socket.emit("addUser", {
      room: room,
      userId: socket.id,
      user: userNew,
    });
  };

  return (
    <div>
      <form action="submit" onSubmit={handleCreateRoom}>
        <label>Old Username</label>
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
      <form action="submit" onSubmit={handleAddUser}>
        <label>New Username</label>
        <input
          type="text"
          value={userNew}
          onChange={(e) => setUserNew(e.target.value)}
        />

        <label>Room</label>
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Home;
