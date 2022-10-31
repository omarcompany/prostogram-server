const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLengthL: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
    minLength: 2,
    maxLengthL: 30,
  },
});

module.exports = mongoose.model("user", userSchema);
