<script setup>
import { onMounted, ref } from 'vue'
import { getHorarios } from '@/api/peticiones'

const horarios = ref([])
const error = ref(null)

const dias = ['L', 'M', 'X', 'J', 'V']
const horas = Array.from({ length: 13 }, (_, i) => i + 1) // 1 a 13

onMounted(async () => {
  try {
    horarios.value = await getHorarios()
  } catch (err) {
    error.value = err.message
  }
})
</script>

<template>
  <div class="container mt-5">
    <h2 class="mb-4">Horario</h2>

    <div class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Hora</th>
            <th v-for="dia in dias" :key="dia">{{ dia }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hora in horas" :key="hora">
            <td>{{ hora }}</td>
            <template v-for="dia in dias" :key="dia">
              <td v-if="hora === 4 || hora === 11">
                <strong>RECREO</strong>
              </td>
              <td v-else>
                <template v-for="h in horarios" :key="h.id">
                  <div v-if="h.hora === hora && h.dia === dia" class="">
                    <strong>{{ h.asignatura.nombre }}</strong>
                      Aula: {{ h.aula.numero }}
                      Grupo: {{ h.grupo.nombre }}
                      Prof: 
                      <a :href="`/profesor/${h.profesor.id}`">
                        {{ h.profesor.first_name }} {{ h.profesor.last_name }}
                      </a>
                      Hora: {{ h.hora }}
                  </div>
                </template>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="error" class="text-danger">Error: {{ error }}</p>
  </div>
</template>

<style scoped>

</style>
