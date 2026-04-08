require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');

// Routes
app.use(authRoutes);
app.use(todoRoutes);
app.use(express.static('public'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(`[LOG]: ${new Date().toISOString()} - ERROR: ${err.message}`);
  res.status(500).send('Internal Server Error');
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => app.listen(process.env.PORT || 3000))
  .catch(err => console.log(err));

  