const passport = require('passport')
const passportJWT = require('passport-jwt')
const LocalStrategy = require('passport-local').Strategy
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    function(username, password, cb) {
      // this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
      if (username === 'riko' && password === 'rikokeren') {
        return cb(null, 'id1')
      }

      return cb(new Error('Invalid username or password.'))
    }
  )
)

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.AUTH_SECRET
    },
    function(jwtPayload, cb) {
      return cb(null, { userId: jwtPayload.userId })
    }
  )
)
