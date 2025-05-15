<script setup>
import { onMounted, ref, watch } from 'vue'
import { getHorarioProfe, getProfe } from '@/api/peticiones'
import { useRoute } from 'vue-router';
import HorarioTable from '@/components/HorarioTable.vue'

const route = useRoute();
const id_profe = route.params.profesorId;
const profesor = ref(null);
const horarios = ref([]);
const error = ref(null);
const loading = ref(false);

const dias = ['L', 'M', 'X', 'J', 'V']
const horas = Array.from({ length: 13 }, (_, i) => i + 1) // 1 a 13

const cargarHorario = async (id_profe) => {
  loading.value = true;
  try {
    error.value = null
    horarios.value = await getHorarioProfe(id_profe)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false;
  }
}

const cargarProfe = async (id_profe) => {
  loading.value = true;
  try {
    error.value = null
    profesor.value = await getProfe(id_profe)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  cargarHorario(route.params.profesorId);
  cargarProfe(route.params.profesorId);
})

// Observa cambios en el parámetro profesorId
watch(
  () => route.params.profesorId,
  (nuevoId) => {
    cargarHorario(nuevoId);
    cargarProfe(nuevoId);
  }
)
</script>

<template>
  <div class="container mt-5">
    <div v-if="loading" class="d-flex justify-content-center align-items-center my-5">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <div v-else-if="profesor && !loading">
      <div>
          <h2>
          Datos del profesor
          <router-link :to="`/usuario/editar/${id_profe}`" class="ms-2">
            <i class="bi bi-pencil"></i>
          </router-link>
        </h2>
        <p>
          <strong>Nombre: </strong> 
          <router-link :to="`/usuario/ver/${id_profe}`" class="ms-2">
            {{ profesor.first_name }} {{ profesor.last_name }}
          </router-link>
        </p>
      </div>
      <div class="d-flex flex-column">
        <h2 v-if="profesor" class="my-4">Horario de {{ profesor.first_name }} {{ profesor.last_name }}</h2>
        <HorarioTable :horarios="horarios" :dias="dias" :horas="horas" />
      </div>
    </div>
  </div>
</template>