import { createApp } from 'vue'
import App from '<%= appPath %>'

import { init } from '~nuxt'
import plugins from '.nuxt/plugins.server'

export default async function createNuxtAppServer (ssrContext = {}) {
  const app = createApp(App)

  await init({
    app,
    plugins,
    ssrContext,
  })

  await app.$nuxt.callHook('server:create')

  return app
}
