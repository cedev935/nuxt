import { createSSRApp } from 'vue'
import NuxtApp from './nuxt'
import { wrapApp } from './utils'
import App from './app' // Todo: replace when ~/app.vue exists

async function initApp() {
  const app = createSSRApp(App)
  const $nuxt = new NuxtApp({ app })

  const state = window.__NUXT__ || {}
  $nuxt.provide('ssrState', state)

  $nuxt.app.mount('#__nuxt')
  console.log('app ready', app)
}

initApp().catch(error => {
  console.error('Error while mounting app:', error)
})
