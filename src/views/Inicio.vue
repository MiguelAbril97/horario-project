<script setup>
import { onMounted, ref } from 'vue'
import { getHorarioProfe, getProfesores } from '@/api/peticiones'
import { useRouter } from 'vue-router';
import HorarioTable from '@/components/HorarioTable.vue'


const router = useRouter();
const profesor = ref(null)
const horario = ref([])
const errorHorario = ref(null)
const errorProfesores = ref(null)
const profesores = ref([])
const selectedProfesor = ref(null)
const aula = ref(null)
const dias = ['L', 'M', 'X', 'J', 'V']
const horas = Array.from({ length: 13 }, (_, i) => i + 1) 
const mostrarBusqueda = ref(false)
const grupo = ref(null)

const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  const usuarioGuardado = localStorage.getItem('usuario')
  if (usuarioGuardado) {
    profesor.value = JSON.parse(usuarioGuardado)
  }
  try {
    horario.value = await getHorarioProfe(profesor.value.id)
  } catch (err) {
    errorHorario.value = err.message
  }  
  try {
    profesores.value = await getProfesores()
  } catch (err) {
    errorProfesores.value = err.message
  }
  loading.value = false;
})
const verProfe = (profesorId) => {
  router.push(`/profesor/${profesorId}`)
}

const verAula = () => {
  if (aula.value && aula.value.trim() !== '') {
    router.push(`/horario/aula/${encodeURIComponent(aula.value.trim())}`)
  }
}

const verGrupo = () => {
  if (grupo.value && grupo.value.trim() !== '') {
    router.push(`/horario/grupo/${encodeURIComponent(grupo.value.trim())}`)
  }
}
</script>

<template>
  <div v-if="loading" class="d-flex justify-content-center align-items-center my-5">
    <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </div>
  <div v-else class="container-fluid mt-5">
    <div>
      <button
        class="btn btn-outline-dark mb-3"
        @click="mostrarBusqueda = !mostrarBusqueda"
        aria-expanded="mostrarBusqueda"
      >
        {{ mostrarBusqueda ? 'Ocultar menú de búsqueda' : 'Mostrar menú de búsqueda' }}
      </button>
      <transition name="fade">
        <div v-if="mostrarBusqueda" class="card p-4 mb-4 shadow">
          <label for="profesorSelect" class="form-label">Selecciona un profesor: </label>
          <select id="profesorSelect" class="form-select mb-3 shadow" v-model="selectedProfesor" @change="verProfe(selectedProfesor)">
            <option value="" disabled>Seleccione un profesor</option>
            <option v-for="profesor in profesores" :key="profesor.id" :value="profesor.id">
              {{ profesor.last_name }}, {{ profesor.first_name }}
            </option>
          </select>
          
          <label for="buscarAula" class="form-label">Busca un aula: </label>
          <div class="input-group mb-3">
            <input type="text" id="buscarAula" v-model="aula" class="form-control shadow" placeholder="Numero/Nombre del aula"/>
            <button class="btn btn-primary" type="button" @click="verAula">Buscar</button>
          </div>
          
          <label for="buscarGrupo" class="form-label">Busca un grupo: </label>
          <div class="input-group mb-3">
            <input type="text" id="buscarGrupo" v-model="grupo" class="form-control shadow" placeholder="Nombre del grupo"/>
            <button class="btn btn-primary" type="button" @click="verGrupo">Buscar</button>
          </div>
        </div>
      </transition>
    </div>
    
    <p v-if="errorProfesores" class="text-danger">Error: {{ errorProfesores }}</p>
    <p v-if="errorHorario" class="text-danger">Error: {{ errorHorario }}</p>
    <h2>Tu horario</h2>
    <HorarioTable :horarios="horario" :dias="dias" :horas="horas" />
  </div>

</template>

<style scoped>

</style>
