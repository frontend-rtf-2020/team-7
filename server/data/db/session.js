const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
require('dotenv').config();

module.exports = session({
  name: 'MessengerCookie',
  secret: 'oh you find me',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    collection: 'sessions',
  }),
});
