const User = require('../models/user');
const jwt = require('jsonwebtoken');

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 3 * 24 * 60 * 60
  });
};

module.exports.signup_get = (req, res) => res.render('signup');

module.exports.login_get = (req, res) => res.render('login');

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    
    res.cookie('jwt', token, { 
      httpOnly: true, 
      maxAge: 3 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    res.status(201).json({ user: user._id });
  } 
  catch (err) {
    console.error("Signup error:", err);
    let errorMessage = 'Registration failed';
    if (err.code === 11000) errorMessage = 'That email is already registered';
    res.status(400).json({ error: errorMessage });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    
    res.cookie('jwt', token, { 
      httpOnly: true, 
      maxAge: 3 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    res.status(200).json({ user: user._id });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(400).json({ error: 'Invalid credentials' });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/login');
};