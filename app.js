//init app and middlewear
const { json } = require("body-parser");
require("dotenv").config();
require("./utils/logger");

const express = require("express");
const { connectDB } = require("./db");
const logger = require("./utils/logger");
const Todo = require("./models/todos");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//db connect
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on ${PORT} `);
});

//routes
app.get("/", async (req, res) => {
  res.json({ message: "Welcome to username" });
});

//we use this routes to add task
app.post("/tasks", async (req, res) => {
  try {
    const { title, userId } = req.body;
    const newTask = new Todo({
      title: title,
      userId: userId,
    });

    const saveTask = await newTask.save();
    res.status(201).json(saveTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//we use this routes to find all task
app.get("/tasks", async (req, res) => {
  try {
    const todo = await Todo.find({});
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//we use this routes to find one task by it's id
app.get("/tasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Todo.findById(taskId);
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//we use this routes to update a task
app.patch("/tasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const update = req.body;
    const updateTask = await Todo.findByIdAndUpdate(taskId, update, {
      returnDocument: "after",
    });

    if (!updateTask) {
      return res.status(404).json({ message: `Task not found` });
    }
    res.status(200).json(updateTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//we use this routes to delete a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Todo.findByIdAndDelete(taskId);
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
