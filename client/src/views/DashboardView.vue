<template>
  <AppLayout>
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="text-gray-600 mt-4">Chargement...</p>
    </div>

    <div v-else>
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-800">
          Bienvenue, {{ authStore.user?.firstName }} !
        </h2>
        <p class="text-gray-600 mt-2">Vue d'ensemble de vos finances</p>
      </div>

      <!-- Cartes des comptes -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div
          v-for="account in accounts"
          :key="account.id"
          class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-sm text-gray-500">{{ account.type === 'CHECKING' ? 'Compte Courant' : 'Compte Épargne' }}</p>
              <h3 class="text-xl font-bold text-gray-800">{{ account.name }}</h3>
            </div>
            <span class="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
              {{ account.currency }}
            </span>
          </div>
          <p class="text-3xl font-bold text-gray-900">
            {{ formatAmount(account.balance) }} €
          </p>
          <p class="text-sm text-gray-500 mt-2">
            {{ account._count?.transactions || 0 }} transactions
          </p>
        </div>

        <!-- Carte d'ajout de compte -->
        <div
          @click="showAddAccountModal = true"
          class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer border-2 border-dashed border-blue-300 flex flex-col items-center justify-center"
        >
          <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-3">
            <span class="text-white text-2xl">+</span>
          </div>
          <p class="text-blue-600 font-semibold">Ajouter un compte</p>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-md p-6">
          <p class="text-sm text-gray-500 mb-2">Revenus totaux</p>
          <p class="text-2xl font-bold text-green-600">
            +{{ formatAmount(stats.totalIncome) }} €
          </p>
        </div>
        <div class="bg-white rounded-xl shadow-md p-6">
          <p class="text-sm text-gray-500 mb-2">Dépenses totales</p>
          <p class="text-2xl font-bold text-red-600">
            -{{ formatAmount(stats.totalExpense) }} €
          </p>
        </div>
        <div class="bg-white rounded-xl shadow-md p-6">
          <p class="text-sm text-gray-500 mb-2">Balance</p>
          <p class="text-2xl font-bold" :class="stats.balance >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ formatAmount(stats.balance) }} €
          </p>
        </div>
      </div>

      <!-- Transactions récentes -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Transactions récentes</h3>

        <div v-if="transactions.length === 0" class="text-center py-8 text-gray-500">
          Aucune transaction pour le moment
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="transaction in transactions.slice(0, 5)"
            :key="transaction.id"
            class="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <div class="flex items-center space-x-4">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center"
                :class="transaction.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'"
              >
                <span :class="transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'">
                  {{ transaction.type === 'INCOME' ? '↓' : '↑' }}
                </span>
              </div>
              <div>
                <p class="font-semibold text-gray-800">{{ transaction.category }}</p>
                <p class="text-sm text-gray-500">{{ transaction.description || 'Sans description' }}</p>
              </div>
            </div>
            <div class="text-right">
              <p
                class="font-bold"
                :class="transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'"
              >
                {{ transaction.type === 'INCOME' ? '+' : '-' }}{{ formatAmount(transaction.amount) }} €
              </p>
              <p class="text-sm text-gray-500">{{ formatDate(transaction.date) }}</p>
            </div>
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
        <h3 class="text-2xl font-bold text-gray-800 mb-6">Nouveau compte</h3>

        <form @submit.prevent="handleCreateAccount" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nom du compte</label>
            <input
              v-model="newAccount.name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Mon compte"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              v-model="newAccount.type"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="CHECKING">Compte Courant</option>
              <option value="SAVINGS">Compte Épargne</option>
            </select>
          </div>

          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="showAddAccountModal = false"
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { accountsAPI, transactionsAPI } from '@/services/api';
import AppLayout from '@/components/AppLayout.vue';

const authStore = useAuthStore();

const loading = ref(true);
const accounts = ref([]);
const transactions = ref([]);
const stats = ref({
  totalIncome: 0,
  totalExpense: 0,
  balance: 0
});

const showAddAccountModal = ref(false);
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
    month: 'short',
    year: 'numeric'
  });
};

const loadData = async () => {
  try {
    loading.value = true;

    const [accountsRes, transactionsRes, statsRes] = await Promise.all([
      accountsAPI.getAll(),
      transactionsAPI.getAll(),
      transactionsAPI.getStats()
    ]);

    accounts.value = accountsRes.data;
    transactions.value = transactionsRes.data;
    stats.value = statsRes.data;
  } catch (error) {
    console.error('Erreur chargement données:', error);
  } finally {
    loading.value = false;
  }
};

const handleCreateAccount = async () => {
  try {
    await accountsAPI.create(newAccount.value);
    showAddAccountModal.value = false;
    newAccount.value = { name: '', type: 'CHECKING' };
    await loadData();
  } catch (error) {
    console.error('Erreur création compte:', error);
  }
};

onMounted(async () => {
  await authStore.fetchUser();
  await loadData();
});
</script>
