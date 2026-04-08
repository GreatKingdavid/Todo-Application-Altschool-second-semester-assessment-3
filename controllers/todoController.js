const Todo = require('../models/Todo');

module.exports.add_todo = async (req, res) => {
    const { title } = req.body;

    // 1. Safety check for nonsense/empty
    if (!title || title.trim().length < 1) {
        return res.redirect('/');
    }

    try {
        // 2. CRITICAL: You must include the user ID from the session/token
        await Todo.create({ 
            title: title.trim(), 
            user: req.user.id // This is usually where the bug is!
        });
        res.redirect('/');
    } catch (err) {
        // 3. Debugging: This will tell you EXACTLY why it didn't add
        console.error("ADD ERROR:", err.message);
        res.redirect('/');
    }
};