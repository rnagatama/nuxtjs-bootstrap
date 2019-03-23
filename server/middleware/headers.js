export default function(req, res, next) {
  const CSPPolicies = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    `connect-src 'self' ${process.env.API_BASE_URL}`
  ]
  res.setHeader('X-FRAME-OPTIONS', 'deny') // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  res.setHeader('X-XSS-PROTECTION', '1; mode=block') // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection
  res.setHeader('Content-Security-Policy', CSPPolicies.join(';')) // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
  res.setHeader('Strict-Transport-Security', 'max-age=10') // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  res.setHeader('X-Content-Type-Options', 'nosniff') // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  res.setHeader('Referrer-Policy', 'same-origin') // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  res.setHeader('Feature-Policy', '') // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  next()
}
