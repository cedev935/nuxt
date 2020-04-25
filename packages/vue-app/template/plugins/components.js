// import { h, defineComponent } from 'vue'
import { Link } from 'vue-router'

// const NuxtLink = defineComponent({
//   extends: Link
// })

function install (app) {
  app.component('NuxtLink', Link)
  app.component('NLink', Link) // TODO: deprecate
}

export default {
  install
}
