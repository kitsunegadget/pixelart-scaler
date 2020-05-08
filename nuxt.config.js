export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: 'ドット絵スケーラー',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      },
      {
        name: 'keywords',
        content: '画像,ドット絵,ピクセルアート,Pixelart,拡大,スケールアップ'
      },
      // color
      { name: 'theme-color', content: '#000' },
      // twitter card
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:site', content: '@kitsunegadget' },
      { name: 'twitter:creator', content: '@yuy_az_' },
      { property: 'og:url', content: 'https://pixelart-scaler.web.app' },
      { property: 'og:title', content: 'ドット絵スケーラー -Pixelart Scaler-' },
      { property: 'og:description', content: "Let's scaling your pixel-arts!" },
      { property: 'og:image', content: 'https://pixelart-scaler.web.app/card_min.png' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', type: 'image/png', href: '/icon128.png' }
    ],
    script: [
      { src: '/__/firebase/7.14.2/firebase-app.js' },
      { src: '/__/firebase/7.14.2/firebase-analytics.js' },
      { src: '/__/firebase/init.js' }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#0f0' },
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
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    // 'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    // '@nuxtjs/axios',
    '@nuxtjs/style-resources'
  ],
  styleResources: {
    scss: ['@/assets/variables.scss']
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    analayze: true,
    extend(config, { isDev, isClient }) {
      config.module.rules.push({
        test: /\.worker\.ts$/,
        use: {
          loader: 'worker-loader'
        },
        exclude: /(node_modules)/
      })
      config.output.globalObject = 'this'

      if (isDev || isClient) {
        // config.devtool = 'source-map'
      }
    }
  }
}
