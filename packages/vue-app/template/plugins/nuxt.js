import Hookable from 'hable'

import router from './router'
import state from './state'
import components from './components'
import legacy from './legacy'
import { defineGetter } from '../utils'

class Nuxt extends Hookable {
  constructor({ app, ssrContext, globalName }) {
    super()
    this.app = app
    this.ssrContext = ssrContext
    this.globalName = globalName
    this.provide('nuxt', this)
  }

  provide(name, value) {
    const $name = '$' + name
    defineGetter(this.app, $name, value)
    defineGetter(this.app.config.globalProperties, $name, value)
  }
}

function install(app, { ssrContext, globalName = 'nuxt' } = {}) {
  const nuxt = new Nuxt({ app, ssrContext, globalName })

  // app.use(offline) // TODO
  app.use(state)
  app.use(router)
  app.use(components)
  app.use(legacy)
}

export default {
  install
}
