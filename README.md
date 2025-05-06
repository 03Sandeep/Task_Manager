TaskFlow is a comprehensive task management system designed for small teams to efficiently create, assign, track, and manage tasks. The application provides an intuitive interface with real-time notifications and robust filtering capabilities to enhance team productivity.

✨ Features
🔐 User Authentication

-Secure registration and login system
-JWT-based authentication
-Password hashing for enhanced security
-Session management

📝 Task Management

-Full CRUD operations for tasks
-Task attributes include:

Title
-Description
-Due date
-Priority levels (High, Medium, Low)
Status tracking (Pending, In Progress, Completed)



👥 Team Collaboration

Assign tasks to team members
Real-time notifications via Socket.io
Notification management (mark as read, delete)

📊 Dashboard Views

Tasks assigned to you
Tasks created by you
Overdue tasks
Task completion status

🔍 Search and Filter System

Search by task title or description
Advanced filtering:

Status (All, Pending, In Progress, Completed)
Priority (All, High, Medium, Low)

🤖 Task Assistant

Interactive chat-based task assistant
Quick command system:

create task - Add new tasks
view tasks - See assigned tasks
created tasks - View tasks you've created
overdue tasks - Check overdue items



🌓 Appearance

Dark mode and light mode support
Responsive design for all device sizes

🛠️ Tech Stack
Frontend

Next.js - React framework for server-side rendering and static generation
React - UI component library
Tailwind CSS - Utility-first CSS framework
Socket.io Client - Real-time client-server communication

Backend

Node.js - JavaScript runtime
Express - Web application framework
Socket.io - Real-time event-based communication
MongoDB - NoSQL database
Mongoose - MongoDB object modeling
JWT - JSON Web Tokens for authentication
bcrypt - Password hashing

📦 Installation
bash# Clone the repository
git clone https://github.com/yourusername/taskflow.git

# Navigate to project directory
cd taskflow

# Install dependencies for backend
cd server
npm install

# Install dependencies for frontend
cd ../client
npm install
⚙️ Configuration
Create a .env file in the server directory:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
Create a .env.local file in the client directory:
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
🚀 Running the Application
bash# Start backend server
cd server
npm run dev

# Start frontend in a new terminal
cd client
npm run dev
The application will be available at:

Frontend: http://localhost:3000
Backend API: http://localhost:5000

🔒 Security Features

JWT-based authentication
Password hashing with bcrypt
Input validation and sanitization
Protected API routes
Secure HTTP-only cookies
CORS protection

🧪 Testing
bash# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
🚧 Future Enhancements

Calendar view for better deadline visualization
Task dependencies and subtasks
File attachments
Advanced reporting and analytics
Team performance metrics
Mobile application

👨‍💻 Contributing

Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
🙏 Acknowledgements


Next.js
Express
Socket.io
MongoDB
Tailwind CSS

📞 Contact
For any questions or feedback, please reach out to:

Email: sandeepsinha1210@gmail.com

Developed with ❤️ by Sandeep
