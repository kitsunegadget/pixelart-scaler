// const environment = process.env.NODE_ENV || 'development'
require('dotenv').config()
const route = process.env.DEPLOY_ENV === 'GH_PAGES' ? '/pixelart-scaler/' : '/'

export default {
  mode: 'universal',
  router: {
    base: route,
  },
  /*
   ** Headers of the page
   */
  head: {
    base: {
      href: 'router.base',
    },
    title: 'ドット絵スケーラー',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content: '画像,ドット絵,ピクセルアート,Pixelart,拡大,スケールアップ',
      },
      // color
      { name: 'theme-color', content: '#000' },
      // twitter card
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
      { hid: 'twitter:site', name: 'twitter:site', content: '@kitsunegadget' },
      { hid: 'twitter:creator', name: 'twitter:creator', content: '@yuy_az_' },
      { hid: 'og:url', property: 'og:url', content: 'https://kitsunegadget.xyz/' },
      { hid: 'og:title', property: 'og:title', content: 'ドット絵スケーラー -Pixelart Scaler-' },
      {
        hid: 'og:description',
        property: 'og:description',
        content: "Let's scaling your pixel-arts!",
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://kitsunegadget.xyz/pixelart-scaler/card_min.png',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: `${route}favicon.ico` },
      { rel: 'apple-touch-icon', type: 'image/png', href: `${route}icon128.png` },
    ],
    script: [
      //
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#60d3a3' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify',
    '@nuxtjs/dotenv',
    '@nuxtjs/google-analytics',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    // 'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    // '@nuxtjs/axios',
    '@nuxtjs/style-resources',
  ],
  styleResources: {
    scss: ['@/assets/variables.scss'],
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  googleAnalytics: {
    debug: {
      enabled: true,
      sendHitTask: true,
    },

    id: process.env.GOOGLE_ANALYTICS_ID, // your analytics ID
  },
  /*
   ** Build configuration
   */
  build: {
    analayze: true,
    extend(config, { isDev, isClient }) {
      config.module.rules.push({
        test: /\.worker\.ts$/,
        use: {
          loader: 'worker-loader',
        },
        exclude: /(node_modules)/,
      })
      config.output.globalObject = 'this'

      // avoid dotenv error
      config.node = {
        fs: 'empty',
      }

      if (isDev || isClient) {
        // config.devtool = 'source-map'
      }
    },
  },
}
