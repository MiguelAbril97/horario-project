<template>
  <div class="container-fluid bg-dark sticky-top" id="navbarNav">
      <header class="d-flex flex-column flex-md-row flex-wrap justify-content-center align-items-center py-3 mb-4 border-bottom">
        <ul v-if="!isAuthenticated" class="nav nav-pills d-flex flex-wrap justify-content-center align-items-center">
          <li class="nav-item d-flex align-items-center">
            <h2>
              <RouterLink class="nav-link d-flex align-items-center" to="/login" style="color: #ffffff;">
                Login
              </RouterLink>
            </h2>
          </li>
        </ul>
        <ul v-else="isAuthenticated" class="nav nav-pills d-flex flex-wrap justify-content-center align-items-center">
            <li class="nav-item d-flex align-items-center">
              <RouterLink class="nav-link" to="/" style="color: #ffffff;">Inicio</RouterLink>
            </li>
            <li class="nav-item d-flex align-items-center">
              <RouterLink class="nav-link" to="/ausencias" style="color: #ffffff;">Ausencias</RouterLink>
            </li>
            <li class="nav-item d-flex align-items-center">
              <RouterLink class="nav-link" to="/ausencias/crear" style="color: #ffffff;">Crear Ausencia</RouterLink>
            </li>
            <li v-if="profesor.value.rol == 1 || profesor.value.is_superuser == true" class="nav-item d-flex align-items-center">
              <RouterLink class="nav-link" to="/usuario/crear" style="color: #ffffff;">Crear Usuario</RouterLink>
            </li>
            <li v-if="profesor.value.rol == 1 || profesor.value.is_superuser == true" class="nav-item d-flex align-items-center">
              <RouterLink class="nav-link" to="/horario/subir" style="color: #ffffff;">Cargar Nuevo Horario</RouterLink>
            </li>
            <li class="nav-item d-flex align-items-center">
              <a class="nav-link d-flex align-items-center" data-bs-toggle="collapse" data-bs-target="#logout" aria-expanded="false" aria-controls="logout" style="color: #ffffff">
                <i class="fa-solid fa-user"></i>              
              </a>
            </li>
            <div class="collapse  collapse-horizontal" id="logout">
              <div class="card card-body"  style="width: 300px;">
                <p>Usuario: {{ profesor.value.first_name +" "+profesor.value.last_name}}</p>
                <RouterLink class=" btn btn-warning" to="/logout" @click.prevent="sesion.logout()">
                    <i class="fa-solid fa-right-from-bracket"></i>
                </RouterLink>
              </div>
            </div>
        </ul>
      </header>
    </div>
  </template>

  <script setup>
  import { useSesionStore, useUserStore } from '@/stores/sesion';
  import { onMounted, computed, ref } from 'vue';


  const sesion = useSesionStore();
  const userStore = useUserStore();
  const isAuthenticated = computed(() => sesion.isAuthenticated);
  const profesor = computed(()=>ref(userStore.getUser()));

function actualizarProfesor() {
  profesor.value = userStore.getUser();
}

onMounted(() => {
  sesion.checkSesion();
  actualizarProfesor();
  window.addEventListener('storage', actualizarProfesor);
});
  </script>
  