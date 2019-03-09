const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const axios = require('axios')
const Promise = require('bluebird')
const Tokens = require('csrf')
const tokens = Promise.promisifyAll(new Tokens())

router.post('/login', bodyParser.json(), function(req, res, next) {
  let cookieExpires = null
  return axios
    .post(process.env.API_BASE_URL + '/api/auth/token', {
      username: req.body.username,
      password: req.body.password
    })
    .then(function(response) {
      cookieExpires = new Date(response.data.expires)

      // set auth token to cookie
      res.cookie('auth_token', response.data.token, {
        expires: cookieExpires,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      })

      // set csrf token to cookie
      return tokens.secretAsync()
    })
    .then(function(secret) {
      const token = tokens.create(secret)
      res.cookie('csrf_token', token, {
        expires: cookieExpires,
        secure: process.env.NODE_ENV === 'production'
      })
      res.send()
    })
    .catch(function(error) {
      clearCookie(res)
      if (error.response && error.response.status) {
        return res.status(error.response.status).json(error.response.data)
      }
      next(error)
    })
})

router.post('/logout', function(req, res, next) {
  clearCookie(res)
  res.send()
})

const clearCookie = function(res) {
  res.clearCookie('auth_token')
  res.clearCookie('csrf_token')
}

module.exports = router
