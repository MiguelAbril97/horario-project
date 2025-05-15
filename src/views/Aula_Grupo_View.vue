<script setup>
import { onMounted, ref, watch } from 'vue'
import { buscarAula, buscarGrupo } from '@/api/peticiones'
import { useRoute } from 'vue-router';
import HorarioTable from '@/components/HorarioTable.vue'

const route = useRoute();
const tipo = route.params.tipo;      // aula o grupo
const nombre = route.params.nombre;
const horarios = ref([]);
const error = ref(null);

const dias = ['L', 'M', 'X', 'J', 'V']
const horas = Array.from({ length: 13 }, (_, i) => i + 1) // 1 a 13

const cargarHorario = async (aula) => {
  try {
    error.value = null
    if (tipo === 'aula') {
      horarios.value = await buscarAula(nombre)
    } else if (tipo === 'grupo') {
      horarios.value = await buscarGrupo(nombre)
    } else {
      error.value = 'Tipo no válido'
    }
  } catch (err) {
    error.value = err.message
  }
}

onMounted(() => {
  cargarHorario(route.params.aula);
})

// Observa cambios en el parámetro aula
watch(
  () => route.params.aula,
  (nuevaAula) => {
    cargarHorario(nuevaAula);
  }
)
</script>

<template>
  <div class="container mt-5">
    <div class="d-flex flex-column">
        <div v-if="horarios.length > 0">
            <h2 class="my-4">
                Horario del {{ tipo === 'aula' ? 'aula' : 'grupo' }}: {{ tipo === 'aula' ? horarios[0].aula.numero : horarios[0].grupo.nombre }}
            </h2>
            <HorarioTable :horarios="horarios" :dias="dias" :horas="horas" />
        </div>
        <div v-else-if="error">
            <strong class="my-4 text-danger">Error: {{ error }}</strong>
        </div>
        <div v-else-if="horarios.length === 0 && !error">
            <strong class="my-4 text-danger">No se encontraron resultados para {{ nombre }}</strong>
        </div>
    </div>
  </div>
</template>