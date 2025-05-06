require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");

// Import modules
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");
const taskAssistantRoutes = require("./routes/taskAssistant");
const app = express();
app.use(express.json());

// Middleware
app.use(
  cors({
    origin: [
      "https://task-manager-ovck.vercel.app",
      "https://task-manager-ovck.vercel.app/",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

// Database connection
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Root path is working!");
});
app.use("/api", authRoutes);
app.use("/api", taskRoutes);
app.use("/api/assistant", taskAssistantRoutes);
app.use("/api/help", (req, res) => {
  res.send("hello");
});

// Create HTTP server
const server = http.createServer(app);

// Socket setup - Updated configuration
const io = socketio(server, {
  cors: {
    origin: [
      "https://task-manager-ovck.vercel.app",
      "https://task-manager-ovck.vercel.app/",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST"],
    credentials: true,
    transports: ["websocket", "polling"], // Explicit transports
  },
  allowEIO3: true, // For compatibility
  pingTimeout: 60000, // Increase timeout
  pingInterval: 25000,
});

// Socket.io connection handler with improved logging
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Join a room based on user ID
  socket.on("join", (userId) => {
    if (!userId) {
      console.error("No userId provided for join");
      return;
    }
    socket.join(userId.toString()); // Ensure string format
    console.log(`User ${userId} joined room ${userId}`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected (${socket.id}): ${reason}`);
  });

  socket.on("error", (err) => {
    console.error(`Socket error (${socket.id}):`, err);
  });
});

// Make io accessible to routes
app.set("io", io);

// Health check endpoint for WebSocket
app.get("/ws-health", (req, res) => {
  res.json({
    activeSockets: io.engine.clientsCount,
    ws: io.engine.ws,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket path: ${io.path()}`);
});
