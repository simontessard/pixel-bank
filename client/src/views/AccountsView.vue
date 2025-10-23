<template>
  <AppLayout>
    <div class="mb-8 flex max-md:flex-col gap-4 justify-between md:items-center">
      <div>
        <h2 class="text-3xl font-bold">Mes Comptes</h2>
        <p class="font-light mt-2">Gérez tous vos comptes bancaires</p>
      </div>
      <button
        @click="showAddAccountModal = true"
        class="px-5 py-2.5 text-sm cursor-pointer bg-blue-600 hover:bg-blue-700 size-fit text-white rounded-full font-medium transition flex items-center space-x-2"
      >
        <span>Ajouter un compte</span>
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
        class="bg-white rounded-3xl shadow-xs p-6 transition cursor-pointer"
        @click="selectAccount(account)"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <div class="flex items-center space-x-2 mb-2">
              <span
                class="px-2 py-1 rounded-md text-xs font-semibold"
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
          <p class="text-2xl md:text-3xl font-numbers tracking-tight font-bold text-gray-900">
            {{ formatAmount(account.balance) }}€
          </p>
        </div>

        <div class="mt-6 pt-4 border-t border-gray-200 flex justify-between text-sm">
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

    <AddAccountModal
      :show="showAddAccountModal"
      @close="showAddAccountModal = false"
      @created="loadAccounts"
    />

    <AccountDetailModal
      :account="selectedAccount"
      @close="selectedAccount = null"
    />

  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { accountsAPI } from '@/services/api';
import AppLayout from '@/components/AppLayout.vue';
import AddAccountModal from "@/components/accounts/AddAccountModal.vue";
import AccountDetailModal from "@/components/accounts/AccountDetailModal.vue";

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
