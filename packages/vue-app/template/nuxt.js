import Hookable from 'hable'

export default class NuxtApp extends Hookable {
  constructor({ app }) {
    super()
    this.app = app
  }

  // TODO: Refactor to plugin if possible
  inject(name, impl) {
    const $name = '$' + name
    this.provide($name, impl)
  }

  provide(name, impl) {
    if (this[name]) {
      throw new Error('Service already injected: ' + name)
    }
    if (!impl) {
      throw new Error('Implementation not provided for service: ' + name)
    }
    this.callHook('provide', name, impl)
    this[name] = impl
  }
}
