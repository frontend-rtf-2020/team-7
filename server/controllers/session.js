const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const express = require('express')
const app = express()
require('dotenv').config()

app.use(session({
  secret: 'oh you find me',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    url: process.env.MONGOSESSION_URI
  })
}))
