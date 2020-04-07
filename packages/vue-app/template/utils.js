import { h } from 'vue'

export function wrapApp(App) {
	return {
		render() {
      return h('div', {
        id: '__nuxt'
      }, [h(App)])
		}
	}
}
