<template>
      <div class="max-w-lg w-full">

        <div class="flex flex-col items-center mb-6 md:mb-8">
          <img src="/logo-green-2.png" alt="PixelBank Logo" class="object-contain p-2.5 bg-white inline-block size-12 md:size-14 rounded-lg mb-1 md:mb-1.5"/>
          <h1 class="text-2xl md:text-3xl font-medium">
            Connexion
          </h1>
        </div>

        <form @submit.prevent="handleLogin" class="w-full">

          <div class="mb-8">

            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Email</label>
              <input
                v-model="email"
                type="email"
                required
                class="w-full px-4 py-3 border border-gray-300 placeholder:text-black/35 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                placeholder="votre@email.com"
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Mot de passe</label>
              <input
                v-model="password"
                type="password"
                required
                class="w-full px-4 py-3 border border-gray-300 placeholder:text-black/35 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-lg">
              {{ error }}
            </div>

          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-emerald-500 md:hover:bg-black text-white cursor-pointer font-semibold py-3 rounded-lg transition-colors duration-500
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <p class="text-center text-gray-600 text-sm mt-4">
          Pas encore de compte ?
          <router-link to="/auth/register" class="text-emerald-500 md:hover:text-green-600 font-semibold">
            S'inscrire
          </router-link>
        </p>

      </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  error.value = '';
  loading.value = true;

  try {
    await authStore.login({
      email: email.value,
      password: password.value
    });
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.error || 'Erreur de connexion';
  } finally {
    loading.value = false;
  }
};
</script>
