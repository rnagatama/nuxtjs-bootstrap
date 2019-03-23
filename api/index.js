const https = require('https')
const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const consola = require('consola')
const cors = require('cors')
const app = express()

const dotenvConfig = require('dotenv').config()
const dotenvExpand = require('dotenv-expand')
dotenvExpand(dotenvConfig)

// boot
require('./boot')

// middleware
app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

// API routes
app.use('/api', require('./routes/index'))

const host = process.env.API_HOST
const port = process.env.API_HTTPS_PORT

// Listen the server
// app.listen(port, host)
const privateKey = fs.readFileSync(path.resolve(__dirname, '../server.key'))
const certificate = fs.readFileSync(path.resolve(__dirname, '../server.crt'))
const credentials = { key: privateKey, cert: certificate }
const httpsServer = https.createServer(credentials, app)
httpsServer.listen(port, host, function() {
  consola.ready({
    message: `Server listening on https://${host}:${port}`,
    badge: true
  })
})
