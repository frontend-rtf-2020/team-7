const mongoose = require('mongoose');

const db = mongoose.connect('mongodb+srv://Netwar:hWJQSaV909aGwZu3@cluster0-noog9.mongodb.net/Users?retryWrites=true&w=majority', {
    useNewUrlParser: true,
})
    .then (() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

module.exports = db;