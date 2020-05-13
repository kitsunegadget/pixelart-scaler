export default {
  mode: 'universal',
  router: {
    base: process.env.DEPLOY_ENV === 'GH_PAGES' ? '/pixelart-scaler/' : '/',
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
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:site', content: '@kitsunegadget' },
      { name: 'twitter:creator', content: '@yuy_az_' },
      { property: 'og:url', content: 'https://kitsunegadget.xyz/' },
      { property: 'og:title', content: 'ドット絵スケーラー -Pixelart Scaler-' },
      { property: 'og:description', content: "Let's scaling your pixel-arts!" },
      { property: 'og:image', content: 'https://kitsunegadget.xyz/pixelart-scaler/card_min.png' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/pixelart-scaler/favicon.ico' },
      { rel: 'apple-touch-icon', type: 'image/png', href: '/pixelart-scaler/icon128.png' },
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
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify', '@nuxtjs/google-analytics'],
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
    id: 'UA-155410099-1', // your analytics ID
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

      if (isDev || isClient) {
        // config.devtool = 'source-map'
      }
    },
  },
}
