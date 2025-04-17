import { createRouter, createWebHistory } from 'vue-router'
import HorarioView from '@/views/HorarioView.vue'
import Inicio from '@/views/Inicio.vue'
import LoginView from '@/views/LoginView.vue'

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
  ],
})

export default router
