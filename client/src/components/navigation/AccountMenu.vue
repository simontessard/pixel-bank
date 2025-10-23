<template>
  <div class="flex items-center space-x-4">
    <div class="relative group w-40">
      <div class="flex justify-between items-center bg-gray-100 p-2 rounded-full cursor-pointer">
        <div class="flex items-center gap-2.5">
          <div class="size-6 bg-gradient-to-br from-lime-200 via-green-400 to-emerald-600 rounded-full"></div>
          <span class="text-sm text-gray-700">
             {{ authStore.user?.firstName }}
          </span>
        </div>
        <svg class="size-3 rotate-90 mr-2.5" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 185.343 185.343" xml:space="preserve">
		         <path style="fill:#010002;" d="M51.707,185.343c-2.741,0-5.493-1.044-7.593-3.149c-4.194-4.194-4.194-10.981,0-15.175
			          l74.352-74.347L44.114,18.32c-4.194-4.194-4.194-10.987,0-15.175c4.194-4.194,10.987-4.194,15.18,0l81.934,81.934
			          c4.194,4.194,4.194,10.987,0,15.175l-81.934,81.939C57.201,184.293,54.454,185.343,51.707,185.343z"/>
        </svg>
      </div>

      <!-- Menu déroulant au survol -->
      <div class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <button
          @click="handleLogout"
          class="w-full text-left px-4 py-3 text-sm cursor-pointer text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Déconnexion
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
