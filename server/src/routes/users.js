const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();

// Get all users (for task assignment)
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.user.id } }, // exclude the current user
      "name email" // only return name and email
    );
    res.send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ message: "Server error" });
  }
});

module.exports = router;
