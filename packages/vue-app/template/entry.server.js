import createNuxtApp from './main'

export default async function createNuxtAppServer(ssrContext = {}) {
	const $nuxt = await createNuxtApp()

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

	// ~> hook
	// redirect, errors...

	return $nuxt.app
}
