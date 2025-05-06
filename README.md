📋 Overview
TaskFlow is a comprehensive task management application designed for small teams to efficiently create, assign, track, and manage tasks in real-time. The application provides an intuitive user interface with advanced features like task filtering, real-time notifications, and an AI-powered task assistant.
✨ Features
User Authentication & Security

Secure user registration and login system
Password hashing using bcrypt
JWT-based authentication
Protected routes and API endpoints

Task Management

Complete CRUD Operations:

Create tasks with title, description, due date, priority, and status
View task details and history
Update task information and status
Delete tasks


Priority Levels: Low, Medium, High
Status Tracking: Pending, In Progress, Completed, Overdue

Team Collaboration

Assign tasks to team members
Transfer task ownership
Task history tracking
Comments and discussions on tasks

Dashboard Views

Personalized Dashboard showing:

Tasks assigned to you
Tasks created by you
Overdue tasks



Advanced Search & Filtering

Search by task title or description
Filter tasks by:

Status (All Statuses dropdown)
Priority (All Priorities dropdown)
Due Dates (All Due Dates dropdown)



Task Assistant

Assistant for quick task creation and management
Command-based interface:

"create task" - Add new tasks
"view tasks" - See tasks assigned to you
"created tasks" - See tasks you've created
"overdue tasks" - See your overdue tasks


Dedicated backend routes for assistant operations
Natural language processing for task management
Real-time response and task creation
Interactive UI with command suggestions

Real-time Notifications

Socket.io integration for instant notifications when:

Tasks are assigned to you
Task status changes
Due dates are approaching


User-specific notification rooms
Mark notifications as read or delete them
Persistent notification storage in database
Real-time delivery to connected clients

UI/UX Features

Responsive design for mobile and desktop
Dark mode / Light mode toggle
Intuitive task cards with visual priority indicators
Quick action buttons for common operations
Mark complete functionality

🛠️ Tech Stack

Frontend

Next.js - React framework with server-side rendering
Tailwind CSS - For responsive and customizable UI
Context API - For state management
Axios - For API requests
Socket.io-client - For real-time communication

Backend

Node.js - JavaScript runtime
Express.js - Web application framework
Socket.io - For real-time notifications and updates
JWT - For secure authentication
bcrypt - For password hashing
dotenv - For environment variable management
cors - For cross-origin resource sharing

Database

MongoDB - NoSQL database for flexible data storage
Mongoose - ODM library for MongoDB

Deployment

Vercel - Frontend deployment
Render - Backend deployment

🚀 Installation & Setup
Prerequisites

Node.js (v14.x or higher)
npm or yarn
MongoDB instance

Backend Setup
bash# Clone the repository
git clone https://github.com/yourusername/taskmaster.git

# Navigate to backend directory
cd taskmaster/backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start the server
npm start
# Or for development
npm run dev
Frontend Setup
bash# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your backend API URL

# Start the development server
npm run dev

# Build for production
npm run build
Socket.io Setup
The backend is already configured with Socket.io. Make sure your frontend connects to the Socket.io server:
javascript// In your frontend code
import io from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_API_URL);

// Join user's room for notifications
socket.emit('join', userId);

// Listen for notifications
socket.on('notification', (notification) => {
  // Handle new notification
});
🔧 Configuration
Create a .env file in the backend directory with the following variables:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=24h
NODE_ENV=development
📱 Usage

Register a new account or login with existing credentials
Create tasks using the "Create New Task" button or Task Assistant
Assign tasks to team members
Track task progress from your dashboard
Use filters to sort and find specific tasks
Receive real-time notifications for task updates
Toggle between dark and light mode for your preferred experience

🔍 API Endpoints
Authentication

POST /api/register - Register a new user
POST /api/login - Login and get JWT token
GET /api/user/profile - Get authenticated user profile
GET /api/protected - Protected route example

Tasks

POST /api/tasks - Create a new task
GET /api/tasks/assigned - Get tasks assigned to the authenticated user
GET /api/tasks/created - Get tasks created by the authenticated user
GET /api/tasks/overdue - Get overdue tasks assigned to the authenticated user
PUT /api/tasks/:id - Update a task
DELETE /api/tasks/:id - Delete a task

Task Assistant

GET /api/assistant/users - Get all users for task assignment
GET /api/assistant/tasks/:type - Get tasks by type (assigned, created, overdue)
POST /api/assistant/tasks - Create a new task via assistant

Users

GET /api/users - Get all users (for task assignment)

Notifications

GET /api/notifications - Get user notifications
PUT /api/notifications/:id/read - Mark notification as read
DELETE /api/notifications/:id - Delete a notification

👥 Team Collaboration
TaskMaster is designed for seamless team collaboration:

Team members can see tasks assigned to them
Task creators can track all tasks they've created
Real-time notifications keep everyone updated
Comment system allows for discussion within tasks

🔒 Security Features

Password hashing with bcrypt
JWT authentication for secure API access
Custom middleware for route protection
Role-based authorization for task operations:

Only creators can delete tasks
Only creators or assignees can update tasks
Task reassignment restricted to creators


Input validation and sanitization
Protected routes on both frontend and backend
Secure CORS configuration
Environment variable protection

🌙/☀️ Dark Mode & Light Mode
The application supports both dark and light themes:

Dark mode for reduced eye strain in low-light environments
Light mode for bright environments
System preference detection with manual override option

📊 System Architecture

┌────────────────┐      ┌────────────────────┐      ┌─────────────────┐
│                │      │                    │      │                 │
│  Next.js       │◄────►│  Express.js API    │◄────►│  MongoDB        │
│  Frontend      │      │  Backend           │      │  Database       │
│                │      │                    │      │                 │
└────────┬───────┘      └─────────┬──────────┘      └─────────────────┘
         │                        │
         │                        │
         │                        │
         │                ┌───────▼────────┐
         │                │                │
         └───────────────►│  Socket.io     │
                          │  Server        │
                          │                │
                          └────────────────┘

🚧 Future Enhancements

Kanban board view for tasks
Time tracking functionality
Integration with calendar applications
Mobile application
Advanced reporting and analytics
Role-based access control
Task templates and recurring tasks
File attachments for tasks
Task dependencies and subtasks
Team performance metrics
Integration with popular collaboration tools

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
📞 Contact
For any questions or feedback, please reach out to:

Email: sandeepsinha1210@gmail.com
GitHub: https://github.com/03Sandeep

Developed with ❤️ by Sandeep
