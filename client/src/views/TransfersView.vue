<template>
  <AppLayout>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h2 class="text-3xl font-bold text-gray-800">Virements</h2>
        <p class="font-light mt-2">Transférez de l'argent entre vos comptes</p>
      </div>
      <button
        @click="showTransferModal = true"
        class="px-5 py-2.5 text-sm cursor-pointer bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition"
      >
        + Nouveau virement
      </button>
    </div>

    <!-- Aperçu des comptes -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div
        v-for="account in accounts"
        :key="account.id"
        class="bg-white rounded-xl shadow-xs p-6 transition"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <p class="text-sm text-gray-500">{{ account.type === 'CHECKING' ? 'Compte Courant' : 'Compte Épargne' }}</p>
            <p class="font-semibold text-gray-800 text-lg">{{ account.name }}</p>
          </div>
          <div
            class="size-10 rounded-full flex items-center justify-center text-lg"
            :class="{
              'bg-blue-100 text-blue-600': account.type === 'CHECKING',
              'bg-green-100 text-green-600': account.type === 'SAVINGS',
              'bg-purple-100 text-purple-600': account.type === 'INVESTMENT'
            }"
          >
            {{ account.type === 'CHECKING' ? '💳' : account.type === 'SAVINGS' ? '🏦' : '📈' }}
          </div>
        </div>
        <p class="text-2xl font-bold text-gray-900">{{ formatAmount(account.balance) }} €</p>
      </div>
    </div>

    <!-- Historique des virements -->
    <div class="bg-white rounded-xl shadow-xs p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold text-gray-800">Historique des virements</h3>
        <div class="flex items-center space-x-2">
          <label class="text-sm text-gray-600">Compte:</label>
          <select
            v-model="filterAccountId"
            @change="loadTransfers"
            class="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
          >
            <option value="">Tous les comptes</option>
            <option v-for="account in accounts" :key="account.id" :value="account.id">
              {{ account.name }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
      </div>

      <div v-else-if="transfers.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">⇄</div>
        <p class="text-gray-500 text-lg mb-2">Aucun virement pour le moment</p>
        <p class="text-gray-400 text-sm">Commencez par effectuer votre premier virement</p>
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="transfer in transfers"
          :key="transfer.id"
          class="rounded-lg transition"
        >
          <div class="flex justify-between items-center">
            <div class="flex items-start space-x-4 flex-1">
              <div class="size-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl font-bold flex-shrink-0">
                ⇄
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2 mb-1">
                  <span class="font-semibold text-gray-800">{{ transfer.fromAccount?.name || 'Compte source' }}</span>
                  <span class="text-gray-400">→</span>
                  <span class="font-semibold text-gray-800">{{ transfer.toAccount?.name || 'Compte cible' }}</span>
                </div>
                <p class="text-sm text-gray-600">{{ transfer.description || 'Virement interne' }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ formatDate(transfer.date) }}</p>
              </div>
            </div>
            <div class="text-right ml-4 flex-shrink-0">
              <p class="font-semibold text-purple-600 text-xl font-numbers tracking-tight">
                {{ formatAmount(transfer.amount) }} €
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Nouveau virement -->
    <div
      v-if="showTransferModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="showTransferModal = false"
    >
      <div class="bg-white rounded-xl p-8 max-w-md w-full" @click.stop>
        <h3 class="text-2xl font-bold text-gray-800 mb-6">Nouveau virement</h3>

        <form @submit.prevent="handleTransfer" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Depuis le compte</label>
            <select
              v-model="newTransfer.fromAccountId"
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
              v-model="newTransfer.toAccountId"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="">Sélectionnez un compte</option>
              <option
                v-for="account in accounts"
                :key="account.id"
                :value="account.id"
                :disabled="account.id === newTransfer.fromAccountId"
              >
                {{ account.name }} ({{ formatAmount(account.balance) }} €)
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Montant (€)</label>
            <input
              v-model.number="newTransfer.amount"
              type="number"
              step="0.01"
              min="0.01"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-lg font-semibold"
              placeholder="0.00"
            />
            <p v-if="newTransfer.fromAccountId && newTransfer.amount" class="text-xs text-gray-500 mt-1">
              Solde restant: {{ calculateRemainingBalance() }} €
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description (optionnelle)</label>
            <input
              v-model="newTransfer.description"
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
              @click="closeModal"
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="creating"
              class="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-semibold disabled:opacity-50"
            >
              {{ creating ? 'Virement...' : 'Effectuer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { accountsAPI, transactionsAPI } from '@/services/api';
import AppLayout from '@/components/AppLayout.vue';

const loading = ref(true);
const creating = ref(false);
const accounts = ref([]);
const transfers = ref([]);
const showTransferModal = ref(false);
const filterAccountId = ref('');
const error = ref('');

const newTransfer = ref({
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

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const calculateRemainingBalance = () => {
  const account = accounts.value.find(a => a.id === newTransfer.value.fromAccountId);
  if (!account || !newTransfer.value.amount) return '0.00';
  const remaining = account.balance - newTransfer.value.amount;
  return formatAmount(remaining);
};

const loadAccounts = async () => {
  try {
    const response = await accountsAPI.getAll();
    accounts.value = response.data || [];
  } catch (err) {
    console.error('Erreur chargement comptes:', err);
  }
};

const loadTransfers = async () => {
  try {
    loading.value = true;
    const params = { type: 'TRANSFER' };
    if (filterAccountId.value) {
      params.accountId = filterAccountId.value;
    }

    const response = await transactionsAPI.getAll(params);
    transfers.value = response.data || [];
  } catch (err) {
    console.error('Erreur chargement virements:', err);
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  showTransferModal.value = false;
  error.value = '';
  newTransfer.value = {
    fromAccountId: '',
    toAccountId: '',
    amount: null,
    description: ''
  };
};

const handleTransfer = async () => {
  error.value = '';

  // Validations
  if (!newTransfer.value.fromAccountId) {
    error.value = 'Veuillez sélectionner un compte source';
    return;
  }
  if (!newTransfer.value.toAccountId) {
    error.value = 'Veuillez sélectionner un compte cible';
    return;
  }
  if (newTransfer.value.fromAccountId === newTransfer.value.toAccountId) {
    error.value = 'Les comptes source et cible doivent être différents';
    return;
  }
  if (!newTransfer.value.amount || newTransfer.value.amount <= 0) {
    error.value = 'Veuillez saisir un montant valide';
    return;
  }

  // Vérifier le solde
  const fromAccount = accounts.value.find(a => a.id === newTransfer.value.fromAccountId);
  if (fromAccount && newTransfer.value.amount > fromAccount.balance) {
    error.value = 'Solde insuffisant sur le compte source';
    return;
  }

  creating.value = true;

  try {
    await transactionsAPI.transfer(newTransfer.value);
    closeModal();
    await Promise.all([loadAccounts(), loadTransfers()]);
  } catch (err) {
    console.error('Erreur virement:', err);
    error.value = err.response?.data?.error || 'Erreur lors du virement';
  } finally {
    creating.value = false;
  }
};

onMounted(async () => {
  await Promise.all([loadAccounts(), loadTransfers()]);
});
</script>

<style scoped>
.font-numbers {
  font-variant-numeric: tabular-nums;
}
</style>
