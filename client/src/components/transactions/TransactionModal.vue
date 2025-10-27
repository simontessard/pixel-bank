<template>
  <VueFinalModal
    v-model="internalShow"
    teleport-to="body"
    :click-to-close="true"
    :esc-to-close="true"
    class="flex justify-center items-center"
    content-class="bg-white rounded-xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
  >
    <div @click.stop>
      <h3 class="text-2xl font-bold text-gray-800 mb-6">Nouvelle transaction</h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Compte</label>
          <select
            v-model="formData.accountId"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Sélectionnez un compte</option>
            <option v-for="account in accounts" :key="account.id" :value="account.id">
              {{ account.name }} ({{ formatAmount(account.balance) }} €)
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select
            v-model="formData.type"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="INCOME">Revenu</option>
            <option value="EXPENSE">Dépense</option>
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
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="0.00"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
          <select
            v-model="formData.category"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Description (optionnelle)</label>
          <input
            v-model="formData.description"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Description de la transaction"
          />
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <div class="flex space-x-3 pt-4">
          <button
            type="button"
            @click="close"
            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="creating"
            class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold disabled:opacity-50"
          >
            {{ creating ? 'Création...' : 'Créer' }}
          </button>
        </div>
      </form>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { VueFinalModal } from 'vue-final-modal';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  accounts: {
    type: Array,
    required: true
  },
  categories: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['close', 'submit']);

const internalShow = computed({
  get: () => props.show,
  set: (val: boolean) => {
    if (!val) emit('close');
  }
});

const formData = ref({
  accountId: '',
  amount: null,
  type: 'EXPENSE',
  category: 'Autre',
  description: ''
});

const error = ref('');
const creating = ref(false);

const close = () => {
  emit('close');
};

const formatAmount = (amount: number) => {
  const n = Number(amount) || 0;
  return n.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const handleSubmit = async () => {
  error.value = '';
  creating.value = true;

  try {
    if (!formData.value.accountId) throw new Error('Compte requis');
    if (!formData.value.amount || Number(formData.value.amount) <= 0) throw new Error('Montant invalide');

    emit('submit', { ...formData.value });

    // Reset form
    formData.value = {
      accountId: '',
      amount: null,
      type: 'EXPENSE',
      category: 'Autre',
      description: ''
    };
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de la création';
  } finally {
    creating.value = false;
  }
};

watch(() => props.show, (newVal) => {
  if (!newVal) {
    error.value = '';
  }
});
</script>
