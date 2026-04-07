const mongooes = require("mongoose");

const theTodoSchema = new mongooes.Schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  user: {
    type: mongooes.Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = mongooes.model('Todo', theTodoSchema)
