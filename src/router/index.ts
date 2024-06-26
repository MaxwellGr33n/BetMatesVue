import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import BetslipPage from '@/views/BetslipPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/register', name: 'register', component: RegisterPage },
    { path: '/login', name: 'login', component: LoginPage },
    { path: '/betslip', name: 'betslip', component: BetslipPage },
  ]
})

export default router
