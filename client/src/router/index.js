import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AuthLayout from "@/components/layout/AuthLayout.vue";
import ClassicLayout from "@/components/layout/ClassicLayout.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import DashboardView from "@/views/DashboardView.vue";
import AccountsView from "@/views/AccountsView.vue";
import TransactionsView from "@/views/TransactionsView.vue";
import TransfersView from "@/views/TransfersView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          path: 'login',
          name: 'login',
          component: LoginView
        },
        {
          path: 'register',
          name: 'register',
          component: RegisterView
        }
      ]
    },
    {
      path: '/login',
      redirect: '/auth/login'
    },
    {
      path: '/register',
      redirect: '/auth/register'
    },
    {
      path: '/',
      component: ClassicLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView
        },
        {
          path: 'accounts',
          name: 'accounts',
          component: AccountsView
        },
        {
          path: 'transactions',
          name: 'transactions',
          component: TransactionsView
        },
        {
          path: 'transfers',
          name: 'transfers',
          component: TransfersView
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth/login');
  } else if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
