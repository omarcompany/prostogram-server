const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
});

module.exports = mongoose.model('token', tokenSchema);
