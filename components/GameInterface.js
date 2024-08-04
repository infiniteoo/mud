import { useState, useEffect } from "react";
import io from "socket.io-client";

let socket;

const GameInterface = ({ character }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    socket = io();

    socket.emit("join", character.id);

    socket.on("message", (msg) => {
      setChat((prevChat) => [...prevChat, msg]);
    });

    socket.on("description", (desc) => {
      setDescription(desc);
    });

    return () => {
      socket.disconnect();
    };
  }, [character.id]);

  const sendCommand = (e) => {
    e.preventDefault();
    socket.emit("command", { command: message });
    setMessage("");
  };

  return (
    <div>
      <div>{description}</div>
      <ul>
        {chat.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <form onSubmit={sendCommand}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter command"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default GameInterface;
