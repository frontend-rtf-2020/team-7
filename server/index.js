const express = require('express')
const bodyParser = require('body-parser')
const userRouter = require('./routes/router')
const cors = require('cors')
const app = express()
const db = require('./data/db')
const session = require('./controllers/session')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

const path = require('path')
app.use(express.static(path.join(__dirname, 'client')))
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'client', 'index.html'))
})

app.use('/api', userRouter)

app.listen(process.env.PORT || 3000)
