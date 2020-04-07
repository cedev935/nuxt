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
      console.log('vue ssr bundle renderer stuff for resource hints')
      return ''
    }

    ssrContext.renderStyles = () => {
      console.log('vue ssr bundle renderer stuff for styles')
      return ''
    }

    ssrContext.renderScripts = () => {
      console.log('vue ssr bundle renderer stuff for scripts')
      return ''
    }

    return html
  }
}

export function createBundleRenderer (manifest, options) {
  return new VueBundleRenderer(manifest, options)
}
