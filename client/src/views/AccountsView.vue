<template>
  <AppLayout>
    <div class="mb-8 flex max-md:flex-col gap-4 justify-between md:items-center">
      <div>
        <h2 class="text-3xl font-bold">Mes Comptes</h2>
        <p class="font-light mt-2">Gérez tous vos comptes bancaires</p>
      </div>
      <button
        @click="showAddAccountModal = true"
        class="css-button">
        Ajouter un compte
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>

    <!-- Liste des comptes -->
    <AccountList
      v-else
      :accounts="accounts"
      @select="selectAccount"
    />

    <AddAccountModal
      :show="showAddAccountModal"
      @close="showAddAccountModal = false"
      @created="loadAccounts"
    />

    <AccountDetailModal
      :show="showDetailsModal"
      :account="selectedAccount"
      @close="showDetailsModal = false"
    />

  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { accountsAPI } from '@/services/api';
import AppLayout from '@/components/AppLayout.vue';
import AddAccountModal from "@/components/accounts/AddAccountModal.vue";
import AccountDetailModal from "@/components/accounts/AccountDetailModal.vue";
import AccountList from "@/components/accounts/AccountList.vue";

const loading = ref(true);
const accounts = ref([]);
const showAddAccountModal = ref(false);
const showDetailsModal = ref(false);
const selectedAccount = ref(null);

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

const selectAccount = async (account) => {
  try {
    const response = await accountsAPI.getById(account.id);
    selectedAccount.value = response.data;
    showDetailsModal.value = true; // ← AJOUT DE CETTE LIGNE
  } catch (err) {
    console.error('Erreur chargement détails:', err);
  }
};

onMounted(() => {
  loadAccounts();
});
</script>
