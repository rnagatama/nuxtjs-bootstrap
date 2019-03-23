const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const dotenvConfig = require('dotenv').config()
const dotenvExpand = require('dotenv-expand')
dotenvExpand(dotenvConfig)
const pkg = require('./package')
const csfrHttpMethods = ['POST', 'PUT', 'DELETE']

module.exports = {
  mode: 'universal',

  csfrHttpMethods: csfrHttpMethods,

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: ['~/assets/style/app.styl'],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: ['@/plugins/vuetify', '~/plugins/axios'],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/auth',
    '@nuxtjs/axios', // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/dotenv',
    // '@nuxtjs/proxy',
    '@nuxtjs/pwa'
  ],

  auth: {
    cookie: {
      prefix: 'auth.',
      options: {
        path: '/',
        expires: process.env.AUTH_EXPIRES_IN_MSEC / 1000 / 60 / 60 / 24, // in day
        sameSite: 'strict',
        secure: true
      }
    },
    redirect: {
      login: '/',
      logout: '/',
      callback: '/',
      home: '/dashboard'
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/api/auth/login',
            method: 'post',
            propertyName: 'token'
          },
          logout: {
            url: '/api/auth/logout',
            method: 'post'
          },
          // user: false
          user: {
            url: '/api/auth/me',
            method: 'get',
            propertyName: 'user'
          }
        },
        tokenRequired: true,
        tokenType: 'Bearer'
      }
    },
    token: {
      prefix: '_token.'
    }
  },

  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: process.env.SERVER_BASE_URL,
    proxy: true
  },

  proxy: {
    '/api': {
      target: process.env.API_BASE_URL,
      secure: false // TODO: set to true for production?
    }
  },

  router: {
    middleware: ['auth']
  },

  serverMiddleware: [
    '~/server/middleware/redirect-https',
    '~/server/middleware/headers'
  ],

  /*
  ** Build configuration
  */
  build: {
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    },
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
