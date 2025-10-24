<template>
  <AppLayout>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h2 class="text-3xl font-bold text-gray-800">Virements</h2>
        <p class="font-light mt-2">Transférez de l'argent entre vos comptes</p>
      </div>
      <button
        @click="showTransferModal = true"
        class="px-5 py-2.5 text-sm cursor-pointer bg-gradient-secondary text-white rounded-full font-medium transition"
      >
        + Nouveau virement
      </button>
    </div>

    <!-- Historique des virements -->
    <div class="bg-white rounded-3xl shadow-xs p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold text-gray-800">Historique</h3>
        <div class="flex items-center space-x-2">
          <label class="text-sm text-gray-600">Compte:</label>
          <select
            v-model="filterAccountId"
            @change="loadTransfers"
            class="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
          >
            <option value="">Tous les comptes</option>
            <option v-for="account in accounts" :key="account.id" :value="account.id">
              {{ account.name }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
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
              <div class="size-12 rounded-full bg-gradient-secondary text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
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
              <p class="font-semibold text-xl font-numbers tracking-tight">
                {{ formatAmount(transfer.amount) }}€
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Nouveau virement -->
    <TransferModal
      :show="showTransferModal"
      :accounts="accounts"
      :loading="creating"
      :error="error"
      @close="closeModal"
      @submit="handleTransfer"
    />

  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { accountsAPI, transactionsAPI } from '@/services/api';
import AppLayout from '@/components/AppLayout.vue';
import TransferModal from "@/components/transfers/TransferModal.vue";

const loading = ref(true);
const creating = ref(false);
const accounts = ref([]);
const transfers = ref([]);
const showTransferModal = ref(false);
const filterAccountId = ref('');
const error = ref('');

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
};

const handleTransfer = async (transferData) => {
  error.value = '';

  // Validations
  if (!transferData.fromAccountId) {
    error.value = 'Veuillez sélectionner un compte source';
    return;
  }
  if (!transferData.toAccountId) {
    error.value = 'Veuillez sélectionner un compte cible';
    return;
  }
  if (transferData.fromAccountId === transferData.toAccountId) {
    error.value = 'Les comptes source et cible doivent être différents';
    return;
  }
  if (!transferData.amount || transferData.amount <= 0) {
    error.value = 'Veuillez saisir un montant valide';
    return;
  }

  // Vérifier le solde
  const fromAccount = accounts.value.find(a => a.id === transferData.fromAccountId);
  if (fromAccount && transferData.amount > fromAccount.balance) {
    error.value = 'Solde insuffisant sur le compte source';
    return;
  }

  creating.value = true;

  try {
    await transactionsAPI.transfer(transferData);
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
