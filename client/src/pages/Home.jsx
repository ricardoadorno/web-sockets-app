import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVideoId } from "../ultilities/getVideoId";

function Home({ socket }) {
  const navigate = useNavigate();

  const [host, setHost] = useState("");
  const [userNew, setUserNew] = useState("");
  const [room, setRoom] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  // get user from the form
  const handleCreateRoom = (e) => {
    e.preventDefault();

    const VideoId = getVideoId(youtubeUrl);

    socket.emit("newRoom", {
      roomId: socket.id,
      userId: socket.id,
      host,
      VideoId,
    });
    navigate(`/room/${socket.id}`, { replace: true });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    socket.emit("addUser", {
      room: room,
      userId: socket.id,
      user: userNew,
    });
    navigate(`/room/${room}`, { replace: true });
  };

  return (
    <main class=" flex-col justify-center content-center max-w-lg m-auto ">
      <h1 className="text-3xl font-bold underline text-center mt-4 mb-2">
        App de Conferências
      </h1>
      <form class="form-control" action="submit" onSubmit={handleAddUser}>
        <h4 className="text-xl text-accent">Entre em uma sala</h4>
        <div className="divider w-32 m-0"></div>
        <label class="label">Nome</label>
        <input
          class="input input-bordered input-sm w-full "
          type="text"
          value={userNew}
          onChange={(e) => setUserNew(e.target.value)}
        />

        <label class="label">Código da Sala</label>
        <input
          class="input input-bordered input-sm w-full "
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />

        <button className="btn btn-primary my-4" type="submit">
          Entrar em Sala
        </button>
      </form>

      <div className="divider m-0 "></div>
      <form class="form-control" action="submit" onSubmit={handleCreateRoom}>
        <h4 className="text-xl text-accent">Crie uma sala</h4>
        <div className="divider w-32 m-0"></div>
        <label class="label">Nome</label>
        <input
          class="input input-bordered input-sm w-full "
          type="text"
          value={host}
          onChange={(e) => setHost(e.target.value)}
        />
        <label class="label">Link do vídeo</label>
        <input
          class="input input-bordered input-sm w-full "
          type="text"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
        />

        <button className="btn btn-secondary my-4" type="submit">
          Criar Sala
        </button>
      </form>
    </main>
  );
}

export default Home;
