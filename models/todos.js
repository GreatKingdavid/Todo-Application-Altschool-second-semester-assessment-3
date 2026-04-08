const mongoose = require('mongoose'); // <--- THIS WAS MISSING

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return v.length > 0 && /[a-zA-Z0-9]/.test(v);
      },
      message: 'Please enter a valid task name.'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'deleted'],
    default: 'pending'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Todo', todoSchema);