<template>
  <div class="mb-8">
    <h2 class="text-xl md:text-2xl xl:text-3xl font-bold">
      {{ title }}
    </h2>
    <p class="font-light max-md:text-sm mt-2">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>
