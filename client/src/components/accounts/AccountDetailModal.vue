<template>
  <VueFinalModal
    v-model="internalShow"
    teleport-to="body"
    :clickToClose="true"
    :escToClose="true"
    :height="'auto'"
    :width="'auto'"
    class="flex justify-center items-center"
    overlay-class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    content-class="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
    :aria-label="`Détails du compte ${account?.name || ''}`"
  >
    <div v-if="account" @click.stop>
      <div class="flex justify-between items-start mb-6">
        <div>
          <span
            class="px-2 py-1 rounded-md text-xs font-semibold mb-2 inline-block"
            :class="account.type === 'CHECKING' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'"
          >
            {{ account.type === 'CHECKING' ? 'Courant' : 'Épargne' }}
          </span>
          <h3 class="text-2xl md:text-3xl font-bold text-gray-800">{{ account.name }}</h3>
          <p class="text-2xl md:text-3xl font-bold text-gray-900 mt-4">
            {{ formatAmount(account.balance) }} €
          </p>
        </div>
        <button
          @click="close"
          class="cursor-pointer text-gray-400 font-light md:hover:text-gray-600 text-4xl"
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
  </VueFinalModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VueFinalModal } from 'vue-final-modal';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  account: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);

const internalShow = computed({
  get: () => props.show,
  set: (val: boolean) => {
    if (!val) emit('close');
  }
});

const close = () => {
  emit('close');
};

const formatAmount = (amount: number) => {
  return parseFloat(String(amount)).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};
</script>
