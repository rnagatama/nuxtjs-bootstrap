import cookie from 'cookie'

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    if (req) {
      if (req.headers && req.headers.cookie) {
        const parsedCookie = cookie.parse(req.headers.cookie)
        try {
          const token = parsedCookie.auth_token
          if (token) {
            commit('auth/LOGIN')
          }
        } catch (err) {
          // No valid cookie found
        }
      }
    }
  }
}
