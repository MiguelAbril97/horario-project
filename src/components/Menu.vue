<template>
<div class="container-fluid bg-dark sticky-top" id="navbarNav">
  <header class="d-flex flex-column flex-md-row flex-wrap justify-content-center align-items-center py-3 mb-4 border-bottom">
    <ul class="nav nav-pills d-flex flex-wrap justify-content-center align-items-center">
            <li class="nav-item d-flex align-items-center">
              <RouterLink class="nav-link" to="/" style="color: #ffffff;">Inicio</RouterLink>
            </li>
            <li v-if="!isAuthenticated" class="nav-item d-flex align-items-center">
              <RouterLink class="nav-link d-flex align-items-center" to="/login" style="color: #ffffff;">
                Login
                <font-awesome-icon icon="right-from-bracket" />
              </RouterLink>
            </li>
            <li v-else class="nav-item d-flex align-items-center">
              <RouterLink class="nav-link d-flex align-items-center" to="/logout" @click.prevent="sesion.logout()" style="color: #ffffff;">
                <span class="d-none d-md-inline">Logout</span>
                <span class="d-md-none">
                  <i class="fa-solid fa-right-from-bracket"></i>
                </span>
              </RouterLink>
            </li>
            <li class="nav-item d-flex align-items-center">
              <RouterLink class="nav-link" to="/ausencias" style="color: #ffffff;">Ausencias</RouterLink>
            </li>
            <li class="nav-item d-flex align-items-center">
              <RouterLink class="nav-link" to="/ausencias/crear" style="color: #ffffff;">Crear Ausencia</RouterLink>
            </li>
            <li class="nav-item d-flex align-items-center">
              <RouterLink class="nav-link" to="/usuario/crear" style="color: #ffffff;">Crear Usuario</RouterLink>
            </li>
            <li class="nav-item d-flex align-items-center">
              <a class="nav-link d-flex align-items-center" data-bs-toggle="collapse" data-bs-target="#logout" aria-expanded="false" aria-controls="logout" style="color: #ffffff">
                <i class="fa-solid fa-user me-2"></i>
              </a>
            </li>
            <div class="collapse  collapse-horizontal" id="logout">
              <div class="card card-body"  style="width: 300px;">
                <p>Usuario: {{ profesor.value ? profesor.value.first_name + ' ' + profesor.value.last_name : '' }}</p>
              </div>
            </div>
        </ul>
    </header>
  </div>
  </template>

  <script setup>
  import { useSesionStore, getusuarioGuardado } from '@/stores/sesion';
  import { onMounted, computed, ref } from 'vue';


  const sesion = useSesionStore();
  const isAuthenticated = computed(() => sesion.isAuthenticated);
  const profesor = ref(getusuarioGuardado());

function actualizarProfesor() {
  profesor.value = getusuarioGuardado();
}

// Actualiza al montar y tras login/logout
onMounted(() => {
  sesion.checkSesion();
  actualizarProfesor();
  window.addEventListener('storage', actualizarProfesor);
});
  </script>
  