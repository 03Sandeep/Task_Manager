const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();

// Get all users (for task assignment)
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find({}, "name email");
    res.send(users);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
