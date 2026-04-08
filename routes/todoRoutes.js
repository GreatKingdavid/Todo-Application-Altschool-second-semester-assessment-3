const { Router } = require('express');
const Todo = require('../models/todos');
const { requireAuth } = require('../middleware/authMiddleware'); // <--- Correct Destructured Import

const router = Router();

// GET: Display all todos for the logged-in user
router.get('/', requireAuth, async (req, res) => {
  try {
    const statusFilter = req.query.status;
    let query = { user: req.user.id };

    // Apply filtering if status is pending or completed
    if (statusFilter === 'pending' || statusFilter === 'completed') {
      query.status = statusFilter;
    } else {
      // Default view: Show everything except deleted
      query.status = { $ne: 'deleted' };
    }

    const todos = await Todo.find(query).sort({ createdAt: -1 });
    res.render('index', { todos });
  } catch (err) {
    console.error(`[LOG]: Error fetching todos - ${err.message}`);
    res.status(500).send('Internal Server Error');
  }
});

// POST: Add a new todo
router.post('/add', requireAuth, async (req, res) => {
  try {
    const { title } = req.body;
    await Todo.create({ 
      title, 
      user: req.user.id, 
      status: 'pending' 
    });
    res.redirect('/');
  } catch (err) {
    console.error(`[LOG]: Error adding todo - ${err.message}`);
    res.status(400).send('Could not add task');
  }
});

// POST: Update todo status (Pending/Completed/Deleted)
router.post('/update/:id', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    await Todo.findByIdAndUpdate(req.params.id, { status });
    res.redirect('/');
  } catch (err) {
    console.error(`[LOG]: Error updating todo - ${err.message}`);
    res.status(400).send('Update failed');
  }
});

module.exports = router;