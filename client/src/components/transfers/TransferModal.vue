<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click="$emit('close')"
  >
    <div class="bg-white rounded-xl p-8 max-w-md w-full" @click.stop>
      <h3 class="text-2xl font-bold text-gray-800 mb-6">Nouveau virement</h3>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Depuis le compte</label>
          <select
            v-model="formData.fromAccountId"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="">Sélectionnez un compte</option>
            <option v-for="account in accounts" :key="account.id" :value="account.id">
              {{ account.name }} ({{ formatAmount(account.balance) }} €)
            </option>
          </select>
        </div>

        <div class="text-center">
          <div class="inline-flex items-center justify-center size-10 rounded-full bg-purple-100 text-purple-600 text-2xl">
            ↓
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Vers le compte</label>
          <select
            v-model="formData.toAccountId"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="">Sélectionnez un compte</option>
            <option
              v-for="account in accounts"
              :key="account.id"
              :value="account.id"
              :disabled="account.id === formData.fromAccountId"
            >
              {{ account.name }} ({{ formatAmount(account.balance) }} €)
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Montant (€)</label>
          <input
            v-model.number="formData.amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-lg font-semibold"
            placeholder="0.00"
          />
          <p v-if="formData.fromAccountId && formData.amount" class="text-xs text-gray-500 mt-1">
            Solde restant: {{ calculateRemainingBalance() }} €
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Description (optionnelle)</label>
          <input
            v-model="formData.description"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="Motif du virement"
          />
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <div class="flex space-x-3 pt-2">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-semibold disabled:opacity-50"
          >
            {{ loading ? 'Virement...' : 'Effectuer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  accounts: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close', 'submit']);

const formData = ref({
  fromAccountId: '',
  toAccountId: '',
  amount: null,
  description: ''
});

const formatAmount = (amount) => {
  const n = Number(amount) || 0;
  return n.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const calculateRemainingBalance = () => {
  const account = props.accounts.find(a => a.id === formData.value.fromAccountId);
  if (!account || !formData.value.amount) return '0.00';
  const remaining = account.balance - formData.value.amount;
  return formatAmount(remaining);
};

const handleSubmit = () => {
  emit('submit', { ...formData.value });
};

// Réinitialiser le formulaire quand la modal se ferme
watch(() => props.show, (newShow) => {
  if (!newShow) {
    formData.value = {
      fromAccountId: '',
      toAccountId: '',
      amount: null,
      description: ''
    };
  }
});
</script>
