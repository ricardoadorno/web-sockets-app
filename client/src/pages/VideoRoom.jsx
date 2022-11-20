import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getVideoId } from "../ultilities/getVideoId";
import { useNavigate } from "react-router-dom";

function VideoRoom({ socket }) {
  const navigate = useNavigate();

  const [userList, setUserList] = useState([]);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [newYoutubeLink, setNewYoutubeLink] = useState("");

  const handleNewLink = (e) => {
    e.preventDefault();

    const videoId = getVideoId(newYoutubeLink);

    socket.emit("changeVideo", { videoId });
  };

  useEffect(() => {
    socket.on("updateUserList", (data) => {
      setUserList(data.users);
      setYoutubeLink(data.videoId);
      return () => {
        socket.off("updateUserList");
      };
    });
  }, [socket, youtubeLink]);

  const handleLeave = () => {
    socket.emit("leave", { userId: socket.id });
    navigate(`/`, { replace: true });
  };

  return (
    <div>
      <h1>Sala de Conferência</h1>

      <ul>
        {userList.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <br></br>

      <iframe
        width="709"
        height="399"
        src={`https://www.youtube.com/embed/${youtubeLink}`}
        title="Skyrim - Music & Ambience - Day"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>

      <div>
        <form action="submit" onSubmit={handleNewLink}>
          <label>Novo Youtube</label>
          <input
            type="text"
            value={newYoutubeLink}
            onChange={(e) => setNewYoutubeLink(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
        <button onClick={handleLeave}>Sair</button>
      </div>
    </div>
  );
}

export default VideoRoom;
