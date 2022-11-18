import React from "react";
import UserBar from "../components/UserBar";

function VideoPage({ socket }) {
  return (
    <div>
      <UserBar socket={socket} />
    </div>
  );
}

export default VideoPage;
