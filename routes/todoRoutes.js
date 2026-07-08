const { Router } = require('express');
const Todo = require('../models/todos');
const { requireAuth } = require('../middleware/authMiddleware');
const { sendCompletionEmail } = require('../utils/mailer');

const router = Router();

// GET All Tasks (with filter)
router.get('/', requireAuth, async (req, res) => {
  try {
    const statusFilter = req.query.status;
    let query = { user: req.user.id };

    if (statusFilter === 'pending' || statusFilter === 'completed' || statusFilter === 'overdue') {
      query.status = statusFilter;
    } else {
      query.status = { $ne: 'deleted' };
    }

    const todos = await Todo.find(query).sort({ updatedAt: -1 });
    res.render('index', { todos, token: req.cookies.jwt });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// POST Add New Task (with dueDate)
router.post('/add', requireAuth, async (req, res) => {
  try {
    const { title, dueDate } = req.body;
    if (!title) return res.status(400).send('Title required');

    await Todo.create({
      title: title.trim(),
      dueDate: dueDate ? new Date(dueDate) : null,
      user: req.user.id,
      status: 'pending'
    });

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(400).send('Failed to add task');
  }
});

// POST Update Task (Complete / Edit / Delete)
router.post('/update/:id', requireAuth, async (req, res) => {
  try {
    const { status, title } = req.body;
    const updateData = {};

    if (status) updateData.status = status;
    if (title) updateData.title = title.trim();

    const updatedTask = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true }
    ).populate('user');

    if (!updatedTask) return res.status(404).send('Task not found');

    // Real-time notification + email for completion
    if (status === 'completed') {
      const { io } = require('../app');
      if (io) io.to(req.user.id.toString()).emit('taskCompleted', { title: updatedTask.title });

      if (updatedTask.user.email) {
        await sendCompletionEmail(updatedTask.user.email, updatedTask);
      }
    }

    if (req.headers['content-type'] === 'application/json') {
      return res.json({ success: true });
    }

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(400).send('Update failed');
  }
});

module.exports = router;