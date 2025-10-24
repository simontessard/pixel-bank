<template>
  <nav class="container pt-4 md:pt-6">
    <div class="rounded-3xl bg-white shadow-xs flex md:grid md:grid-cols-6 lg:grid-cols-8 justify-between items-center px-4 md:px-6 py-3 md:py-3.5">

      <router-link to="/" class="flex items-center gap-2 text-lg font-semibold text-emerald-500">
        <img src="/logo-green-2.png" alt="PixelBank Logo" class="object-contain inline-block size-6 md:size-7"/>
      </router-link>

      <div class="col-span-4 lg:col-span-6 hidden md:flex justify-center space-x-4">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="flex items-center gap-2 px-5 xl:px-6 py-2.5 text-xs xl:text-sm rounded-full text-gray-700 bg-gray-100 transition-colors hover:bg-gray-200"
          :class="{ '!bg-black text-white': isActiveLink(link.path) }"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path :d="link.icon" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ link.label }}
        </router-link>
      </div>

      <AccountMenu/>

    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import AccountMenu from "@/components/navigation/AccountMenu.vue";

const route = useRoute();

const navLinks = [
  {
    path: '/',
    label: 'Dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
  {
    path: '/accounts',
    label: 'Comptes',
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
  },
  {
    path: '/transactions',
    label: 'Transactions',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
  },
  {
    path: '/transfers',
    label: 'Virements',
    icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
  }
];

const isActiveLink = (path: string) => {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
};
</script>
