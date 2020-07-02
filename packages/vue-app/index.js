const path = require('path')
const globby = require('globby')
const { dependencies } = require('./package.json')

const dir = path.join(__dirname, '.nuxt')
const files = globby.sync(path.join(dir, '/**'))
  .map(f => f.replace(dir + path.sep, '')) // TODO: workaround

exports.template = {
  dependencies,
  dir,
  files
}
