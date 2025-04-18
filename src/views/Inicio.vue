<script setup>
import { onMounted, ref } from 'vue'
import { getHorarioProfe, getProfesores } from '@/api/peticiones'
import { useRouter } from 'vue-router';
import HorarioTable from '@/components/HorarioTable.vue'


const router = useRouter();
const profesor = ref(null)
const horario = ref([])
const error = ref(null)
const profesores = ref([])
const selectedProfesor = ref(null)

const dias = ['L', 'M', 'X', 'J', 'V']
const horas = Array.from({ length: 13 }, (_, i) => i + 1) // 1 a 13

onMounted(async () => {
  const usuarioGuardado = localStorage.getItem('usuario')
  if (usuarioGuardado) {
    profesor.value = JSON.parse(usuarioGuardado)
  }
  try {
    horario.value = await getHorarioProfe(profesor.value.id)
    profesores.value = await getProfesores()
  } catch (err) {
    error.value = err.message
  }
})
const verProfe = (profesorId) => {
  router.push(`/profesor/${profesorId}`)
}


</script>

<template>
  <div class="container mt-5">
    <div class="mb-4">
      <label for="profesorSelect" class="form-label">Selecciona un profesor: </label>
      <select id="profesorSelect" class="form-select" v-model="selectedProfesor" @change="verProfe(selectedProfesor)">
        <option value="" disabled>Seleccione un profesor</option>
        <option v-for="profesor in profesores" :key="profesor.id" :value="profesor.id">
          {{ profesor.first_name }} {{ profesor.last_name }}
        </option>
      </select>
    </div>
    <p v-if="error" class="text-danger">Error: {{ error }}</p>
  </div>

  <h2>Tu horarios</h2>
  <HorarioTable :horarios="horario" :dias="dias" :horas="horas" />
</template>

<style scoped>

</style>
