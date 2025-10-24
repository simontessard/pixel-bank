<template>
  <div class="min-h-screen flex items-center justify-end">
    <WelcomeScreen/>

    <div class="min-h-screen flex flex-col items-center justify-center bg-white w-full lg:w-1/2 p-8 overflow-hidden">
      <Transition :name="transitionName" mode="out-in">
        <router-view :key="$route.path" />
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import WelcomeScreen from "@/components/common/WelcomeScreen.vue";

const route = useRoute();
const transitionName = ref('slide-left');

watch(() => route.path, (newPath, oldPath) => {
  // Si on va de login vers register : slide vers la gauche
  if (oldPath === '/auth/login' && newPath === '/auth/register') {
    transitionName.value = 'slide-left';
  }
  // Si on va de register vers login : slide vers la droite
  else if (oldPath === '/auth/register' && newPath === '/auth/login') {
    transitionName.value = 'slide-right';
  }
});
</script>

<style scoped>
/* Transition vers la gauche (login → register) */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.4s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Transition vers la droite (register → login) */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s ease;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
