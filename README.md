# ✅ Todo App Continued

A full-stack task management application built with **Node.js, Express, MongoDB, EJS, and WebSockets**, extending the original Todo App with real-time notifications, due dates, overdue task management, and authenticated WebSocket communication.

This project demonstrates secure authentication, real-time event handling, automated background task updates, and user-specific notifications while maintaining a clean and responsive interface.

---

# 🚀 Features

## Authentication

* Secure user registration and login
* JWT-based authentication
* Protected routes and APIs
* Authenticated WebSocket connections using the same JWT

---

## Task Management

* Create, edit, and delete tasks
* Mark tasks as completed
* Assign due dates to tasks
* View task details and activity timestamps
* Filter tasks by:

  * All
  * Pending
  * Completed
  * Overdue

---

## Due Dates & Overdue Tasks

Every task includes a **Due Date**.

The application automatically monitors tasks and updates their status.

If:

* the due date has passed, and
* the task is still incomplete,

the task automatically changes to an **Overdue** state.

---

## Real-Time Notifications

The application uses **WebSockets** to instantly notify users about task events.

### Overdue Notifications

When a task becomes overdue:

* The task owner receives a real-time WebSocket notification.
* An email notification is sent to the same user.
* Only the owner of the task receives these notifications.

### Task Completion Notifications

When a task is marked as completed:

* The task owner instantly receives a real-time notification.
* Other users are never notified.

---

## Secure WebSocket Communication

WebSocket connections are protected using the same JWT authentication as the REST API.

This ensures:

* Only authenticated users can establish socket connections.
* Notifications are delivered only to authorized users.
* Users only receive updates related to their own tasks.

---

## Offline Support

If a user disconnects:

* No real-time notifications are delivered while offline.
* Task states continue updating on the server.
* Upon reconnection, users immediately see the latest task status, including overdue and completed tasks.

---

## Smart Task Status

Tasks can exist in the following states:

* Pending
* Completed
* Overdue

Status updates occur automatically based on user actions and due dates.

---

## Smart Activity Timestamps

Each task displays relevant timestamps, including:

* Created At
* Updated At
* Completed At
* Due Date

---

## Security

* Users can only access their own tasks.
* Unauthorized task modification is prevented.
* JWT-secured API endpoints.
* JWT-authenticated WebSocket connections.
* Input validation on all user requests.

---

# 🛠 Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Frontend

* EJS
* Vanilla CSS

### Authentication

* JSON Web Tokens (JWT)

### Real-Time Communication

* Socket.IO / WebSockets

### Email Notifications

* Nodemailer

---

# 📊 Database Schema

The application follows a **One-to-Many** relationship.

## User

Stores:

* Name
* Email (Unique)
* Password

## Task

Stores:

* Title
* Description
* Status
* Due Date
* Created At
* Updated At
* Completed At
* User ID (Owner)

---

# 📡 Notification Flow

## Task Becomes Overdue

1. Due date expires.
2. Server automatically updates task status.
3. WebSocket notification is sent to the task owner.
4. Email notification is sent.
5. Task immediately appears as **Overdue**.

---

## Task Completed

1. User marks task as completed.
2. Task status updates.
3. Completion notification is sent via WebSocket.
4. Updated status is reflected across the application.

---

# 📂 Project Structure

```text
.
├── controllers/
├── middleware/
├── models/
├── routes/
├── sockets/
├── services/
│   ├── email/
│   └── scheduler/
├── views/
├── public/
├── utils/
├── app.js
└── README.md
```

---

# ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/GreatKingdavid/Todo-Application-Altschool-second-semester-assessment-3.git

cd Todo-Application-Altschool-second-semester-assessment-3
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root.

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

EMAIL_USER=your_email

EMAIL_PASSWORD=your_email_password

CLIENT_URL=http://localhost:3000
```

Start the application:

```bash
npm start
```

---

# 🌐 Live Demo

https://todo-application-altschool-second.onrender.com/

---

# 📌 Validation

The application validates:

* Empty task titles
* Invalid due dates
* Missing required fields
* Unauthorized task access
* Invalid JWT tokens
* Duplicate users
* Invalid login credentials
* WebSocket authentication
* Task ownership before updates
* Task ownership before deletion

---

# 🎯 Future Improvements

* Push notifications
* Task reminders before due dates
* Calendar integration
* Recurring tasks
* File attachments
* Team collaboration
* Shared task lists
* Dark/Light mode
* Search functionality
* Task labels and priorities

---

# 🎓 Academic Context

This project was developed as part of the **AltSchool Africa Backend Engineering Diploma** program.

The extended version demonstrates proficiency in:

* RESTful API development
* Authentication and Authorization
* MongoDB data modeling
* Real-time communication with WebSockets
* Background task processing
* Email notification services
* Secure application architecture
* CRUD operations
* Event-driven programming
* Full-stack application development

---

# 📄 License

This project is licensed under the MIT License.
