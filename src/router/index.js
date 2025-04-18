import { createRouter, createWebHistory } from 'vue-router'
import HorarioView from '@/views/HorarioView.vue'
import Inicio from '@/views/Inicio.vue'
import LoginView from '@/views/LoginView.vue'
import { logout } from '@/api/peticiones.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Inicio,
    },
    {
      path: '/profesor/:profesorId',
      name: 'profesor',
      component: HorarioView,
     
    },
    {
      path:'/login',
      name:'login',
      component: LoginView
    },
    {
      path: '/logout',
      name: 'logout',
      // Antes de entrar, revocamos tokens y vamos a login
      beforeEnter: (to, from, next) => {
        logout()                       
        next({ name: 'login' })       
      }
    },
  ],
})

export default router
