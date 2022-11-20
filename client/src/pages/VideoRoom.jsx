import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function VideoRoom({ socket }) {
  const navigate = useNavigate();

  const [userList, setUserList] = useState([]);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    socket.on("updateUserList", (data) => {
      setUserList(data.users);
      setYoutubeLink(data.videoId);
      setCode(data.userList[0].roomId);
      return () => {
        socket.off("updateUserList");
      };
    });
  }, [socket]);

  const handleLeave = () => {
    socket.emit("leave", { userId: socket.id });
    navigate(`/`, { replace: true });
  };

  return (
    <main className=" flex justify-center content-center h-full mt-14">
      <div className="p-4 mr-8">
        <h1 className="text-xl font-bold underline text-center mt-4 mb-2">
          Sala de Conferência
        </h1>

        <ul className="menu bg-base-100 w-56 gap-1">
          {userList.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
        <button className="btn m-4" onClick={handleLeave}>
          Sair
        </button>
      </div>
      <div>
        <div className="m-4">
          Código da Sala:
          <strong
            className="hover:underline hover:cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(this.state.textToCopy);
            }}
          >
            {code}
          </strong>
          <i className="fa-solid fa-clipboard"></i>
        </div>
        <iframe
          width="709"
          height="399"
          src={`https://www.youtube.com/embed/${youtubeLink}`}
          title="Skyrim - Music & Ambience - Day"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
      <div>
        {
          // TODO fix this new link form
          /* <form action="submit" onSubmit={handleNewLink}>
          <label>Novo Youtube</label>
          <input
            type="text"
            value={newYoutubeLink}
            onChange={(e) => setNewYoutubeLink(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
         */
        }
      </div>
    </main>
  );
}

export default VideoRoom;
