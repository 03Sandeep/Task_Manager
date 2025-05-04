import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";
import Assistant from "./assistant/ai";
export default function Dashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("assigned");
  const [searchQuery, setSearchQuery] = useState("");
  //For assistant visibility
  const [showAssistant, setShowAssistant] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    dueDate: "",
  });
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    assignedTo: "",
  });
  const [availableUsers, setAvailableUsers] = useState([]);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/");
          return;
        }

        // Fetch user data
        const userResponse = await axios.get(
          "http://localhost:5000/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData(userResponse.data);

        // Fetch tasks based on active tab
        await fetchTasks(activeTab);

        // Fetch available users for task assignment
        const usersResponse = await axios.get(
          "http://localhost:5000/api/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAvailableUsers(usersResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Session expired or invalid");
        localStorage.removeItem("token");
        router.push("/");
      }
    };

    fetchProtectedData();
  }, [router, activeTab]);

  const fetchTasks = async (tab) => {
    try {
      const token = localStorage.getItem("token");
      let endpoint = "";

      switch (tab) {
        case "assigned":
          endpoint = "http://localhost:5000/api/tasks/assigned";
          break;
        case "created":
          endpoint = "http://localhost:5000/api/tasks/created";
          break;
        case "overdue":
          endpoint = "http://localhost:5000/api/tasks/overdue";
          break;
        default:
          endpoint = "http://localhost:5000/api/tasks/assigned";
      }

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/tasks", newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Task created successfully");
      setShowNewTaskModal(false);
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        assignedTo: "",
      });
      fetchTasks(activeTab);
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Task updated successfully");
      fetchTasks(activeTab);
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Task deleted successfully");
        fetchTasks(activeTab);
      } catch (error) {
        console.error("Error deleting task:", error);
        toast.error("Failed to delete task");
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const filteredTasks = tasks.filter((task) => {
    // Search filter
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus =
      filters.status === "" || task.status === filters.status;

    // Priority filter
    const matchesPriority =
      filters.priority === "" || task.priority === filters.priority;

    // Due date filter (today, this week, this month)
    let matchesDueDate = true;
    if (filters.dueDate !== "") {
      const today = new Date();
      const taskDate = new Date(task.dueDate);

      if (filters.dueDate === "today") {
        matchesDueDate = taskDate.toDateString() === today.toDateString();
      } else if (filters.dueDate === "week") {
        const weekLater = new Date();
        weekLater.setDate(today.getDate() + 7);
        matchesDueDate = taskDate >= today && taskDate <= weekLater;
      } else if (filters.dueDate === "month") {
        const monthLater = new Date();
        monthLater.setMonth(today.getMonth() + 1);
        matchesDueDate = taskDate >= today && taskDate <= monthLater;
      }
    }

    return matchesSearch && matchesStatus && matchesPriority && matchesDueDate;
  });

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Floating Assistant Button */}
      <button
        onClick={() => setShowAssistant(!showAssistant)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-200 z-50 flex items-center justify-center"
        aria-label="Open assistant"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>

      {/* Assistant Component */}
      {showAssistant && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
          <Assistant
            onClose={() => setShowAssistant(false)}
            tasks={tasks}
            user={userData}
            onCreateTask={(taskData) => {
              setNewTask(taskData);
              setShowNewTaskModal(true);
              setShowAssistant(false);
            }}
          />
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Welcome, {userData.name || userData.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 mt-8 pb-16">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Task Management Controls */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <button
                onClick={() => handleTabChange("assigned")}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === "assigned"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Assigned to Me
              </button>
              <button
                onClick={() => handleTabChange("created")}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === "created"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Created by Me
              </button>
              <button
                onClick={() => handleTabChange("overdue")}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === "overdue"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Overdue
              </button>
            </div>
            <button
              onClick={() => setShowNewTaskModal(true)}
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
            >
              Create New Task
            </button>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <div className="w-full md:w-1/3 mb-4 md:mb-0">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  name="priority"
                  value={filters.priority}
                  onChange={handleFilterChange}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <select
                  name="dueDate"
                  value={filters.dueDate}
                  onChange={handleFilterChange}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Due Dates</option>
                  <option value="today">Due Today</option>
                  <option value="week">Due This Week</option>
                  <option value="month">Due This Month</option>
                </select>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="bg-white rounded-lg">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No tasks found.{" "}
                {activeTab === "created" && (
                  <span>Create a new task to get started!</span>
                )}
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    className="border rounded-lg p-4 hover:shadow-md transition duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{task.title}</h3>
                      <div className="flex space-x-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getPriorityClass(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusClass(
                            task.status
                          )}`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{task.description}</p>
                    <div className="flex flex-wrap items-center justify-between text-sm text-gray-500">
                      <div>
                        <span className="mr-4">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        <span>
                          {activeTab === "assigned"
                            ? `Created by: ${task.createdBy?.name || "Unknown"}`
                            : `Assigned to: ${
                                task.assignedTo?.name || "Unassigned"
                              }`}
                        </span>
                      </div>
                      <div className="flex space-x-2 mt-2 md:mt-0">
                        <button
                          onClick={() => {
                            handleUpdateTask(task._id, {
                              ...task,
                              status:
                                task.status === "completed"
                                  ? "pending"
                                  : "completed",
                            });
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          {task.status === "completed"
                            ? "Mark Incomplete"
                            : "Mark Complete"}
                        </button>
                        {activeTab === "created" && (
                          <>
                            <button
                              onClick={() => {
                                // Implement edit task functionality
                                // This would typically open a modal with task details
                                toast.error(
                                  "Edit functionality to be implemented"
                                );
                              }}
                              className="text-yellow-500 hover:text-yellow-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({ ...newTask, priority: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Assign To
                </label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) =>
                    setNewTask({ ...newTask, assignedTo: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a user</option>
                  {availableUsers.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name || user.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
