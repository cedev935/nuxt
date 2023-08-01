import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { createUnplugin } from 'unplugin'
import MagicString from 'magic-string'
import type { Nuxt, NuxtPage } from '@nuxt/schema'
import { NuxtApp } from '@nuxt/schema'
import { hash } from 'ohash'
import { getQuery, withQuery } from 'ufo'
import { resolvePath, tryResolveModule, updateTemplates } from '@nuxt/kit'
import { isVue } from '../core/utils'

const SERVER_ONLY_COMPONENT_SINGLE = /<(ServerOnly|server-only)>/
const SERVER_ONLY_COMPONENT_RE = /<(?<tag>ServerOnly|server-only)>([\s\S]*)<\/\k<tag>>/g
const TEMPLATE_RE = /<template>([\s\S]*)<\/template>/

export const ServerOnlyTransformPlugin = (nuxt: Nuxt) => {
  const componentMap: Record<string, string> = {}

  nuxt.hook('app:templates', (app) => {
    for (const name in componentMap) {
      const path = componentMap[name]

      app.components.push({
        mode: 'server',
        filePath: path,
        pascalName: name,
        kebabName: name,
        export: 'default',
        chunkName: 'components/' + name,
        prefetch: false,
        preload: false,
        shortPath: path,
        island: true
      })
    }
  })

  function scanComponent (code: string, id: string) {
    if (!code) {
      console.log('no code found in', id)
      return
    }
    let i = 0
    for (const _m of code.matchAll(SERVER_ONLY_COMPONENT_RE)) {
      const name = 'I' + hash(id) + i
      componentMap[name] = withQuery(id, { 'server-component': i })
      i++
      console.log('set', name, 'from', id)
    }
  }

  if (!nuxt.options.dev) {
    nuxt.hook('components:extend', async (components) => {
      for (const component of components) {
        let code: string | undefined = nuxt.vfs[component.filePath]
        if (!code) {
          const file = await resolvePath(component.filePath).catch(() => null)
          if (file) {
            code = await readFile(file, 'utf-8').catch(() => undefined)
          }
        }
        scanComponent(code || '', component.filePath)
      }

      for (const name in componentMap) {
        const path = componentMap[name]

        components.push({
          mode: 'server',
          filePath: path,
          pascalName: name,
          kebabName: name,
          export: 'default',
          chunkName: 'components/' + name,
          prefetch: false,
          preload: false,
          shortPath: path,
          island: true
        })
      }
    })
    async function scanPages (routes: NuxtPage[]) {
      for (const route of routes) {
        if (!route.file) { continue }
        const code = nuxt.vfs[route.file] ?? await readFile(await resolvePath(route.file), 'utf-8').catch(() => null)
        scanComponent(code, route.file)
        if (route.children) { await scanPages(route.children) }
      }
    }
    nuxt.hook('pages:extend', async (pages) => {
      await scanPages(pages)
      await updateTemplates({ filter: template => template.filename === 'components.islands.mjs' })
    })
  }

  return createUnplugin(() => {
    return {
      name: 'nuxt:server-only-transform',
      enforce: 'pre',
      transformInclude (id) {
        if (id.includes('server-component')) {
          console.log({ resolved: id })
          return true
        }
        return isVue(id, { type: ['template'] }) ?? getQuery(id)['server-component']
      },
      async transform (code, id) {
        const componentIndex = getQuery(id)['server-component']

        if (!SERVER_ONLY_COMPONENT_SINGLE.test(code) && !componentIndex) { return }

        const s = new MagicString(code)
        if (componentIndex) {
          const index = Number(componentIndex)
          let i = 0

          for (const match of code.matchAll(SERVER_ONLY_COMPONENT_RE)) {
            if (i++ === index) {
              s.replace(TEMPLATE_RE, `<template>${match?.[2]}</template>`)
              break
            }
          }

          if (s.hasChanged()) {
            console.log({ processed: id })
            return {
              code: s.toString(),
              map: nuxt.options.sourcemap.client || nuxt.options.sourcemap.server
                ? s.generateMap({ hires: true })
                : undefined
            }
          }

          return
        }

        let i = 0
        s.replace(SERVER_ONLY_COMPONENT_RE, () => {
          const name = 'I' + hash(id) + i
          componentMap[name] = withQuery(id, { 'server-component': i })
          console.log({ name })
          i++
          return `<NuxtIsland name="${name}" />`
        })

        if (s.hasChanged()) {
          // TODO: not require HMR
          await updateTemplates({ filter: template => template.filename === 'components.islands.mjs' })
          return {
            code: s.toString(),
            map: nuxt.options.sourcemap.client || nuxt.options.sourcemap.server
              ? s.generateMap({ hires: true })
              : undefined
          }
        }
      }
    }
  })
}
