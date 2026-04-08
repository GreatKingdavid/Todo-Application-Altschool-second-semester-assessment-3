const { Router } = require('express');
const todo = require('../models/todos');
const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();

/**
 * GET: Display todos based on status filter
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const statusFilter = req.query.status;
    let query = { user: req.user.id };

    if (statusFilter === 'pending' || statusFilter === 'completed') {
      query.status = statusFilter;
    } else {
      // Default: show everything that isn't deleted
      query.status = { $ne: 'deleted' };
    }

    const todos = await todo.find(query).sort({ createdAt: -1 });
    res.render('index', { todos });
  } catch (err) {
    console.error(`[LOG]: Error fetching todos - ${err.message}`);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * POST: Add a new todo
 */
router.post('/add', requireAuth, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).send('Title is required');

    await todo.create({ 
      title: title.trim(), 
      user: req.user.id, 
      status: 'pending' 
    });
    
    res.redirect('/');
  } catch (err) {
    console.error(`[LOG]: Error adding todo - ${err.message}`);
    res.status(400).send('Could not add task');
  }
});

/**
 * POST: Update todo (handles Status toggle, Edit title, and Delete)
 * This route works for both HTML Form submissions and JSON fetch calls
 */
router.post('/update/:id', requireAuth, async (req, res) => {
  try {
    const { status, title } = req.body;
    const updateData = {};

    // Only add fields to the update object if they were sent in the request
    if (status) updateData.status = status;
    if (title) updateData.title = title.trim();

    // Find by ID and ensure it belongs to the logged-in user (Security check)
    const updatedTodo = await todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).send('Task not found or unauthorized');
    }

    // If the request came from our JavaScript 'fetch' (the Edit button)
    if (req.headers['content-type'] === 'application/json') {
      return res.json({ success: true, todo: updatedTodo });
    }

    // Standard redirect for regular Form submissions
    res.redirect('/');
  } catch (err) {
    console.error(`[LOG]: Update failed - ${err.message}`);
    res.status(400).send('Update failed');
  }
});

module.exports = router;
