import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LogOn from "./LogOn";
import Room from "./Room";
import "./styles/pico.min.css";

import Socket from "socket.io-client";

const socket = Socket("http://localhost:3000");

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogOn socket={socket} />} />
        <Route path="/room/:roomId" element={<Room socket={socket} />} />
      </Routes>
    </Router>
  );
}

export default App;
