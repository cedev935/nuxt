import path from 'path'
import globby from 'globby'
import { dependencies } from '../package.json'

const dir = path.join(__dirname, '..', 'template')
const files = globby.sync(path.join(dir, '/**'))
  .map(f => f.replace(dir + path.sep, '')) // TODO: workaround

export const template = {
  dependencies,
  dir,
  files
}
