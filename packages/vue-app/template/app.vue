<template>
  <div class="app">
    <h1>Hello Vue + Nuxt 3!</h1>
    <Suspense>
      <template #default>
        <RouterView />
      </template>
      <template #fallback>
        Loading...
        <component
          :is="previousRoute.matched[0].components.default"
          v-if="previousRoute && previousRoute.matched.length"
        />
      </template>
    </Suspense>
  </div>
</template>

<script>
export default {}
</script>

<style>
body,
html {
  background: pink;
  margin: 0;
  padding: 40px;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}
</style>
