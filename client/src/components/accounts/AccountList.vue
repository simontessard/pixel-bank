<!-- @/components/accounts/AccountsList.vue -->
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div
      v-for="account in accounts"
      :key="account.id"
      class="bg-white rounded-3xl shadow-xs p-6 transition cursor-pointer hover:shadow-md"
      @click="$emit('select', account)"
    >
      <div class="flex justify-between items-start mb-4">
        <div>
          <div class="flex items-center space-x-2 mb-2">
            <span
              class="px-2 py-1 rounded-md text-xs font-semibold"
              :class="account.type === 'CHECKING' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'"
            >
              {{ account.type === 'CHECKING' ? 'Courant' : 'Épargne' }}
            </span>
          </div>
          <h3 class="text-xl md:text-2xl font-bold text-gray-800">{{ account.name }}</h3>
        </div>
      </div>

      <div class="mt-6">
        <p class="text-sm text-gray-500 mb-1">Solde actuel</p>
        <p class="text-2xl md:text-3xl font-numbers tracking-tight font-bold text-gray-900">
          {{ formatAmount(account.balance) }}€
        </p>
      </div>

      <div class="mt-6 pt-4 border-t border-gray-200 flex justify-between text-sm">
        <div>
          <p class="text-gray-500">Transactions</p>
          <p class="font-semibold text-gray-800">{{ account._count?.transactions || 0 }}</p>
        </div>
        <div>
          <p class="text-gray-500">Créé le</p>
          <p class="font-semibold text-gray-800">{{ formatDate(account.createdAt) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  accounts: {
    type: Array,
    required: true
  }
});

defineEmits(['select']);

const formatAmount = (amount) => {
  return parseFloat(amount).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};
</script>
