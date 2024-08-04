const express = require("express");
const next = require("next");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const expressApp = express();

  expressApp.use(
    cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
    })
  );

  const server = http.createServer(expressApp);
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  let players = {};
  let rooms = {
    start: {
      description: "You are in a small room. There is a door to the north.",
      exits: { north: "northRoom" },
      players: [], // Track players in this room
    },
    northRoom: {
      description: "You are in a northern room. There is a door to the south.",
      exits: { south: "start" },
      players: [], // Track players in this room
    },
  };

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    players[socket.id] = { location: "start" };
    rooms["start"].players.push(socket.id);

    socket.emit("message", rooms["start"].description);

    socket.on("command", (data) => {
      console.log("Received data:", data);
      console.log(`Received data: ${JSON.stringify(data)}`);
      if (!data || typeof data.command !== "string") {
        socket.emit("message", "Invalid command.");
        return;
      }

      const { command } = data;
      console.log(`Received command from ${socket.id}: ${command}`);
      const player = players[socket.id];

      if (command.startsWith("move")) {
        const direction = command.split(" ")[1];
        const currentRoom = rooms[player.location];
        if (currentRoom.exits[direction]) {
          // Remove player from current room
          currentRoom.players = currentRoom.players.filter(
            (id) => id !== socket.id
          );

          // Update player's location
          player.location = currentRoom.exits[direction];
          const newRoom = rooms[player.location];

          // Add player to new room
          newRoom.players.push(socket.id);
          socket.emit("message", newRoom.description);
        } else {
          socket.emit("message", "You can't go that way.");
        }
      } else if (command.startsWith("/say")) {
        const message = command.slice(5).trim(); // Remove "/say " prefix and trim
        if (message) {
          const currentRoom = rooms[player.location];
          currentRoom.players.forEach((id) => {
            io.to(id).emit("message", `${socket.id} says: ${message}`);
          });
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
      const playerLocation = players[socket.id].location;
      rooms[playerLocation].players = rooms[playerLocation].players.filter(
        (id) => id !== socket.id
      );
      delete players[socket.id];
    });
  });

  expressApp.all("*", (req, res) => handle(req, res));

  server.listen(3001, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3001");
  });
});
