import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import HomeView from '@/views/HomeView.vue'
import Analisis from '@/views/code/analisis/view.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },    
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },  // Protect this route
    },
    {
      path: '/code',
      name: 'analisis',
      component: Analisis,
      meta: { requiresAuth: true },  // Protect this route
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true },  // Protect this route
    },
    { 
      path: '/:pathMatch(.*)*', 
      name: 'NotFound', 
      component: () => import('../views/NotFound.vue') 
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  // await userStore.checkAuth()  // Check if the user is logged in

  // If the user is logged in and tries to access the login page, redirect to the home page
  if (to.name === 'login' && userStore.isLoggedIn) {
    next({ name: 'home' })  // Redirect to home if already logged in
  } else if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    // Redirect to login if the user is not logged in and tries to access a protected route
    next({ name: 'login' })
  } else {
    next()  // Continue to the requested route
  }
})


export default router
