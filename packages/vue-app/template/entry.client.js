import createNuxtApp from './main'
import { useSSRContext } from 'vue'

export default async function createNuxtAppServer() {
  const $nuxt = await createNuxtApp()

  const state = window.__NUXT__ || {}
  $nuxt.provide('ssrState', state)

  return $nuxt.app
}

