const mongoose = require('mongoose');
require('dotenv').config();

const messagesDB = mongoose.createConnection(process.env.MONGODBMESSAGES_URI);

module.exports = messagesDB;
