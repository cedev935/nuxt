<template>
  <div class="app">
    <h1>💓 Hello Nuxt 3 💓</h1>
    <button @click="increment">{{ count }}</button>
    <Suspense>
      <template #default>
        <RouterView />
      </template>
      <template #fallback>
        Loading...
        <component v-if="previousRoute && previousRoute.matched.length" :is="previousRoute.matched[0].components.default"></component>
      </template>
    </Suspense>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const count = ref(0);

    function increment() {
      count.value++;
    }

    return { count, increment };
  },

  errorCaptured(error) {
    console.error("Render error:", error);
  }
};
</script>
