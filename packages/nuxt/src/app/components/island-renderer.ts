import type { defineAsyncComponent } from 'vue'
import { createVNode, defineComponent } from 'vue'

// @ts-expect-error virtual file
import * as islandComponents from '#build/components.islands.mjs'
import { createError } from '#app/composables/error'

export default defineComponent({
  props: {
    context: {
      type: Object as () => { name: string, props?: Record<string, any> },
      required: true
    }
  },
  setup (props) {
    try {
      const component = islandComponents[props.context.name] as ReturnType<typeof defineAsyncComponent>

      if (!component) {
        const statusMessage = `Island component not found: ${JSON.stringify(props.context.name)}`
        if (process.dev) {
          console.log(statusMessage)
        }
        throw createError({ statusCode: 404, statusMessage })
      }

      return () => createVNode(component || 'span', { ...props.context.props, 'nuxt-ssr-component-uid': '' })
    } catch (e) {
      console.log(e)
      return {}
    }
  }
})
