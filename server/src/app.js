require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import modules
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
// const taskRoutes = require("./routes/task");
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Your Next.js frontend URL
    credentials: true,
  })
);
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use("/api", authRoutes);

// app.use("/api", taskRoutes);

// Health check
// app.get("/api/health", (req, res) => res.json({ status: "OK" }));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
