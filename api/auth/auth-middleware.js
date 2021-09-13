const bcrypt = require('bcryptjs')
const User = require('../users/users-model')

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    next({
      status: 401,
      message: 'You shall not pass!'
    })
  }
}

async function checkUsernameFree(req, res, next) {
  const {username} = req.body
  User.findBy({username})
    .then(taken => {
      if (taken.length === 0) {
        next()
      } else {
        next({
          status: 422,
          message: 'Username taken'
        })
      }
    })
    .catch(next)
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
function checkUsernameExists(req, res, next) {

}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  const {password} = req.body

  if (password.length > 3) {
    next()
  }
  if (!password || password.length < 3) {
    next({
      status: 422,
      message: 'Password must be longer than 3 chars'
    })
  }
}

function hashPassword(req, res, next) {
  const {
    username,
    password
  } = req.body
  const hash = bcrypt.hashSync(password, 10)
  req.newUser = {
    username,
    password: hash
  }
  next()
}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {
  restricted,
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree,
  hashPassword
}
