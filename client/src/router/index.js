import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AuthLayout from "@/components/layout/AuthLayout.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";

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
    // Redirection de /login vers /auth/login
    {
      path: '/login',
      redirect: '/auth/login'
    },
    // Redirection de /register vers /auth/register
    {
      path: '/register',
      redirect: '/auth/register'
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: () => import('../views/AccountsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('../views/TransactionsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/transfers',
      name: 'transfers',
      component: () => import('../views/TransfersView.vue'),
      meta: { requiresAuth: true }
    }
  ]
});

// Guard pour les routes protégées
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
