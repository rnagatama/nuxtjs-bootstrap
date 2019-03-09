const cookie = require('cookie')
const config = require('../../nuxt.config')

export default function(req, res, next) {
  let cookieCsrfToken = null
  let headerCsrfToken = null

  const cookies = cookie.parse(req.headers.cookie)
  cookieCsrfToken = cookies.csrf_token
  headerCsrfToken = req.headers['x-csrf-token']

  // verify csrf
  const csrfCheckMethod = config.csfrHttpMethods.indexOf(req.method) > -1
  if (csrfCheckMethod && cookieCsrfToken !== headerCsrfToken) {
    return res.status(403).json({
      error: {
        message: 'Invalid CSRF token.'
      }
    })
  }

  next()
}
