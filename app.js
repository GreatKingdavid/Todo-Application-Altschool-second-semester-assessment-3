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
  .then(() => {
    console.log(`[LOG]: Connected to Database: ${mongoose.connection.name}`);
    console.log(`[LOG]: Host: ${mongoose.connection.host}`);
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`[LOG]: Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("[ERROR]: Could not connect to MongoDB!", err);
  });


// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => app.listen(process.env.PORT || 3000))
//   .catch(err => console.log(err));

//   console.log("DEBUG: Connecting to:", mongoose.connection.host);
// console.log("DEBUG: Database Name:", mongoose.connection.name);

  