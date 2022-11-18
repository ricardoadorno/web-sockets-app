import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Home({ socket }) {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("newUser", { userName, youtubeUrl });
    navigate("/chat");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign in to Open Chat</h2>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        name="username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />

      <h2>Sign in to Open Chat</h2>
      <label htmlFor="youtubeurl">Youtube</label>
      <input
        type="text"
        name="youtubeyrl"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
      />
      <button type="submit">SIGN IN</button>
    </form>
  );
}

export default Home;
