<template>
  <AppLayout>
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="text-gray-600 mt-4">Chargement...</p>
    </div>

    <div v-else>
      <PageHeader
        :title="`Bienvenue, ${authStore.user?.firstName} !`"
        subtitle="Vue d'ensemble de vos finances 💰"
      />

      <!-- Cartes des comptes -->
      <Accounts
        :accounts="accounts"
        @add-account="showAddAccountModal = true"
      />

      <!-- Statistiques -->
      <Stats :stats="stats" />

      <div class="flex gap-4 max-lg:flex-col">
        <TransactionsPie
          :transactions="transactions"
          :topN="8"
          :typeFilter="null"
          periodLabel="Derniers 12 mois"
        />

        <!-- Transactions récentes -->
        <RecentTransactions :transactions="transactions" :limit="4" />
      </div>

    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { accountsAPI, transactionsAPI } from '@/services/api';
import AppLayout from '@/components/AppLayout.vue';
import PageHeader from "@/components/common/PageHeader.vue";
import Accounts from "@/components/dashboard/Accounts.vue";
import Stats from "@/components/dashboard/Stats.vue";
import RecentTransactions from "@/components/dashboard/RecentTransactions.vue";
import TransactionsPie from "@/components/dashboard/TransactionsPie.vue";

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

onMounted(async () => {
  await authStore.fetchUser();
  await loadData();
});
</script>
