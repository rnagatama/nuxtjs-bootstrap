const cookie = require('cookie')

export default function(req, res, next) {
  const cookies = cookie.parse(req.headers.cookie)
  const authToken = cookies.auth_token

  console.log(authToken)
  if (authToken) {
    req.headers.Authorization = 'Bearer ' + authToken
  }

  next()
}
