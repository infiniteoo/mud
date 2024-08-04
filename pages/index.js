import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket = io("http://localhost:3001");

    socket.on("connect", () => {
      console.log("Connected to socket.io server");
    });

    socket.on("message", (msg) => {
      console.log("Received message:", msg);
      setChat((prevChat) => [...prevChat, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("command", { command: message });
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Text-based MUD</h1>
      <div>
        <ul>
          {chat.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
