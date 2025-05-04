const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// Create a new task
router.post("/tasks", auth, async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;

    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      createdBy: req.user.id,
      assignedTo: assignedTo || null,
    });

    const task = await newTask.save();

    // Populate createdBy and assignedTo fields
    await task.populate("createdBy", "name email");
    if (task.assignedTo) {
      await task.populate("assignedTo", "name email");
    }

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get tasks assigned to the authenticated user
router.get("/tasks/assigned", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching assigned tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get tasks created by the authenticated user
router.get("/tasks/created", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching created tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get overdue tasks assigned to the authenticated user
router.get("/tasks/overdue", auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tasks = await Task.find({
      assignedTo: req.user.id,
      dueDate: { $lt: today },
      status: { $ne: "completed" },
    })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching overdue tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a task
router.put("/tasks/:id", auth, async (req, res) => {
  console.log("Task handler");
  try {
    const { title, description, status, priority, dueDate, assignedTo } =
      req.body;

    // Find the task
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user is authorized to update (either creator or assignee)
    if (
      task.createdBy.toString() !== req.user.id.toString() &&
      (task.assignedTo === null ||
        task.assignedTo.toString() !== req.user.id.toString())
    ) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this task" });
    }

    // Update task fields
    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (description) updatedFields.description = description;
    if (status) updatedFields.status = status;
    if (priority) updatedFields.priority = priority;
    if (dueDate) updatedFields.dueDate = dueDate;

    // Only the creator can reassign tasks
    if (assignedTo !== undefined && task.createdBy.toString() === req.user.id) {
      updatedFields.assignedTo = assignedTo || null;
    }

    // Update the task
    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    )
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a task
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    // console.log(task);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    // Only the creator can delete a task
    if (task.createdBy.toString() !== req.user.id.toString()) {
      console.log("Line 151");
      return res
        .status(401)
        .json({ message: "Not authorized to delete this task" });
    }
    console.log("Line 156");
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task removed" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users (for task assignment)
router.get("/users", auth, async (req, res) => {
  try {
    // Import User model here to avoid circular dependencies
    const User = require("../models/User");

    const users = await User.find().select("name email").sort({ name: 1 });

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
