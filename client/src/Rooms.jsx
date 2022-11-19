import React from "react";
import { useEffect } from "react";
import { useState } from "react";

function Rooms({ socket }) {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    socket.on("updateUserList", (data) => {
      setUserList(data);
    });
  }, [socket]);

  return (
    <div>
      <h1>Rooms</h1>
      <ul>
        {userList.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Rooms;
