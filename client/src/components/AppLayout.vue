<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <h1 class="text-2xl font-bold text-green-600">Pixel Bank</h1>

            <div class="hidden md:flex space-x-4">
              <router-link
                to="/"
                class="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                active-class="bg-blue-50 text-blue-600"
              >
                Dashboard
              </router-link>
              <router-link
                to="/accounts"
                class="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                active-class="bg-blue-50 text-blue-600"
              >
                Comptes
              </router-link>
              <router-link
                to="/transactions"
                class="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                active-class="bg-blue-50 text-blue-600"
              >
                Transactions
              </router-link>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <span class="text-gray-700">{{ authStore.user?.firstName }}</span>
            <button
              @click="handleLogout"
              class="px-4 py-2 bg-red-600 md:hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
