<template>
	<div>
		<h1>Hello Nuxt 3!</h1>
		<button @click="increment">{{ count }}</button>
	</div>
</template>

<script>
import { ref } from 'vue'

export default {
	setup() {
		const count = ref(0)

		function increment() {
			count.value++
		}

		return { count, increment }
	}
}
</script>
