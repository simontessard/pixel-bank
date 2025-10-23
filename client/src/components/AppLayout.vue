<!-- AppLayout.vue -->
<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />

    <main class="container py-10">
      <slot />
    </main>
  </div>
</template>

<script setup>
import Navbar from '@/components/navigation/Navbar.vue';
</script>
