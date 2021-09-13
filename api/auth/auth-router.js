const router = require('express').Router()
const bcrypt = require('bcryptjs')
const {
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
  restricted,
  hashPassword
} = require('./auth-middleware')
const User = require('../users/users-model')

router.post('/register',
  checkUsernameFree,
  checkPasswordLength,
  hashPassword,
  (req, res, next) => {
    const {newUser} = req

    User.add(newUser)
      .then(created => res.json({
        user_id: created.user_id,
        username: created.username
      }))
      .catch(next)
  }
)

router.post('/login', (req, res, next) => {
  const {
    username,
    password
  } = req.body
  User.findBy({username})
    .then(user => {
      if (user[0] && bcrypt.compareSync(password, user[0].password)) {
        req.session.user = user
        res.json({message: `Welcome ${username}`})
      } else {
        next({
          status: 401,
          message: 'Invalid credentials'
        })
      }
    })
    .catch(next)
})

router.get('/logout', (req, res, next) => {
  if (req.session.user) {
    req.session.destroy(err => {
      if (err) {
        next(err)
      } else {
        res.json({message: 'logged out'})
      }
    })
  } else {
    res.json({message: 'no session'})
  }
})

/**
 3 [GET] /api/auth/logout

 response for logged-in users:
 status 200
 {
    "message": "logged out"
  }

 response for not-logged-in users:
 status 200
 {
    "message": "no session"
  }
 */


module.exports = router
