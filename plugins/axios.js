// import cookie from 'cookie'

export default function({ $axios, app, store, redirect }) {
  // $axios.defaults.xsrfCookieName = 'csrf_token'
  // $axios.defaults.xsrfHeaderName = 'x-csrf-token'
  // $axios.onRequest(config => {
  //   console.log(config.headers)
  //   if (process.client && document) {
  //     const cookies = cookie.parse(document.cookie)
  //     config.headers.common['x-csrf-token'] = cookies.csrf_token
  //   }
  // })

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 401) {
      app.$auth.logout()
    }
  })
}
