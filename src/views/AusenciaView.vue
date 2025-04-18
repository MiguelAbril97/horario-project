<script setup>
import { ref, onMounted } from 'vue'
import { getAusenciasFecha, getHorariosDia } from '@/api/peticiones'

// Utilidades para obtener fecha y día actual
function getDiaSemanaLetra(fecha) {
  // 0: domingo, 1: lunes, ..., 6: sábado
  const dias = ['D', 'L', 'M', 'X', 'J', 'V', 'S']
  const jsDate = new Date(fecha)
  return dias[jsDate.getDay()]
}

function getFechaHoy() {
  const hoy = new Date()
  return hoy.toISOString().slice(0, 10)
}

const fecha = ref(getFechaHoy())
const dia = ref(getDiaSemanaLetra(fecha.value))
const horas = Array.from({ length: 14 }, (_, i) => i + 1) // 1 a 14

const ausencias = ref([])
const horarios = ref([])
const error = ref(null)

const cargarDatos = async () => {
  try {
    ausencias.value = await getAusenciasFecha(fecha.value)
    // Si es sábado o domingo, no hay parte
    if (!['L', 'M', 'X', 'J', 'V'].includes(dia.value)) {
      horarios.value = []
      return
    }
    horarios.value = await getHorariosDia(dia.value)
  } catch (err) {
    error.value = err.message
  }
}

onMounted(cargarDatos)

// Helpers para filtrar por hora
function getAusenciasPorHora(hora) {
  return ausencias.value.filter(a => a.horario?.dia === dia.value && a.horario?.hora === hora)
}

function getProfesoresAusentes(hora) {
  return getAusenciasPorHora(hora)
    .map(a => a.profesor ? `${a.profesor.first_name} ${a.profesor.last_name}` : '')
    .filter(Boolean)
    .join(', ')
}

function getProfesoresPresentes(hora) {
  const ausentesIds = getAusenciasPorHora(hora).map(a => a.profesor?.id)
  const presentes = horarios.value
    .filter(h => h.hora === hora && h.profesor && !ausentesIds.includes(h.profesor.id))
    .map(h => `${h.profesor.first_name} ${h.profesor.last_name}`)
  return [...new Set(presentes)].join(', ')
}

function getGruposSinProfesor(hora) {
  const ausentesIds = getAusenciasPorHora(hora).map(a => a.profesor?.id)
  return horarios.value
    .filter(h => h.hora === hora && ausentesIds.includes(h.profesor.id))
    .map(h => h.grupo?.nombre)
    .filter(Boolean)
    .join(', ')
}

function getAulasSinProfesor(hora) {
  const ausentesIds = getAusenciasPorHora(hora).map(a => a.profesor?.id)
  return horarios.value
    .filter(h => h.hora === hora && ausentesIds.includes(h.profesor.id))
    .map(h => h.aula?.numero)
    .filter(Boolean)
    .join(', ')
}
</script>

<template>
  <div class="container mt-5">
    <h2>Parte de ausencias de hoy</h2>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="['L','M','X','J','V'].includes(dia)">
      <h4>
        {{ dia === 'L' ? 'Lunes' : dia === 'M' ? 'Martes' : dia === 'X' ? 'Miércoles' : dia === 'J' ? 'Jueves' : 'Viernes' }}
        ({{ fecha }})
      </h4>
      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Hora</th>
              <th>Profesores Ausentes</th>
              <th>Profesores Presentes</th>
              <th>Grupos sin Profesor</th>
              <th>Aulas sin Profesor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="hora in horas" :key="hora">
              <td>{{ hora }}</td>
              <td>{{ getProfesoresAusentes(hora) || '-' }}</td>
              <td>{{ getProfesoresPresentes(hora) || '-' }}</td>
              <td>{{ getGruposSinProfesor(hora) || '-' }}</td>
              <td>{{ getAulasSinProfesor(hora) || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else>
      <div class="alert alert-info">No hay parte de ausencias para hoy ({{ fecha }}).</div>
    </div>
  </div>
</template>