const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')
const express = require('express')
// const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const consola = require('consola')
// const cookie = require('cookie')
// const proxy = require('http-proxy-middleware')
const { Nuxt, Builder } = require('nuxt')
const app = express()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// express middleware
app.use(cookieParser())
// app.use(bodyParser.json())
// app.use(
//   bodyParser.urlencoded({
//     extended: true
//   })
// )
// app.use(require('./middleware/auth-token'))
// app.use(require('./middleware/csrf'))
// app.use('/api', function(req, res, next) {
//   let authToken = null
//   let cookieCsrfToken = null
//   let headerCsrfToken = null

//   if (req.headers && req.headers.cookie) {
//     const cookies = cookie.parse(req.headers.cookie)
//     try {
//       authToken = cookies.auth_token
//       cookieCsrfToken = cookies.csrf_token
//       headerCsrfToken = req.headers['x-csrf-token']
//     } catch (err) {
//       // No valid cookie found
//     }
//   }

//   if (authToken) {
//     req.headers.Authorization = 'Bearer ' + authToken
//   }

//   // verify csrf
//   const csrfCheckMethod = config.csfrHttpMethods.indexOf(req.method) > -1
//   if (csrfCheckMethod && cookieCsrfToken !== headerCsrfToken) {
//     return res.status(403).json({
//       error: {
//         message: 'Invalid CSRF token.'
//       }
//     })
//   }

//   next()
// })
// app.use('/api', proxy({ target: 'http://localhost:3001' }))

// routes
// app.use('/', require('./routes/index'))

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const host = process.env.SERVER_HOST
  const httpPort = process.env.SERVER_PORT
  const httpsPort = process.env.SERVER_HTTPS_PORT

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use(function(req, res, next) {
    if (req.secure) {
      // request was via https, so do no special handling
      next()
    } else {
      // request was via http, so redirect to https
      // res.redirect('https://' + req.headers.host + req.url)
      res.redirect(`https://${host}:${httpsPort}${req.url}`)
    }
  })

  // Give nuxt middleware to express
  app.use(nuxt.render)

  app.use(function(err, req, res, next) {
    if (res.headersSent) {
      return next(err)
    }
    console.error(err.stack)
    res.status(500).send('Ooops! Something broke')
  })

  // create http server
  http.createServer(app).listen(httpPort, host, function() {
    consola.ready({
      message: `Server listening on http://${host}:${httpPort}`,
      badge: true
    })
  })

  // create https server
  https
    .createServer(
      {
        key: fs.readFileSync(path.resolve(__dirname, '../server.key')),
        cert: fs.readFileSync(path.resolve(__dirname, '../server.crt'))
      },
      app
    )
    .listen(httpsPort, host, function() {
      consola.ready({
        message: `Server listening on https://${host}:${httpsPort}`,
        badge: true
      })
    })
}
start()
