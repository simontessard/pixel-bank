<template>
   <div class="bg-white rounded-3xl shadow-xs p-5 md:p-6 h-fit">

     <div class="flex justify-between mb-4">
       <h3 class="text-lg font-semibold text-gray-800">Transactions récentes</h3>

       <ViewAllButton to="/transactions" label="Voir tout" />
     </div>

    <div v-if="transactions.length === 0" class="text-center py-8 text-gray-500">
      Aucune transaction pour le moment
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="transaction in limitedTransactions"
        :key="transaction.id"
        class="grid grid-cols-8 items-center transition"
      >
        <div class="col-span-2 flex items-center space-x-3">
          <div
            class="shrink-0 size-7 rounded-full flex items-center justify-center"
            :class="transaction.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'"
          >
            <span class="text-sm" :class="transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'">
              {{ transaction.type === 'INCOME' ? '↓' : '↑' }}
            </span>
          </div>
          <div>
            <p class="font-medium text-sm text-gray-800">{{ transaction.category }}</p>
          </div>
        </div>

        <p class="col-span-3 mx-auto text-xs md:text-sm text-gray-500">{{ formatDate(transaction.date) }}</p>

        <p class="col-span-3 ml-auto font-medium font-numbers tracking-tight">
            {{ transaction.type === 'INCOME' ? '+' : '-' }}{{ formatAmount(transaction.amount) }}€
        </p>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ViewAllButton from "@/components/common/ViewAllButton.vue";

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
