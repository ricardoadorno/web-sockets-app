import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function LogOn({ socket }: any) {
  const userName = useRef<HTMLInputElement>(null);
  const roomName = useRef<HTMLInputElement>(null);
  const videoUrl = useRef<HTMLInputElement>(null);

  const userNameEnter = useRef<HTMLInputElement>(null);
  const roomCodeEnter = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const createRoom = (e: any) => {
    e.preventDefault();
    socket.emit("createRoom", {
      userName: userName.current?.value,
      roomName: roomName.current?.value,
      videoUrl: videoUrl.current?.value,
    });

    socket.on("roomCreated", (storageData: any) => {
      localStorage.setItem("userData", JSON.stringify(storageData));
      navigate(`/room/${storageData.storeRoomName}`);
    });
  };

  const enterRoom = (e: any) => {
    e.preventDefault();
    socket.emit("enterRoom", {
      userName: userNameEnter.current?.value,
      roomCode: roomCodeEnter.current?.value,
    });

    socket.on("roomEntered", (storageData: any) => {
      localStorage.setItem("userData", JSON.stringify(storageData));
      navigate(`/room/${storageData.storeRoomName}`);
    });
  };

  return (
    <div
      className="container grid"
      style={{
        margin: "0 auto",
        textAlign: "center",
        transform: "scale(0.8)",
      }}
    >
      {/* New Room */}
      <article
        style={{
          maxWidth: "500px",
          margin: "4rem auto",
        }}
      >
        <h1>Create a New Room</h1>

        <form
          onSubmit={(e) => {
            createRoom(e);
          }}
        >
          <input
            type="text"
            placeholder="Admin Name"
            ref={userName}
            defaultValue="Admin"
          />

          <input
            type="text"
            placeholder="Room Name"
            ref={roomName}
            defaultValue="Room Name"
          />

          <input
            type="text"
            placeholder="Video Url"
            ref={videoUrl}
            defaultValue="https://www.youtube.com/watch?v=9bZkp7q19f0"
          />

          <button type="submit">Create</button>
        </form>
      </article>
      {/* Log On */}
      <article
        style={{
          maxWidth: "500px",
          margin: "4rem auto",
        }}
      >
        <h1>Enter a Room</h1>

        <form
          onSubmit={(e) => {
            enterRoom(e);
          }}
        >
          <input
            type="text"
            placeholder="User Name"
            ref={userNameEnter}
            defaultValue="Enter User"
          />
          <input
            type="text"
            placeholder="Room's Code"
            ref={roomCodeEnter}
            defaultValue="Room Name"
          />
          <button type="submit">Enter</button>
        </form>
      </article>
    </div>
  );
}

export default LogOn;
