<template>
  <div>
    <p>Home</p>
    <NuxtLink to="/about">
      About Page
    </NuxtLink>
    <NuxtLink to="/hello">
      Hello Page
    </NuxtLink>
    <br>
    <button @click="n++">
      Increment {{ n }}
    </button>
  </div>
</template>

<script>
export default {
  data: () => ({ n: 0 }),
  head: {
    title: 'Home page'
  }

}
</script>
