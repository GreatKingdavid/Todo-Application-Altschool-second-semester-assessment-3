require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const cron = require('node-cron');
const nodemailer = require('nodemailer');

const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const Todo = require('./models/todos');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');

// Routes
app.use(authRoutes);
app.use(todoRoutes);

// Socket.io with JWT Auth
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Invalid token'));
    socket.userId = decoded.id;
    next();
  });
});

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.userId}`);
  socket.join(socket.userId);

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.userId}`);
  });
});

// Background Overdue Checker
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const overdueTasks = await Todo.find({
      dueDate: { $lt: now },
      status: 'pending'
    }).populate('user');

    for (const task of overdueTasks) {
      task.status = 'overdue';
      await task.save();

      io.to(task.user._id.toString()).emit('taskOverdue', {
        taskId: task._id,
        title: task.title
      });

     // Email
if (task.user.email) {
  sendOverdueEmail(task.user.email, task);
}
    }
  } catch (err) {
    console.error('Overdue check failed:', err);
  }
});

// email function
async function sendOverdueEmail(email, task) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Todo App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🚨 Overdue Task: ${task.title}`,
      html: `
        <h2>Your task is overdue!</h2>
        <p><strong>${task.title}</strong></p>
        <p>Due date was: ${new Date(task.dueDate).toLocaleString()}</p>
      `
    });
    console.log(`Email sent to ${email}`);
  } catch (e) {
    console.error('Email failed:', e.message);
  }
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    server.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT || 3000}`);
    });
  })
  .catch(err => console.log(err));

module.exports = { io };
