import { createApp } from 'vue'
import App from './app' // Todo: replace when ~/app.vue exists

import nuxt from './plugins/nuxt'

export default async function createNuxtAppServer (ssrContext = {}) {
  const app = createApp(App)
  app.use(nuxt, { ssrContext })

  await app.$nuxt.callHook('server:create')

  return app
}
