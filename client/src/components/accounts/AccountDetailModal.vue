<template>
  <div
    v-if="account"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click="$emit('close')"
  >
    <div class="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
      <div class="flex justify-between items-start mb-6">
        <div>
          <span
            class="px-3 py-1 rounded-full text-xs font-semibold mb-2 inline-block"
            :class="account.type === 'CHECKING' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'"
          >
            {{ account.type === 'CHECKING' ? 'Courant' : 'Épargne' }}
          </span>
          <h3 class="text-3xl font-bold text-gray-800">{{ account.name }}</h3>
          <p class="text-4xl font-bold text-gray-900 mt-4">
            {{ formatAmount(account.balance) }} €
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
      </div>

      <div class="border-t border-gray-200 pt-6">
        <h4 class="font-semibold text-gray-800 mb-4">Transactions récentes</h4>

        <div v-if="!account.transactions || account.transactions.length === 0" class="text-center py-8 text-gray-500">
          Aucune transaction
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="transaction in account.transactions"
            :key="transaction.id"
            class="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <p class="font-semibold text-gray-800">{{ transaction.category }}</p>
              <p class="text-sm text-gray-500">{{ transaction.description || 'Sans description' }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ formatDate(transaction.date) }}</p>
            </div>
            <p
              class="font-bold text-lg"
              :class="transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'"
            >
              {{ transaction.type === 'INCOME' ? '+' : '-' }}{{ formatAmount(transaction.amount) }} €
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  account: {
    type: Object,
    default: null
  }
});

defineEmits(['close']);

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
