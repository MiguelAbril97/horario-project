import { defineStore } from 'pinia'

export const useSesionStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: !!localStorage.getItem('access_token'),
  }),
  actions: {
    login() {
      this.isAuthenticated = true
    },
    logout() {
      this.isAuthenticated = false
    },
    checkSesion() {
      this.isAuthenticated = !!localStorage.getItem('access_token')
    },
  }
})

export const useUserStore = defineStore('user', {
  actions: {
    getUser() {
      let usuario = localStorage.getItem("usuario");
      return usuario ? JSON.parse(usuario) : null;
    }
  }
})
