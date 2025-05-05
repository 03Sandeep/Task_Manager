require("dotenv").config();
const express = require("express");
const cors = require("cors");

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
    origin: ["https://task-manager-ovck.vercel.app/"],
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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
