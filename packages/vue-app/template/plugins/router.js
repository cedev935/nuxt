import { ref } from 'vue'
import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'

const Home = () => import('~/pages/index' /* webpackChunkName: "Home" */)
const About = () => import('~/pages/about' /* webpackChunkName: "About" */)
const Custom = () => import('~/pages/custom' /* webpackChunkName: "Custom" */)

export function install (app) {
  const routerHistory = process.client
    ? createWebHistory()
    : createMemoryHistory()

  const router = createRouter({
    history: routerHistory,
    routes: []
  })
  router.addRoute({ path: '/:thing', component: Custom })
  router.addRoute({ path: '/', component: Home })
  router.addRoute({ path: '/about', component: About })

  app.use(router)

  const previousRoute = ref()
  router.afterEach((to, from) => {
    previousRoute.value = from
  })

  Object.defineProperty(app.config.globalProperties, 'previousRoute', {
    get: () => previousRoute.value
  })

  if (process.server) {
    app.$nuxt.hook('server:create', async () => {
      router.push(app.$nuxt.ssrContext.url)
      await router.isReady()
    })
  } else {
    app.$nuxt.hook('client:create', async () => {
      router.push(router.history.location.fullPath)
      await router.isReady()
    })
  }
}

export default {
  install
}
