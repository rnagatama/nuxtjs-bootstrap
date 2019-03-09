const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const authenticate = require('../middleware/authenticate')
const router = express.Router()

router.post('/token', function(req, res, next) {
  passport.authenticate('local', { session: false }, (err, userId) => {
    if (err) {
      return res.status(400).json({
        error: {
          message: err.message
        }
      })
    }
    req.login(userId, { session: false }, err => {
      if (err) {
        res.send(err)
        return
      }
      // generate a signed-on web token with the contents of user object and return it in the response
      const authExpiresInMsec = parseInt(process.env.AUTH_EXPIRES_IN_MSEC)
      const token = jwt.sign({ userId }, process.env.AUTH_SECRET, {
        expiresIn: authExpiresInMsec / 1000
      })
      return res.json({
        token,
        expires: new Date().getTime() + authExpiresInMsec
      })
    })
  })(req, res)
})

router.get('/me', authenticate, function(req, res) {
  res.json({
    name: 'Riko Nagatama'
  })
})

router.post('/test', authenticate, function(req, res) {
  res.json({
    foo: 'bar'
  })
})

module.exports = router
