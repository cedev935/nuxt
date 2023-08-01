import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ServerOnly',
  inheritAttrs: false,
  setup (_props, { attrs, slots }) {
    return () => slots.default?.()
  }
})
