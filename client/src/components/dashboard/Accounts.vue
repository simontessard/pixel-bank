<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
    <!-- Cartes des comptes existants -->
    <div
      v-for="account in accounts"
      :key="account.id"
      class="bg-white rounded-2xl shadow-xs p-5 md:p-6"
    >
      <div class="flex justify-between items-start mb-4">
        <div>
          <p class="text-xs text-gray-500">
            {{ account.type === 'CHECKING' ? 'Compte Courant' : 'Compte Épargne' }}
          </p>
          <h3 class="text-xl font-semibold text-gray-800">{{ account.name }}</h3>
        </div>
        <span class="px-2.5 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
          {{ account.currency }}
        </span>
      </div>
      <p class="text-2xl md:text-3xl font-bold text-gray-900">
        {{ formatAmount(account.balance) }} €
      </p>
      <p class="text-xs md:text-sm text-gray-500 mt-1">
        {{ account._count?.transactions || 0 }} transactions
      </p>
    </div>

  </div>
</template>

<script setup lang="ts">
defineProps<{
  accounts: Array<{
    id: string;
    name: string;
    type: string;
    currency: string;
    balance: number;
    _count?: {
      transactions: number;
    };
  }>;
}>();

defineEmits<{
  'add-account': [];
}>();

const formatAmount = (amount: number) => {
  return parseFloat(amount.toString()).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
</script>
