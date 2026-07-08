const { Router } = require('express');
const todo = require('../models/todos');
const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();

/**
 * GET: Display todos with optional status filtering
 */
router.get('/', requireAuth, async (req, res) => {
    try {
        const { status } = req.query;
        let query = { user: req.user.id };

        // Filter logic for All, Pending, and Completed
        if (status === 'pending' || status === 'completed') {
            query.status = status;
        } else {
            // "All" view hides deleted items
            query.status = { $ne: 'deleted' };
        }

        const todos = await todo.find(query).sort({ updatedAt: -1 });
        res.render('index', { todos });
    } catch (err) {
        console.error(`[LOG]: Error fetching tasks: ${err.message}`);
        res.status(500).send('Server Error');
    }
});

/**
 * POST: Add a new task
 */
router.post('/add', requireAuth, async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) return res.status(400).send('Task title is required');

        await todo.create({
            title: title.trim(),
            user: req.user.id,
            status: 'pending'
        });

        res.redirect('/');
    } catch (err) {
        console.error(`[LOG]: Error creating task: ${err.message}`);
        res.status(400).send('Could not create task');
    }
});

/**
 * POST: Update task (Handles Title Edit, Status Toggle, and Deletion)
 */
router.post('/update/:id', requireAuth, async (req, res) => {
    try {
        const { status, title } = req.body;
        const updateData = {};

        if (status) updateData.status = status;
        if (title) updateData.title = title.trim();

        // findOneAndUpdate updates the document AND triggers the 'updatedAt' timestamp
        const updatedTask = await todo.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            updateData,
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).send('Task not found or unauthorized');
        }

        // Check if the request is from the AJAX/Fetch (Edit button)
        if (req.headers['content-type'] === 'application/json') {
            return res.json({ success: true });
        }

        // Otherwise, redirect for standard HTML Form submissions
        res.redirect('/');
    } catch (err) {
        console.error(`[LOG]: Update failed: ${err.message}`);
        res.status(400).send('Update failed');
    }
});

module.exports = router;