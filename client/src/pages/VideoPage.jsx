import React from "react";
import Chat from "../components/Chat";

function VideoPage({ socket }) {
  return (
    <div>
      <Chat socket={socket} />
      <input type="text" />
    </div>
  );
}

export default VideoPage;
