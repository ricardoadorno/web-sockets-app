import React, { useState, useEffect } from "react";

const ChatBar = ({ socket }) => {
  const [users, setUsers] = useState({});

  useEffect(() => {
    socket.on("join", (data) => {
      console.log("join", data);
    });
  }, [socket, users]);

  return (
    <div>
      <h2>Open Chat</h2>
      <div>
        <h4>ACTIVE USERS </h4>
        <div></div>
      </div>
    </div>
  );
};

export default ChatBar;
