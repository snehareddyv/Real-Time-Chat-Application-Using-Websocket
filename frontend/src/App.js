import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socket = useRef(null);

  const joinRoom = () => {
    if (!room) return;
    socket.current = new WebSocket(`ws://localhost:8000/ws/${room}`);

    socket.current.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    setJoined(true);
  };

  const sendMessage = () => {
    if (socket.current && message.trim()) {
      socket.current.send(message);
      setMessages((prev) => [...prev, `You: ${message}`]);
      setMessage("");
    }
  };

  return (
    <div className="App">
      <h2>Real-Time Chat</h2>
      {!joined ? (
        <div>
          <input
            placeholder="Enter Room ID"
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <>
          <h4>Room: {room}</h4>
          <div className="chat-box">
            {messages.map((msg, idx) => (
              <div key={idx} className="chat-msg">
                {msg}
              </div>
            ))}
          </div>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button onClick={sendMessage}>Send</button>
        </>
      )}
    </div>
  );
}

export default App;
