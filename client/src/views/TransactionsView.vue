<template>
  <AppLayout>

    <div class="mb-8 flex justify-between items-center">
      <div>
        <h2 class="text-3xl font-bold text-gray-800">Transactions</h2>
        <p class="font-light mt-2">Gérez vos revenus et dépenses</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="showAddTransactionModal = true"
          class="css-button">
          Ajouter une transaction
        </button>
      </div>
    </div>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-3xl shadow-xs p-6">
        <p class="text-sm text-gray-500 mb-2">Total transactions</p>
        <p class="text-2xl font-bold text-gray-900">{{ stats.transactionCount }}</p>
      </div>
      <div class="bg-white rounded-3xl shadow-xs p-6">
        <p class="text-sm text-gray-500 mb-2">Revenus</p>
        <p class="text-2xl font-bold text-green-600">+{{ formatAmount(stats.totalIncome) }} €</p>
      </div>
      <div class="bg-white rounded-3xl shadow-xs p-6">
        <p class="text-sm text-gray-500 mb-2">Dépenses</p>
        <p class="text-2xl font-bold text-red-600">-{{ formatAmount(stats.totalExpense) }} €</p>
      </div>
      <div class="bg-white rounded-3xl shadow-xs p-6">
        <p class="text-sm text-gray-500 mb-2">Balance</p>
        <p class="text-2xl font-bold" :class="stats.balance >= 0 ? 'text-green-600' : 'text-red-600'">
          {{ formatAmount(stats.balance) }} €
        </p>
      </div>
    </div>

    <!-- Filtres -->
    <div class="mb-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">Compte</label>
          <select
            v-model="filters.accountId"
            @change="loadTransactions"
            class="w-full px-4 py-2 bg-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Tous les comptes</option>
            <option v-for="account in accounts" :key="account.id" :value="account.id">
              {{ account.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Type</label>
          <select
            v-model="filters.type"
            @change="loadTransactions"
            class="w-full px-4 py-2 bg-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Tous les types</option>
            <option value="INCOME">Revenus</option>
            <option value="EXPENSE">Dépenses</option>
            <option value="TRANSFER">Virements</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Catégorie</label>
          <select
            v-model="filters.category"
            @change="loadTransactions"
            class="w-full px-4 py-2 bg-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Toutes les catégories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>

        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="w-full px-4 py-2 cursor-pointer text-sm bg-black text-white rounded-xl transition"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>

    <!-- Liste des transactions -->
    <div class="bg-white rounded-3xl shadow-xs p-6">
      <h3 class="text-xl font-bold text-gray-800 mb-4">Liste des transactions</h3>

      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>

      <div v-else-if="transactions.length === 0" class="text-center py-12 text-gray-500">
        Aucune transaction trouvée
      </div>

      <div v-else class="space-y-5">
        <div
          v-for="transaction in transactions"
          :key="transaction.id"
          class="flex justify-between items-center rounded-lg"
        >
          <div class="flex items-center space-x-4">
            <div
              class="size-12 md:size-14 rounded-full flex items-center justify-center text-xl font-bold"
              :class="{
                'bg-green-100 text-green-600': transaction.type === 'INCOME',
                'bg-red-100 text-red-600': transaction.type === 'EXPENSE',
                'bg-purple-100 text-purple-600': transaction.type === 'TRANSFER'
              }"
            >
              {{ transaction.type === 'INCOME' ? '↓' : transaction.type === 'EXPENSE' ? '↑' : '⇄' }}
            </div>
            <div>
              <p class="font-semibold text-gray-800">{{ transaction.category }}</p>
              <p class="text-sm text-gray-500">{{ transaction.description || 'Sans description' }}</p>
              <p class="text-xs text-gray-400 mt-1">
                {{ transaction.account.name }} • {{ formatDate(transaction.date) }}
              </p>
            </div>
          </div>
          <p
            class="font-semibold font-numbers tracking-tight text-xl"
            :class="{
              'text-green-600': transaction.type === 'INCOME',
              'text-red-600': transaction.type === 'EXPENSE',
              'text-purple-600': transaction.type === 'TRANSFER'
            }"
          >
            {{ transaction.type === 'INCOME' ? '+' : '-' }}{{ formatAmount(transaction.amount) }}€
          </p>
        </div>
      </div>
    </div>

    <!-- Modal Nouvelle transaction -->
    <TransactionModal
      :show="showAddTransactionModal"
      :accounts="accounts"
      :categories="categories"
      @close="showAddTransactionModal = false"
      @submit="handleCreateTransaction"
    />
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { accountsAPI, transactionsAPI } from '@/services/api';
import AppLayout from '@/components/AppLayout.vue';
import TransactionModal from "@/components/transactions/TransactionModal.vue";

const loading = ref(true);
const accounts = ref([]);
const transactions = ref([]);
const stats = ref({
  totalIncome: 0,
  totalExpense: 0,
  balance: 0,
  transactionCount: 0
});

const showAddTransactionModal = ref(false);

const categories = [
  'Salaire',
  'Freelance',
  'Investissements',
  'Restaurant',
  'Courses',
  'Transport',
  'Loisirs',
  'Santé',
  'Logement',
  'Abonnements',
  'Shopping',
  'Éducation',
  'Voyages',
  'Cadeaux',
  'Autre'
];

const filters = ref({
  accountId: '',
  type: '',
  category: ''
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
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const loadAccounts = async () => {
  try {
    const response = await accountsAPI.getAll();
    accounts.value = response.data || [];
  } catch (err) {
    console.error('Erreur chargement comptes:', err);
  }
};

const loadTransactions = async () => {
  try {
    loading.value = true;
    const params = {};
    if (filters.value.accountId) params.accountId = filters.value.accountId;
    if (filters.value.type) params.type = filters.value.type;
    if (filters.value.category) params.category = filters.value.category;

    const [transactionsRes, statsRes] = await Promise.all([
      transactionsAPI.getAll(params),
      transactionsAPI.getStats(params)
    ]);

    transactions.value = transactionsRes.data || [];
    stats.value = statsRes.data || {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      transactionCount: 0
    };
  } catch (err) {
    console.error('Erreur chargement transactions:', err);
  } finally {
    loading.value = false;
  }
};

const resetFilters = () => {
  filters.value = {
    accountId: '',
    type: '',
    category: ''
  };
  loadTransactions();
};

const handleCreateTransaction = async (transactionData) => {
  try {
    await transactionsAPI.create(transactionData);
    showAddTransactionModal.value = false;
    await loadAccounts();
    await loadTransactions();
  } catch (err) {
    console.error('Erreur création transaction:', err);
    throw err;
  }
};

onMounted(async () => {
  loading.value = true;
  await Promise.all([loadAccounts(), loadTransactions()]);
  loading.value = false;
});
</script>

<style scoped>
/* petites améliorations visuelles si nécessaire */
</style>
