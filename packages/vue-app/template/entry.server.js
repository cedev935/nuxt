import { createApp } from 'vue'
import App from './app' // Todo: replace when ~/app.vue exists
import NuxtApp from './nuxt'
import { wrapApp } from './utils'


export default async function createNuxtAppServer(ssrContext = {}) {
	const app = createApp(wrapApp(App))
	const $nuxt = new NuxtApp({ app })

	ssrContext.nuxt = {
		serverRendered: true,
		state: {
			// data, fetch, vuex, etc.
		}
	}
	$nuxt.provide('ssrContext', ssrContext)
	$nuxt.provide('ssrState', ssrContext.nuxt.state)

	// Backward compatibility
	if (ssrContext.req) $nuxt.provide('req', ssrContext.req)
	if (ssrContext.res) $nuxt.provide('res', ssrContext.res)

	// await $nuxt.loadPlugins()

	// call hooks
	// redirect, errors...

	return app
}
