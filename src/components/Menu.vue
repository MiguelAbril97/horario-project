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
              <RouterLink class="nav-link" to="/ausencias/crear" style="color: #ffffff;">Reportar Ausencia</RouterLink>
            </li>
            <li v-if="profesor && (profesor.rol == 1 || profesor.is_superuser)" class="nav-item d-flex align-items-center">
              <RouterLink class="nav-link" to="/usuario/crear" style="color: #ffffff;">Crear Usuario</RouterLink>
            </li>
            <li v-if="profesor && (profesor.rol == 1 || profesor.is_superuser)" class="nav-item d-flex align-items-center">
              <RouterLink class="nav-link" to="/horario/subir" style="color: #ffffff;">Cargar Nuevo Horario</RouterLink>
            </li>
            <li class="nav-item d-flex align-items-center">
              <a class="nav-link d-flex align-items-center" data-bs-toggle="collapse" data-bs-target="#logout" aria-expanded="false" aria-controls="logout" style="color: #ffffff">
                <i class="fa-solid fa-user"></i>              
              </a>
            </li>
            <div class="collapse  collapse-horizontal" id="logout">
              <div class="card card-body"  style="width: 300px;">
                <p>Usuario: 
                  <RouterLink
                    class="usuario-link"
                    :to="`/usuario/ver/${profesor.id}`"
                  >
                    <span class="usuario-nombre">{{ profesor.first_name + " " + profesor.last_name }}</span>
                    <span class="ver-usuario-text">Ver usuario</span>
                  </RouterLink>
                </p>
                <RouterLink class=" btn btn-warning" to="/logout" @click.prevent="logout()">
                    <i class="fa-solid fa-right-from-bracket"></i>
                </RouterLink>
              </div>
            </div>
        </ul>
      </header>
    </div>
  </template>

  <script setup>
  import { useSesionStore } from '@/stores/sesion';
  import { useUserStore } from '@/stores/usuario';
  import { logout } from '@/api/peticiones';
  import { onMounted, computed } from 'vue';


  const sesion = useSesionStore();
  const userStore = useUserStore();
  const isAuthenticated = computed(() => sesion.isAuthenticated);
  const profesor = computed(() => userStore.usuario);

  function actualizarProfesor() {
    userStore.getUser();
  }

onMounted(() => {
  sesion.checkSesion();
  actualizarProfesor();
  window.addEventListener('storage', actualizarProfesor);
});
</script>
  
<style scoped>
.usuario-link {
  color: #222;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
  padding: 2px 8px;
  position: relative;
  display: inline-block;
}
.usuario-link .ver-usuario-text {
  display: none;
}
.usuario-link:hover {
  background: #000;
  color: #fff !important;
}
.usuario-link:hover .usuario-nombre {
  display: none;
}
.usuario-link:hover .ver-usuario-text {
  display: inline;
}
</style>