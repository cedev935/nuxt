import { h } from 'vue'

export function wrapApp(App) {
	return {
		render() {
      return h('div', {
        id: '<%= globals.id %>'
      }, [h(App)])
		}
	}
}
