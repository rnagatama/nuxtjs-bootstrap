const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()

const dotenvConfig = require('dotenv').config()
const dotenvExpand = require('dotenv-expand')
dotenvExpand(dotenvConfig)

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
const isProduction = process.env.NODE_ENV === 'production'

// express middleware
app.use(cookieParser())

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const host = process.env.SERVER_HOST
  const httpPort = process.env.SERVER_PORT
  const httpsPort = process.env.SERVER_HTTPS_PORT

  // Build only in dev mode
  if (!isProduction) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // default error handler
  app.use(function(err, req, res, next) {
    if (res.headersSent) {
      return next(err)
    }
    console.error(err.stack)
    res.status(500).send('Ooops! Something broke')
  })

  // create http server
  const httpServer = http.createServer(app)

  // create https server
  const privateKey = fs.readFileSync(path.resolve(__dirname, '../server.key'))
  const certificate = fs.readFileSync(path.resolve(__dirname, '../server.crt'))
  const credentials = { key: privateKey, cert: certificate }
  const httpsServer = https.createServer(credentials, app)

  // start listening
  httpServer.listen(httpPort, host, function() {
    consola.ready({
      message: `Server listening on http://${host}:${httpPort}`,
      badge: true
    })
  })
  httpsServer.listen(httpsPort, host, function() {
    consola.ready({
      message: `Server listening on https://${host}:${httpsPort}`,
      badge: true
    })
  })
}
start()
