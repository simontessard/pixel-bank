<template>
  <router-link
    :to="to"
    class="border-2 border-gray-100 bg-gray-100 md:hover:bg-gray-200 duration-300 transition-colors size-fit py-1.5 px-3.5
    rounded-3xl text-xs font-medium text-gray-700"
    :aria-label="label"
  >
    {{ label }}
  </router-link>
</template>

<script setup lang="ts">
defineProps<{
  to: string
  label: string
}>()
</script>
