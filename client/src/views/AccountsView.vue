<template>
  <AppLayout>
    <div class="mb-8 flex max-md:flex-col gap-4 justify-between md:items-center">
      <div>
        <h2 class="text-3xl font-bold text-gray-800">Mes Comptes</h2>
        <p class="font-light mt-2">Gérez tous vos comptes bancaires</p>
      </div>
      <button
        @click="showAddAccountModal = true"
        class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 size-fit cursor-pointer text-sm text-white rounded-full font-medium transition flex items-center space-x-2"
      >
        <span class="text-lg">+</span>
        <span>Nouveau compte</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>

    <!-- Liste des comptes -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="account in accounts"
        :key="account.id"
        class="bg-white rounded-xl shadow-xs p-6 transition cursor-pointer"
        @click="selectAccount(account)"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <div class="flex items-center space-x-2 mb-2">
              <span
                class="px-3 py-1 rounded-full text-xs font-semibold"
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
          <p class="text-3xl md:text-4xl font-bold text-gray-900">
            {{ formatAmount(account.balance) }} <span class="text-2xl text-gray-500">€</span>
          </p>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-200 flex justify-between text-sm">
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

    <!-- Modal Ajouter un compte -->
    <div
      v-if="showAddAccountModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showAddAccountModal = false"
    >
      <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4" @click.stop>
        <h3 class="text-2xl font-bold text-gray-800 mb-6">Créer un nouveau compte</h3>

        <form @submit.prevent="handleCreateAccount" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nom du compte</label>
            <input
              v-model="newAccount.name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: Compte Vacances"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Type de compte</label>
            <select
              v-model="newAccount.type"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="CHECKING">Compte Courant</option>
              <option value="SAVINGS">Compte Épargne</option>
            </select>
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="showAddAccountModal = false"
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
    </div>

    <!-- Modal Détails du compte -->
    <div
      v-if="selectedAccount"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="selectedAccount = null"
    >
      <div class="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="flex justify-between items-start mb-6">
          <div>
            <span
              class="px-3 py-1 rounded-full text-xs font-semibold mb-2 inline-block"
              :class="selectedAccount.type === 'CHECKING' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'"
            >
              {{ selectedAccount.type === 'CHECKING' ? 'Courant' : 'Épargne' }}
            </span>
            <h3 class="text-3xl font-bold text-gray-800">{{ selectedAccount.name }}</h3>
            <p class="text-4xl font-bold text-gray-900 mt-4">
              {{ formatAmount(selectedAccount.balance) }} €
            </p>
          </div>
          <button
            @click="selectedAccount = null"
            class="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div class="border-t border-gray-200 pt-6">
          <h4 class="font-semibold text-gray-800 mb-4">Transactions récentes</h4>

          <div v-if="!selectedAccount.transactions || selectedAccount.transactions.length === 0" class="text-center py-8 text-gray-500">
            Aucune transaction
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="transaction in selectedAccount.transactions"
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
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { accountsAPI } from '@/services/api';
import AppLayout from '@/components/AppLayout.vue';

const loading = ref(true);
const accounts = ref([]);
const showAddAccountModal = ref(false);
const selectedAccount = ref(null);
const error = ref('');
const creating = ref(false);

const newAccount = ref({
  name: '',
  type: 'CHECKING'
});

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

const loadAccounts = async () => {
  try {
    loading.value = true;
    const response = await accountsAPI.getAll();
    accounts.value = response.data;
  } catch (err) {
    console.error('Erreur chargement comptes:', err);
  } finally {
    loading.value = false;
  }
};

const handleCreateAccount = async () => {
  error.value = '';
  creating.value = true;

  try {
    await accountsAPI.create(newAccount.value);
    showAddAccountModal.value = false;
    newAccount.value = { name: '', type: 'CHECKING' };
    await loadAccounts();
  } catch (err) {
    error.value = err.response?.data?.error || 'Erreur lors de la création';
  } finally {
    creating.value = false;
  }
};

const selectAccount = async (account) => {
  try {
    const response = await accountsAPI.getById(account.id);
    selectedAccount.value = response.data;
  } catch (err) {
    console.error('Erreur chargement détails:', err);
  }
};

onMounted(() => {
  loadAccounts();
});
</script>
