const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dueDate: { type: Date },
  status: {
    type: String,
    enum: ['pending', 'completed', 'deleted', 'overdue'],
    default: 'pending'
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('todo', todoSchema);