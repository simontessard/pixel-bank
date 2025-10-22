import { defineStore } from 'pinia';
import { authAPI } from '@/services/api';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || null);
  const isAuthenticated = ref(!!token.value);

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    token.value = response.data.token;
    user.value = response.data.user;
    isAuthenticated.value = true;
    localStorage.setItem('token', token.value);
  };

  const register = async (userData) => {
    const response = await authAPI.register(userData);
    token.value = response.data.token;
    user.value = response.data.user;
    isAuthenticated.value = true;
    localStorage.setItem('token', token.value);
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('token');
  };

  const fetchUser = async () => {
    if (token.value) {
      const response = await authAPI.me();
      user.value = response.data;
      isAuthenticated.value = true;
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser
  };
});
