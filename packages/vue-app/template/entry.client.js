import { createSSRApp } from 'vue'
import App from './app' // Todo: replace when ~/app.vue exists
import nuxt from './plugins/nuxt'


async function initApp() {
  const app = createSSRApp(App)
  app.use(nuxt)

  await app.$nuxt.callHook('client:create')

  app.mount('#__nuxt')

  await app.$nuxt.callHook('client:mounted')

  console.log('App ready:', app)
}

initApp().catch(error => {
  console.error('Error while mounting app:', error)
})
