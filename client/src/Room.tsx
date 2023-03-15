import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import { Link, useNavigate } from "react-router-dom";

const extrackVideoId = (url: string) => {
  const videoId = url.split("v=")[1];
  const ampersandPosition = videoId.indexOf("&");
  if (ampersandPosition !== -1) {
    return videoId.substring(0, ampersandPosition);
  }
  return videoId;
};

function Room({ socket }: { socket: any }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  let player = useRef<any>(null);
  const getCurrentPlayer = () => {
    if (player.current) return player.current.getInternalPlayer();
    else return null;
  };

  const navigate = useNavigate();
  const messageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const userStorage = JSON.parse(localStorage.getItem("userData")!);

  const [video, setVideo] = useState<any>("");
  const [usersList, setUsersList] = useState<any>([]);
  const [messagesList, setMessagesList] = useState<any>([]);

  function handleNewMessage(e: any) {
    e.preventDefault();
    socket.emit("newMessage", {
      roomName: userStorage.storeRoomName,
      userName: userStorage.storeUsername,
      message: messageRef.current?.value,
    });

    messageRef.current!.value = "";
  }

  function handleVideoChange() {
    socket.emit("changeVideo", {
      roomName: userStorage.storeRoomName,
      newVideoUrl: videoRef.current?.value,
    });
  }

  function handleDisconnect() {
    localStorage.removeItem("userData");

    socket.emit("disconnect", {});
  }

  useEffect(() => {
    if (!userStorage) {
      navigate("/");
    }

    socket.emit("getRoomData", userStorage.storeRoomName);

    socket.on("roomDataRequested", (data: any) => {
      setVideo(extrackVideoId(data.videoUrl));
      setUsersList(
        data.users.map((user: any) => {
          return user.userName;
        })
      );
      setMessagesList(data.allMessages);
    });
  }, []);

  useEffect(() => {
    socket.on("updateChat", (data: any) => {
      setMessagesList(data.messages);
      setUsersList(data.users.map((user: any) => user.userName));
    });

    socket.on("videoChanged", (data: any) => {
      setVideo(extrackVideoId(data));
    });

    socket.on("videoStateChanged", (data: any) => {
      if (data.isPlaying) {
        getCurrentPlayer()?.playVideo();
        getCurrentPlayer()?.seekTo(data.time);
      } else {
        getCurrentPlayer()?.pauseVideo();
        getCurrentPlayer()?.seekTo(data.time);
      }
    });
  }, [socket]);

  return (
    <main className="container" style={{ padding: "2rem" }}>
      <h4>Room Code: {userStorage && userStorage.storeRoomName}</h4>
      <Link onClick={handleDisconnect} to="/">
        Back
      </Link>

      <div className="grid">
        {/* Chat */}

        <article>
          <h2>chat</h2>
          <ul>
            {messagesList?.map((message: any) => (
              <li key={message.id}>
                <strong>{message.userName}</strong>: {message.message}
              </li>
            ))}
          </ul>
          <form onSubmit={handleNewMessage} className="grid">
            <input
              type="text"
              placeholder="Type your message"
              ref={messageRef}
            />
            <button type="submit">Send</button>
          </form>
          <ul>
            {usersList?.map((user: any) => (
              <li key={user}>{user}</li>
            ))}
          </ul>
        </article>
        <div>
          <h2>
            {" "}
            User:
            {userStorage?.storeUsername}
          </h2>
          <h2>video: {video}</h2>
          {video ? (
            <YouTube
              ref={player}
              videoId={video}
              onStateChange={async (event) => {
                await getCurrentPlayer()
                  .getCurrentTime()
                  .then((time: number) => {
                    socket.emit("videoState", {
                      room: userStorage.storeRoomName,
                      time: time,
                      isPlaying: event.data === YouTube.PlayerState.PLAYING,
                    });
                    // setCurrentTime(time);
                  });
                // setIsPlaying(event.data === YouTube.PlayerState.PLAYING);
              }}
            />
          ) : (
            <h1> Error Fetching Video</h1>
          )}
          <input type="text" placeholder="New Video" ref={videoRef} />
          <button onClick={() => handleVideoChange()}>Change</button>
          <div>
            <p>{isPlaying ? "Playing" : "Paused"}</p>
            <p>
              Minutes: Seconds -{" "}
              {Math.floor(currentTime / 60) +
                ":" +
                Math.floor(currentTime % 60)}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Room;
