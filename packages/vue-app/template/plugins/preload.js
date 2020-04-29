export function install (app) {
  app.mixin({
    beforeCreate () {
      const { _registeredComponents } = this.$nuxt.ssrContext
      const { __moduleIdentifier } = this.$options
      _registeredComponents.push(__moduleIdentifier)
    }
  })
}

export default {
  install
}
