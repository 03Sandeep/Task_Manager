const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");
const Notification = require("../models/Notification");

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

      // Create notification if task is assigned to someone
      if (task.assignedTo._id.toString() !== req.user.id.toString()) {
        const notification = new Notification({
          recipient: task.assignedTo._id,
          sender: req.user.id,
          task: task._id,
          message: `You've been assigned a new task: "${task.title}"`,
        });

        await notification.save();

        // Emit notification to the recipient
        req.app
          .get("io")
          .to(task.assignedTo._id.toString())
          .emit("notification", {
            _id: notification._id,
            message: notification.message,
            task: {
              _id: task._id,
              title: task.title,
            },
            sender: {
              _id: req.user.id,
              name: req.user.name,
            },
            createdAt: notification.createdAt,
          });
      }
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
      // console.log("Line 151");
      return res
        .status(401)
        .json({ message: "Not authorized to delete this task" });
    }
    // console.log("Line 156");
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
    const User = require("../models/User");

    const users = await User.find({ _id: { $ne: req.user.id } }) // exclude logged-in user
      .select("name email")
      .sort({ name: 1 });

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//For notifications
router.get("/notifications", auth, async (req, res) => {
  try {
    console.log("Line 213");
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .populate("sender", "name")
      .populate("task", "title");
    console.log(notifications);
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/notifications/:id/read", auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add this new route for deleting notifications
router.delete("/notifications/:id", auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user.id, // Only allow recipient to delete
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
