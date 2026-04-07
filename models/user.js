const mongooes = require("mongoose");
const { type } = require("node:os");

const userschema = new mongooes.Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    unique: true,
  },
});
