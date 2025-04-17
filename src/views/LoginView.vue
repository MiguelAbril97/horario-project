<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { obtenerToken } from '@/api/peticiones'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref(null)

const login = async () => {
  error.value = null
  try {
    // Modificamos obtenerToken para que devuelva una promesa con el token
    let token = await new Promise((resolve, reject) => {
      obtenerToken(username.value, password.value, resolve, reject)
    });
    
    if (token) {
      localStorage.setItem('access_token', token.access_token)
      
      router.push('/')
    } else {
      error.value = 'Usuario o contraseña incorrectos'
    }
  } catch (err) {
    error.value = 'Usuario o contraseña incorrectos'
  }
}
</script>

<template>
  <div class="container mt-5" style="max-width: 400px;">
    <h2>Iniciar sesión</h2>
    <form @submit.prevent="login">
      <div class="mb-3">
        <label for="username" class="form-label">Usuario</label>
        <input v-model="username" type="text" class="form-control" id="username" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Contraseña</label>
        <input v-model="password" type="password" class="form-control" id="password" required />
      </div>
      <button type="submit" class="btn btn-dark w-100">Entrar</button>
      <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
    </form>
  </div>
</template>