# Todo-Application-Altschool-second-semester-assessment-3
Task Management System

A sleek, iOS-inspired task management application built with Node.js, Express, and MongoDB. This project features a dark-themed UI with real-time status updates and user-specific task tracking.

🚀 Features

• User Authentication: Secure Sign Up and Login system.

• Dynamic Dashboard: Task filtering by "All", "Pending", and "Completed".

• Smart Timestamps: Automatically displays "Added at", "Edited at", or "Completed at" based on task activity.

• Clean UI: Dark-mode aesthetic with color-coded status highlights (Yellow for Pending, Blue for All/Completed).

• Security: Users can only view, edit, or delete tasks they created.

🛠 Tech Stack

• Backend: Node.js, Express.js

• Database: MongoDB (via Mongoose)

• Frontend: EJS (Embedded JavaScript templates), Vanilla CSS

• Authentication: JSON Web Tokens (JWT) auth

📊 Database Schema (ERD)

The application follows a One-to-Many relationship between Users and Tasks.

• Users Table: Stores email (Unique), password, and name.

• Tasks Table: Stores task data linked via user_id, including status and timestamps.

Installation & Setup

git clone https://github.com/GreatKingdavid/Todo-Application-Altschool-second-semester-assessment-3
cd your repo name

demo: https://todo-application-altschool-second.onrender.com/

Install dependencies:

1. npm install

2. Environment Variables:
Create a .env file in the root directory and add:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=the_secret_key

3. Run the application:

npm start

📑 Project Structure
├── models/ # Mongoose schemas (User, Todo)
├── routes/ # Express route handlers
├── middleware/ # Authentication guards
├── views/ # EJS templates (Dashboard, Login, Signup)
├── public/ # CSS and static assets
└── app.js # Entry point

🎓 Academic Context

This project was developed as part of a Backend Development diploma program, focusing on CRUD operations, database relationships, and secure API design.

