const mongoose = require("mongoose");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const express = require('express');
const app = express();

app.use(session({
    secret: 'oh you find me',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        url: 'mongodb+srv://Netwar:hWJQSaV909aGwZu3@cluster0-noog9.mongodb.net/sessions?retryWrites=true&w=majority',
    })
}));