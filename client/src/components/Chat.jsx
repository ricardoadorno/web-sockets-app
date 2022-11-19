import React, { useEffect, useState } from "react";

function Chat({ socket }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("newUserResponse", (data) => setUsers(data));
  }, [socket, users]);

  return (
    <>
      <div>
        <h2>Open Chat</h2>
        <div>
          <h4>ACTIVE USERS</h4>
          <div>
            {users.map((user) => (
              <p key={user.socketID}>{user.userName}</p>
            ))}
          </div>
        </div>
      </div>
      {/* <form onSubmit={onMessageSend}>
        <input
          type="text"
          placeholder="Send a message!"
          style={{ fontSize: "0.8em", fontWeight: 500 }}
          value={message}
          onChange={onMessageChange}
          required
        />
        <button type="submit" style={sendButtonStyle}>
          Send
        </button>
      </form> */}
    </>
  );
}

export default Chat;
