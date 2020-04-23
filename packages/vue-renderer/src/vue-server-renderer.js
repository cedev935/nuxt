import { Script, createContext } from 'vm'
import { renderToString } from '@vue/server-renderer'

class VueBundleRenderer {
  constructor (resources, options) {
    this.resources = resources
    this.options = options

    this.createApp = this.loadEntry()
  }

  loadEntry () {
    const { serverManifest } = this.resources
    const src = serverManifest.files[serverManifest.entry].toString('utf-8')

    const filename = 'server'
    const script = new Script(src, { filename })

    const cjsContext = createContext({
      __filename: 'server',
      __dirname: '/',
      require,
      process,
      setTimeout,
      setInterval,
      module: {}
    })

    script.runInContext(cjsContext)

    const { exports } = cjsContext.module
    return exports.default || exports.module
  }

  async renderToString (ssrContext) {
    const app = await this.createApp(ssrContext)
    const html = await renderToString(app, ssrContext)

    ssrContext.renderResourceHints = () => {
      return '<!-- resource hints -->'
    }

    ssrContext.renderStyles = () => {
      return '<!-- styles -->'
    }

    ssrContext.renderScripts = () => {
      return '<!-- scripts -->'
    }

    return html
  }
}

export function createBundleRenderer (manifest, options) {
  return new VueBundleRenderer(manifest, options)
}
