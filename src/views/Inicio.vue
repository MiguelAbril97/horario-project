<script setup>
import { onMounted, ref } from 'vue'
import { getHorarios, getProfesores } from '@/api/peticiones'
import { useRouter } from 'vue-router';

const router = useRouter();
const horarios = ref([])
const error = ref(null)
const profesores = ref([])

const dias = ['L', 'M', 'X', 'J', 'V']
const horas = Array.from({ length: 13 }, (_, i) => i + 1) // 1 a 13

onMounted(async () => {
  try {
    horarios.value = await getHorarios()
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
</template>

<style scoped>

</style>
