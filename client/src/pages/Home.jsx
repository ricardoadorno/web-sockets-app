import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home({ socket }) {
  let navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onHost(userName, youtubeUrl);
  };

  const onHost = async (name, videoId, roomId) => {
    socket.emit("join", {
      roomId: roomId || socket.id,
      name,
      videoId,
      userId: socket.id,
    });

    navigate({
      pathname: `/room/${socket.id}`,
      state: { hostId: socket.id, name, roomId },
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Crie uma sala</h2>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <label htmlFor="youtubeurl">Youtube</label>
        <input
          type="text"
          name="youtubeyrl"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
        />
        <button type="submit">SIGN IN</button>
      </form>

      {/* <form onSubmit={handleSubmit}>
        <h2>Entre em uma sala</h2>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <label htmlFor="youtubeurl">Link</label>
        <input
          type="text"
          name="youtubeyrl"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
        />
        <button type="submit">SIGN IN</button>
      </form> */}
    </>
  );
}

export default Home;
