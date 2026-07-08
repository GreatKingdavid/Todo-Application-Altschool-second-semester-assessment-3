const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Helper to create JWT
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'secret_key_from_env', {
        expiresIn: maxAge
    });
};

module.exports.signup_get = (req, res) => {
    res.render('signup');
};

module.exports.login_get = (req, res) => {
    res.render('login');
};

module.exports.signup_post = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.create({ name, email, password });
        const token = createToken(user._id);
        
        // Set the cookie for authentication
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

        // FIX: Redirect to the home page instead of sending res.json
        res.redirect('/');
    } catch (err) {
        console.error(`[AUTH ERROR]: ${err.message}`);
        res.status(400).send('Error creating user. Make sure email is unique.');
    }
};

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        
        res.redirect('/');
    } catch (err) {
        res.status(400).send('Invalid login credentials');
    }
};

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/login');
};