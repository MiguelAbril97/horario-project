<script setup>
import { onMounted, ref, watch } from 'vue'
import { getHorarioProfe, getProfe, getAusenciasProfe } from '@/api/peticiones'
import { useRoute } from 'vue-router';
import HorarioTable from '@/components/HorarioTable.vue'

const route = useRoute();
const id_profe = route.params.id;
const profesor = ref(null);
const horarios = ref([]);
const error = ref(null);
const ausencias = ref([]);
const dias = ['L', 'M', 'X', 'J', 'V']
const horas = Array.from({ length: 13 }, (_, i) => i + 1) // 1 a 13

const cargarHorario = async (id_profe) => {
  try {
    error.value = null
    horarios.value = await getHorarioProfe(id_profe)
  } catch (err) {
    error.value = err.message
  }
}

const cargarProfe = async (id_profe) => {
  try {
    error.value = null
    profesor.value = await getProfe(id_profe)
  } catch (err) {
    error.value = err.message
  }
}

const cargarAusencias = async (id_profe) => {
  try {
    error.value = null
    ausencias.value = await getAusenciasProfe(id_profe)
  } catch (err) {
    error.value = err.message
  }
}

onMounted(async () => {
  cargarHorario(id_profe);
  cargarProfe(id_profe);
  cargarAusencias(id_profe);

})

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
    <div v-if="profesor">
      <h2>
        Datos del profesor
        <router-link :to="`/usuario/editar/${id_profe}`" class="ms-2">
          <i class="bi bi-pencil"></i>
        </router-link>
      </h2>
      <p><strong>Nombre:</strong> {{ profesor.first_name }} {{ profesor.last_name }}</p>
      <p><strong>Email:</strong> {{ profesor.email }}</p>
    </div>
    <AusenciasUsuario :misAusencias="ausencias" />
    <div class="d-flex flex-column">
      <h2 v-if="profesor" class="my-4">Horario de {{ profesor.first_name }} {{ profesor.last_name }}</h2>
      <HorarioTable :horarios="horarios" :dias="dias" :horas="horas" />
    </div>

  </div>
</template>