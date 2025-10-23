<template>
  <div class="mb-8">
    <h2 class="text-3xl font-bold text-gray-800">
      {{ title }}
    </h2>
    <p class="text-gray-600 text-sm mt-2">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>
