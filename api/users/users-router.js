const router = require('express').Router()
const User = require('./users-model')
const {restricted} = require('../auth/auth-middleware')

router.get('/', restricted, (req, res, next) => {
  User.find()
    .then(all => res.json(all))
    .catch(next)
})

module.exports = router
