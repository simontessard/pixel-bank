<template>
      <div class="max-w-lg w-full">

        <div class="flex flex-col items-center mb-6 md:mb-8">
          <img src="/logo.png" alt="PixelBank Logo" class="object-contain p-2.5 bg-white inline-block size-12 md:size-14 rounded-lg mb-1 md:mb-1.5"/>
          <h1 class="text-2xl md:text-3xl font-medium">
            Inscription
          </h1>
        </div>

        <form @submit.prevent="handleRegister">

          <div class="mb-8">

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium mb-2">Prénom</label>
                <input
                  v-model="firstName"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 placeholder:text-black/35 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  placeholder="John"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">Nom</label>
                <input
                  v-model="lastName"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 placeholder:text-black/35 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  placeholder="Doe"
                />
              </div>
            </div>

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
            class="w-full cursor-pointer bg-emerald-500 md:hover:bg-black text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Création...' : 'Créer mon compte' }}
          </button>
        </form>

        <p class="text-center text-gray-600 text-sm mt-4">
          Déjà un compte ?
          <router-link to="/auth/login" class="text-green-600 hover:text-green-700 font-semibold">
            Se connecter
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

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleRegister = async () => {
  error.value = '';
  loading.value = true;

  try {
    await authStore.register({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value
    });
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.error || 'Erreur lors de l\'inscription';
  } finally {
    loading.value = false;
  }
};
</script>
