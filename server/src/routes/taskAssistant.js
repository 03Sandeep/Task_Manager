// routes/taskAssistant.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/Task");
const User = require("../models/User");

// @route   GET api/assistant/users
// @desc    Get all users for task assignment
// @access  Private
router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select("name email")
      .sort({ name: 1 });

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/assistant/tasks/:type
// @desc    Get tasks by type (assigned, created, overdue)
// @access  Private
router.get("/tasks/:type", auth, async (req, res) => {
  try {
    const { type } = req.params;
    let tasks;

    switch (type) {
      case "assigned":
        tasks = await Task.find({ assignedTo: req.user.id })
          .populate("createdBy", "name email")
          .populate("assignedTo", "name email")
          .sort({ dueDate: 1 });
        break;

      case "created":
        tasks = await Task.find({ createdBy: req.user.id })
          .populate("createdBy", "name email")
          .populate("assignedTo", "name email")
          .sort({ dueDate: 1 });
        break;

      case "overdue":
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        tasks = await Task.find({
          assignedTo: req.user.id,
          dueDate: { $lt: today },
          status: { $ne: "completed" },
        })
          .populate("createdBy", "name email")
          .populate("assignedTo", "name email")
          .sort({ dueDate: 1 });
        break;

      default:
        return res.status(400).json({ msg: "Invalid task type" });
    }

    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

// @route   POST api/assistant/tasks
// @desc    Create a new task via assistant
// @access  Private
router.post("/tasks", auth, async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo } = req.body;

    if (!title || !description || !dueDate) {
      return res
        .status(400)
        .json({ msg: "Title, description and due date are required" });
    }

    const task = new Task({
      title,
      description,
      priority: priority || "medium",
      status: "pending",
      dueDate,
      createdBy: req.user.id,
      assignedTo: assignedTo || null,
    });

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    res.json(populatedTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
