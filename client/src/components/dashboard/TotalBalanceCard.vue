<template>
  <article
    class="relative flex flex-col justify-center items-center bg-white rounded-3xl overflow-hidden shadow-xs p-5 md:p-6"
    aria-label="Balance totale"
  >
    <div class="absolute w-1/3 h-30 blur-3xl top-4 right-0 bg-gradient-to-b from-green-200 to-emerald-300 rounded-full"></div>
    <p class="relative mb-2 font-light mt-6">Balance totale</p>
    <p class="relative text-2xl md:text-3xl font-numbers tracking-tight font-semibold mb-6">
      {{ formattedTotalBalance }}€
    </p>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  totalBalance: number;
}>();

const formattedTotalBalance = computed(() =>
  Number(props.totalBalance).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
);
</script>
