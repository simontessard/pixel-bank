<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />

    <Transition name="fade-up" mode="out-in">
      <router-view :key="$route.path" />
    </Transition>
  </div>
</template>

<script setup>
import Navbar from "@/components/navigation/Navbar.vue";
</script>

<style scoped>
/* Transition fade verticale */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.5s ease;
}

/* L'élément entrant vient du dessous */
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

/* L'élément sortant part vers le haut */
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
