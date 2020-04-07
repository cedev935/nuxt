import { createApp, h } from 'vue'
import App from './app' // Todo: replace when ~/app.vue exists
import NuxtApp from './nuxt'

export default function createNuxtApp() {
	const app = createApp(App)
	const nuxt = new NuxtApp({ app })
	return nuxt
}
