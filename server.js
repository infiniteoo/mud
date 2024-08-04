// server.js

const express = require("express");
const next = require("next");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { supabase } = require("./db");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const saltRounds = 10;

app.prepare().then(() => {
  const expressApp = express();
  expressApp.use(express.json());
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

  // Account creation
  expressApp.post("/api/signup", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and password are required.");
    }

    const { data: existingUser, error: existingUserError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUserError && existingUserError.code !== "PGRST116") {
      return res.status(500).send(existingUserError.message);
    }

    if (existingUser) {
      return res.status(400).send("Email is already registered.");
    }

    const passwordHash = await bcrypt.hash(password, saltRounds);
    const { data, error } = await supabase
      .from("users")
      .insert({ email, password_hash: passwordHash })
      .select()
      .single();

    if (error) {
      return res.status(500).send(error.message);
    }

    res.status(201).send(data);
  });

  // Login
  expressApp.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and password are required.");
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      return res.status(500).send(error.message);
    }

    if (!user) {
      return res.status(400).send("Invalid email or password.");
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(400).send("Invalid email or password.");
    }

    // For simplicity, we're not using JWT tokens or sessions in this example.
    // You can extend this logic to include session management.
    res.status(200).send(user);
  });

  // List Characters
  expressApp.get("/api/characters", async (req, res) => {
    const { user_id } = req.query;
    const { data, error } = await supabaseAdmin
      .from("characters")
      .select("*")
      .eq("user_id", user_id);
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
  });

  // Create Character
  expressApp.post("/api/characters", async (req, res) => {
    const { name, user_id } = req.body;
    const { data, error } = await supabaseAdmin
      .from("characters")
      .insert([{ name, user_id }]);
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
  });

  // Delete Character
  expressApp.delete("/api/characters/:id", async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from("characters")
      .delete()
      .eq("id", id);
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
  });
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle other socket events...

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  expressApp.all("*", (req, res) => handle(req, res));

  server.listen(3001, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3001");
  });
});
