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

// Socket setup
const io = socketio(server, {
  cors: {
    origin: [
      "https://task-manager-ovck.vercel.app",
      "https://task-manager-ovck.vercel.app/",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("New client connected");

  // Join a room based on user ID
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Make io accessible to routes
app.set("io", io);

// Start server - ONLY ONCE using the HTTP server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
