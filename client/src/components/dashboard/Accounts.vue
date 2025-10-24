<template>
  <div class="grid grid-cols-1 gap-4">
    <!-- Carte du compte avec le plus d'argent -->
    <div
      v-for="account in richestAccount"
      :key="account.id"
      class="bg-white rounded-3xl shadow-xs p-5 md:p-6"
    >
      <div class="flex justify-between items-start mb-3">
        <div>
          <p class="text-xs text-gray-500">
            {{ account.type === 'CHECKING' ? 'Compte Courant' : 'Compte Épargne' }}
          </p>
          <h3 class="text-xl font-medium text-gray-800">{{ account.name }}</h3>
        </div>
        <ViewAllButton to="/accounts" label="Voir tous mes comptes" />
      </div>
      <p class="text-xl md:text-2xl font-semibold font-numbers tracking-tight text-gray-900">
        {{ formatAmount(account.balance) }}€
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ViewAllButton from "@/components/common/ViewAllButton.vue";

const props = defineProps<{
  accounts: Array<{
    id: string;
    name: string;
    type: string;
    currency: string;
    balance: any; // Decimal | number | string
    _count?: { transactions: number };
  }>;
}>();

// helper : récupère une valeur numérique depuis Decimal / number / string
const num = (v: any): number => {
  if (v == null) return 0;
  // si objet Decimal (Prisma or decimal.js) : utilise toNumber() ou toString() en fallback
  if (typeof v === 'object') {
    if (typeof v.toNumber === 'function') return v.toNumber();
    if (typeof v.toString === 'function') return parseFloat(v.toString());
  }
  return Number(v);
};

const richestAccount = computed(() => {
  const list = props.accounts ?? [];
  if (list.length === 0) return [];

  let max = list[0];
  let maxVal = num(max.balance);

  for (const a of list) {
    const val = num(a.balance);
    if (val > maxVal) {
      maxVal = val;
      max = a;
    }
  }

  return [max]; // tableau pour le v-for dans le template
});

const formatAmount = (amount: any) => {
  const n = num(amount);
  return n.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
</script>
