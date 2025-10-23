<template>
   <div class="bg-white rounded-2xl shadow-xs p-5 md:p-6 lg:w-1/2 h-fit">
    <h3 class="text-lg font-bold text-gray-800 mb-4">Transactions récentes</h3>

    <div v-if="transactions.length === 0" class="text-center py-8 text-gray-500">
      Aucune transaction pour le moment
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="transaction in limitedTransactions"
        :key="transaction.id"
        class="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-xl transition"
      >
        <div class="flex items-center space-x-4">
          <div
            class="size-8 rounded-full flex items-center justify-center"
            :class="transaction.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'"
          >
            <span :class="transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'">
              {{ transaction.type === 'INCOME' ? '↓' : '↑' }}
            </span>
          </div>
          <div>
            <p class="font-medium text-sm text-gray-800">{{ transaction.category }}</p>
            <p class="text-sm text-gray-500">{{ formatDate(transaction.date) }}</p>
          </div>
        </div>
        <div class="text-right">
          <p
            class="font-semibold text-lg"
            :class="transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'"
          >
            {{ transaction.type === 'INCOME' ? '+' : '-' }}{{ formatAmount(transaction.amount) }}€
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  transactions: Array<{
    id: string;
    type: string;
    category: string;
    description?: string;
    amount: number;
    date: string;
  }>;
  limit?: number;
}>();

const limitedTransactions = computed(() => {
  const limit = props.limit || 5;
  return props.transactions.slice(0, limit);
});

const formatAmount = (amount: number) => {
  return parseFloat(amount.toString()).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};
</script>
