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

const dias = ['L', 'M', 'X', 'J', 'V']
const horas = Array.from({ length: 13 }, (_, i) => i + 1) // 1 a 13

onMounted(async () => {
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
          {{ profesor.last_name }}, {{ profesor.first_name }}
        </option>
      </select>
    </div>
    <p v-if="errorProfesores" class="text-danger">Error: {{ errorProfesores }}</p>
    <p v-if="errorHorario" class="text-danger">Error: {{ errorHorario }}</p>

  </div>

  <h2>Tu horario</h2>
  <HorarioTable :horarios="horario" :dias="dias" :horas="horas" />
</template>

<style scoped>

</style>
