import path from 'path'
import { dependencies } from '../package.json'

export const template = {
  dependencies,
  dir: path.join(__dirname, '..', 'template'),
  // TODO: Use globby
  files: [
    'app.vue',
    'entry.client.js',
    'entry.server.js',
    'main.js',
    'nuxt.js',
    'plugins/index.js',
    'plugins/ssr.js',
    'views/app.template.html'
  ]
}
