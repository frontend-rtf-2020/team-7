const mongoose = require('mongoose');

const db = mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
})
    .then (() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

module.exports = db;