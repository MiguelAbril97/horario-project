<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/">Inicio</RouterLink>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li v-if="!isAuthenticated" class="nav-item">
              <RouterLink class="nav-link" to="/login">Login</RouterLink>
            </li>
            <li v-else class="nav-item">
              <RouterLink class="nav-link" to="/logout">Logout</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  
  // Estado de autenticación basado en la existencia del token
  const isAuthenticated = ref(false);
  
  const checkAuth = () => {
    isAuthenticated.value = !!localStorage.getItem('access_token');
  };
  
  // Verificar al montar el componente

  function onStorageChange(event) {
        if (event.key === 'access_token') {
            checkAuth();
        }
    }

    onMounted(() => {
        checkAuth();
        window.addEventListener('storage', onStorageChange);
    });

    onUnmounted(() => {
        window.removeEventListener('storage', onStorageChange);
    });
  </script>
  