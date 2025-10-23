<template>
  <AppLayout>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h2 class="text-3xl font-bold text-gray-800">Transactions</h2>
        <p class="text-gray-600 text-sm mt-2">Gérez vos revenus et dépenses</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="showTransferModal = true"
          class="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition"
        >
          Virement
        </button>
        <button
          @click="showAddTransactionModal = true"
          class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition"
        >
          + Nouvelle transaction
        </button>
      </div>
    </div>

    <!-- Filtres -->
    <div class="bg-white rounded-xl shadow-xs p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Compte</label>
          <select
            v-model="filters.accountId"
            @change="loadTransactions"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Tous les comptes</option>
            <option v-for="account in accounts" :key="account.id" :value="account.id">
              {{ account.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select
            v-model="filters.type"
            @change="loadTransactions"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Tous les types</option>
            <option value="INCOME">Revenus</option>
            <option value="EXPENSE">Dépenses</option>
            <option value="TRANSFER">Virements</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
          <select
            v-model="filters.category"
            @change="loadTransactions"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
            class="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-xl shadow-xs p-6">
        <p class="text-sm text-gray-500 mb-2">Total transactions</p>
        <p class="text-2xl font-bold text-gray-900">{{ stats.transactionCount }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-xs p-6">
        <p class="text-sm text-gray-500 mb-2">Revenus</p>
        <p class="text-2xl font-bold text-green-600">+{{ formatAmount(stats.totalIncome) }} €</p>
      </div>
      <div class="bg-white rounded-xl shadow-xs p-6">
        <p class="text-sm text-gray-500 mb-2">Dépenses</p>
        <p class="text-2xl font-bold text-red-600">-{{ formatAmount(stats.totalExpense) }} €</p>
      </div>
      <div class="bg-white rounded-xl shadow-xs p-6">
        <p class="text-sm text-gray-500 mb-2">Balance</p>
        <p class="text-2xl font-bold" :class="stats.balance >= 0 ? 'text-green-600' : 'text-red-600'">
          {{ formatAmount(stats.balance) }} €
        </p>
      </div>
    </div>

    <!-- Liste des transactions -->
    <div class="bg-white rounded-xl shadow-xs p-6">
      <h3 class="text-xl font-bold text-gray-800 mb-4">Liste des transactions</h3>

      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>

      <div v-else-if="transactions.length === 0" class="text-center py-12 text-gray-500">
        Aucune transaction trouvée
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="transaction in transactions"
          :key="transaction.id"
          class="flex justify-between items-center rounded-lg"
        >
          <div class="flex items-center space-x-4">
            <div
              class="size-12 rounded-full flex items-center justify-center text-xl font-bold"
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
    <div
      v-if="showAddTransactionModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="showAddTransactionModal = false"
    >
      <div class="bg-white rounded-xl p-8 max-w-md w-full" @click.stop>
        <h3 class="text-2xl font-bold text-gray-800 mb-6">Nouvelle transaction</h3>

        <form @submit.prevent="handleCreateTransaction" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Compte</label>
            <select
              v-model="newTransaction.accountId"
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
              v-model="newTransaction.type"
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
              v-model.number="newTransaction.amount"
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
              v-model="newTransaction.category"
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
              v-model="newTransaction.description"
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
              @click="showAddTransactionModal = false"
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

    <!-- Modal Virement -->
    <div
      v-if="showTransferModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="showTransferModal = false"
    >
      <div class="bg-white rounded-xl p-8 max-w-md w-full" @click.stop>
        <h3 class="text-2xl font-bold text-gray-800 mb-6">Virement entre comptes</h3>

        <form @submit.prevent="handleTransfer" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Depuis le compte</label>
            <select
              v-model="transfer.fromAccountId"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="">Sélectionnez un compte</option>
              <option v-for="account in accounts" :key="account.id" :value="account.id">
                {{ account.name }} ({{ formatAmount(account.balance) }} €)
              </option>
            </select>
          </div>

          <div class="text-center text-2xl text-purple-600">↓</div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Vers le compte</label>
            <select
              v-model="transfer.toAccountId"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="">Sélectionnez un compte</option>
              <option
                v-for="account in accounts"
                :key="account.id"
                :value="account.id"
                :disabled="account.id === transfer.fromAccountId"
              >
                {{ account.name }} ({{ formatAmount(account.balance) }} €)
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Montant (€)</label>
            <input
              v-model.number="transfer.amount"
              type="number"
              step="0.01"
              min="0.01"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="0.00"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description (optionnelle)</label>
            <input
              v-model="transfer.description"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Motif du virement"
            />
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="showTransferModal = false"
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="creating"
              class="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-semibold disabled:opacity-50"
            >
              {{ creating ? 'Virement...' : 'Effectuer le virement' }}
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
const accounts = ref([]);
const transactions = ref([]);
const stats = ref({
  totalIncome: 0,
  totalExpense: 0,
  balance: 0,
  transactionCount: 0
});

const showAddTransactionModal = ref(false);
const showTransferModal = ref(false);
const error = ref('');
const creating = ref(false);

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

const newTransaction = ref({
  accountId: '',
  amount: null,
  type: 'EXPENSE',
  category: 'Autre',
  description: ''
});

const transfer = ref({
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
    // Optionnellement set a user-friendly error
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
    // Optionally show UI error
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

const handleCreateTransaction = async () => {
  error.value = '';
  creating.value = true;

  try {
    // validate minimalement
    if (!newTransaction.value.accountId) throw new Error('Compte requis');
    if (!newTransaction.value.amount || Number(newTransaction.value.amount) <= 0) throw new Error('Montant invalide');

    await transactionsAPI.create(newTransaction.value);
    showAddTransactionModal.value = false;
    newTransaction.value = {
      accountId: '',
      amount: null,
      type: 'EXPENSE',
      category: 'Autre',
      description: ''
    };
    await loadAccounts();
    await loadTransactions();
  } catch (err) {
    console.error('Erreur création transaction:', err);
    error.value = err.response?.data?.error || err.message || 'Erreur lors de la création';
  } finally {
    creating.value = false;
  }
};

const handleTransfer = async () => {
  error.value = '';
  creating.value = true;

  try {
    // validations basiques
    if (!transfer.value.fromAccountId) throw new Error('Compte source requis');
    if (!transfer.value.toAccountId) throw new Error('Compte cible requis');
    if (transfer.value.fromAccountId === transfer.value.toAccountId) throw new Error('Les comptes doivent être différents');
    if (!transfer.value.amount || Number(transfer.value.amount) <= 0) throw new Error('Montant invalide');

    await transactionsAPI.transfer(transfer.value);
    showTransferModal.value = false;
    transfer.value = {
      fromAccountId: '',
      toAccountId: '',
      amount: null,
      description: ''
    };
    await loadAccounts();
    await loadTransactions();
  } catch (err) {
    console.error('Erreur virement:', err);
    error.value = err.response?.data?.error || err.message || 'Erreur lors du virement';
  } finally {
    creating.value = false;
  }
};

// initial load
onMounted(async () => {
  loading.value = true;
  await Promise.all([loadAccounts(), loadTransactions()]);
  loading.value = false;
});
</script>

<style scoped>
/* petites améliorations visuelles si nécessaire */
.fixed .bg-white {
  max-height: 90vh;
  overflow-y: auto;
}
</style>
