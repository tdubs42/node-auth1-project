const router = require('express').Router()
const {
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
  hashPassword
} = require('./auth-middleware')
const User = require('../users/users-model')

router.post('/register',
  checkPasswordLength,
  checkUsernameFree,
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

router.post('/login', checkUsernameExists, (req, res) => {
  const {username} = req.body
  res.json({message: `Welcome ${username}`})
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
