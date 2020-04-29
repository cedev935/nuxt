<template>
  <div>
    <p>About</p>
    <NuxtLink to="/">
      Home page
    </NuxtLink>
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: process.static ? 'static' : (process.server ? 'server' : 'client')
    }
  },

  async setup () {
    await new Promise(resolve => setTimeout(resolve, process.server ? 100 : 500))
    return {}
  },

  head: {
    title: 'About page'
  }
}
</script>

<style scoped>
  div {
    color: 'red'
  }
</style>
