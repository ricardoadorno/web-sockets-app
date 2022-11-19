import socketIO from "socket.io-client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
// import Rooms from "./Rooms";

const socket = socketIO.connect("http://localhost:4000");

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home socket={socket} />}></Route>
        {/* <Route path="/room/:id" element={<Rooms socket={socket} />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
