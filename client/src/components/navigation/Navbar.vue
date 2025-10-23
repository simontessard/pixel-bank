<template>
  <nav class="container pt-3 md:pt-5">
      <div class="rounded-3xl bg-white shadow-xs flex md:grid md:grid-cols-6 lg:grid-cols-8 justify-between items-center px-4 md:px-6 py-3 md:py-4">

        <router-link to="/" class="text-lg md:text-xl font-semibold text-emerald-500">
            PixelBank
        </router-link>

        <div class="col-span-4 lg:col-span-6 hidden md:flex justify-center space-x-4">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="flex items-center gap-2 px-6 py-2.5 text-sm rounded-full text-gray-700 bg-gray-100 transition-colors"
            active-class="!bg-black text-white md:hover:bg-green-700"
          >
            {{ link.label }}
          </router-link>
        </div>

        <AccountMenu/>

      </div>
  </nav>
</template>

<script setup lang="ts">
import AccountMenu from "@/components/navigation/AccountMenu.vue";

const navLinks = [
  { path: '/', label: 'Dashboard' },
  { path: '/accounts', label: 'Comptes' },
  { path: '/transactions', label: 'Transactions' }
];
</script>
