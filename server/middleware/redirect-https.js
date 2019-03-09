const host = process.env.SERVER_HOST
const httpsPort = process.env.SERVER_HTTPS_PORT

export default function(req, res, next) {
  if (req.secure) {
    // request was via https, so do no special handling
    next()
  } else {
    // request was via http, so redirect to https
    // res.redirect('https://' + req.headers.host + req.url)
    res.redirect(`https://${host}:${httpsPort}${req.url}`)
  }
}