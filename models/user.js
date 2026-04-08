const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 6 
  }
});

// SUCCESSFUL FIX: Using async without 'next' 
userSchema.pre('save', async function() {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

// Static method to login user
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) return user;
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

// Ensure the model name matches what you use in your controllers
const User = mongoose.model('User', userSchema);
module.exports = User;