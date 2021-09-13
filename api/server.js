const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const session = require('express-session')
const store = require('connect-session-knex')(session)
const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')

const server = express()

server.use(helmet())
server.use(express.json())
server.use(cors())
server.use(session({
  name: 'chocolatechip',
  secret: 'lettuce taco \'bout it!', /*
  * in the wild you would want your secret, and probably any hardcoded values within
  *  this object, to be within a .env file
  */
  cookie: {
    maxAge: 604800000, // 7 days
    secure: false, // turned off for codegrade testing purposes
  }, // 1 day in milliseconds
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  store: new store({
    knex: require('../data/db-config'),
    tablename: 'taco',
    sidfieldname: 'truck_id',
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  })
}))

server.use('/api/users', usersRouter)
server.use('/api/auth', authRouter)

server.get('/', (req, res) => {
  res.json({api: 'up'})
})

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  })
})

module.exports = server
