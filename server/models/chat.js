const mongoose = require('mongoose');
const messagesDB = require('../data/db/messages');

const ChatSchema = new mongoose.Schema({
  room: {
    type: String,
  },
  fromUser: {
    type: String,
  },
  toUser: {
    type: String,
  },
  message: {
    type: String,
  },
  voice: {
    type: String,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

module.exports = messagesDB.model('User', ChatSchema);
