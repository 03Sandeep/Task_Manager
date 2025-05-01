require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import your existing modules
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In your server's app.js
app.use(
  cors({
    origin: "http://localhost:3000", // Your Next.js frontend URL
    credentials: true,
  })
);

// Database connection (using your existing connectDB)
connectDB();

// Routes (using your existing route files)
app.use("/api", authRoutes);
app.use("/api", protectedRoutes);

// Health check
// app.use("/api", (req, res) => res.json({ status: "OK" }));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
