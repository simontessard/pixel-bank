<template>
  <article
    class="relative flex flex-col justify-center items-center bg-white rounded-3xl overflow-hidden shadow-xs p-5 md:p-6"
    aria-label="Balance totale"
  >
    <p class="relative font-light text-sm mt-6 mb-1.5">Balance totale</p>
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
