<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/">Inicio</RouterLink>
            </li>
            <li v-if="!sesion.checkSesion()" class="nav-item">
              <RouterLink class="nav-link" to="/login">Login</RouterLink>
            </li>
            <li v-else class="nav-item">
              <RouterLink class="nav-link" to="/logout" @click.prevent="sesion.logout()">Logout</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/ausencias">Ausencias</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/ausencias/crear">Crear Ausencia</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { useSesionStore } from '@/stores/sesion';
  import { onMounted } from 'vue';

  const sesion = useSesionStore();
  
  onMounted(() => {
    sesion.checkSesion();
  });
  </script>
  