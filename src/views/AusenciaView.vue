<script setup>
import { ref, onMounted } from 'vue'
import { getAusenciasFecha, getAusenciasProfe, getHorariosDia, 
  deleteAusencia, getGuardias, enviarParteAusencias } from '@/api/peticiones'
import { useUserStore } from '@/stores/usuario' 
import html2pdf from 'html2pdf.js';

// Utilidades para obtener fecha y día actual
function getDiaSemanaLetra(fecha) {
  // 0: domingo, 1: lunes, ..., 6: sábado
  const dias = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  const jsDate = new Date(fecha);
  return dias[jsDate.getDay()];
}

function getFechaHoy() {
  const hoy = new Date()
  return hoy.toISOString().slice(0, 10)
}

const fecha = ref(getFechaHoy());
const dia = ref(getDiaSemanaLetra(fecha.value));
const horas = Array.from({ length: 14 }, (_, i) => i + 1)

const userStore = useUserStore();
const profesor = ref(userStore.usuario); 

const guardias = ref([]);

const ausencias = ref([]);
const horarios = ref([]);
const error = ref(null);
const misAusencias = ref([]);
const pdfError = ref(null);

const loading = ref(false);

const cargarDatos = async () => {
  loading.value = true;
  try {
    profesor.value = userStore.usuario;
    ausencias.value = await getAusenciasFecha(fecha.value);
    if (profesor.value && profesor.value.id) {
      misAusencias.value = await getAusenciasProfe(profesor.value.id);
    } else {
      misAusencias.value = [];
    }
    horarios.value = await getHorariosDia(dia.value);
    guardias.value = await getGuardias(dia.value);
    misAusencias.value = [...misAusencias.value].sort((a,b)=> a.fecha - b.fecha)

  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

onMounted(cargarDatos)

function getProfesoresAusentesPorHora(hora) {
  // Devuelve los nombres de profesores ausentes en esa hora
  return ausencias.value
    .filter(a => a.horario.hora === hora)
    .map(a => `${a.profesor.first_name} ${a.profesor.last_name}`)
    .join(', ');
}

function getProfesoresGuardiaPorHora(hora) {
  return guardias.value
    .filter(g => g.hora === hora)
    .map(g => `${g.profesor.first_name} ${g.profesor.last_name}`)
    .join(', ');
}

function getGruposSinProfesorPorHora(hora) {
  // Devuelve los nombres de grupos sin profesor en esa hora
  return ausencias.value
    .filter(a => a.horario.hora === hora)
    .map(a => a.horario.grupo.nombre)
    .join(', ');
}

function getAulasSinProfesorPorHora(hora) {
  // Devuelve los nombres de aulas sin profesor en esa hora
  return ausencias.value
    .filter(a => a.horario.hora === hora)
    .map(a => a.horario.aula.numero)
    .join(', ');
}

function descargarPDF() {
  const tabla = document.getElementById('tabla-ausencias');
  if (tabla) {
    html2pdf().from(tabla).set({
      margin: 0.5,
      filename: `parte_ausencias_${fecha.value}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    }).save();
  }
}

async function enviarPartePorCorreo() {
  const tabla = document.getElementById('tabla-ausencias');
  if (tabla) {
    const opt = {
      margin: 0.5,
      filename: `parte_ausencias_${fecha.value}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    };
    const pdfBlob = await html2pdf().from(tabla).set(opt).outputPdf('blob');
    try{
      await enviarParteAusencias(pdfBlob);

    }catch (err){
      pdfError.value = 'Error al enviar el parte por correo.'
    }
  }
}
</script>

<template>
  <div v-if="loading" class="d-flex justify-content-center align-items-center my-5">
    <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </div>
  <div v-else>
      <div class="container mt-5">
    <h2>Parte de ausencias de hoy</h2>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="['L','M','X','J','V'].includes(dia)">
      <h4>
        {{ dia === 'L' ? 'Lunes' : dia === 'M' ? 'Martes' : dia === 'X' ? 'Miércoles' : dia === 'J' ? 'Jueves' : 'Viernes' }}
        ({{ fecha }})
      </h4>
      <div class="table-responsive" id="tabla-ausencias">
        <table class="table table-bordered table-striped">
          <thead>
            <tr>
                <th class="bg-dark text-white text-center">Hora</th>
                <th class="bg-dark text-white text-center">Profesores Ausentes</th>
                <th class="bg-dark text-white text-center">Profesores Presentes</th>
                <th class="bg-dark text-white text-center">Grupos sin Profesor</th>
                <th class="bg-dark text-white text-center">Aulas sin Profesor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="hora in horas" :key="hora">
              <td>{{ hora }}</td>
              <td>{{ getProfesoresAusentesPorHora(hora) || '-' }}</td>
              <td>{{ getProfesoresGuardiaPorHora(hora) || '-' }}</td>
              <td>{{ getGruposSinProfesorPorHora(hora) || '-' }}</td>
              <td>{{ getAulasSinProfesorPorHora(hora) || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="input-group">
        <button class="btn btn-primary mb-3" @click="descargarPDF">
          Descargar PDF
        </button>
        <button class="btn btn-secondary mb-3 ms-2" @click="enviarPartePorCorreo">
          Enviar por correo
        </button>
      </div>
      <p v-if="pdfError" class="alert alert-danger">{{ pdfError.value }}</p>
    </div>
    <div v-else>
      <div class="alert alert-info">No hay parte de ausencias para hoy ({{ fecha }}).</div>
    </div>
  </div>
  
  <div class="container mt-5">
    <h2>Ausencias del usuario</h2>
    <div class="list-group" v-for="ausencia in misAusencias" :key="ausencia.id">
      <li class="list-group-item list-group-item-action">
        {{ ausencia.fecha }} / {{ ausencia.id }}
        <button type="button" 
        class="btn btn-outline-danger" @click="deleteAusencia(ausencia.id)">Delete</button>
      </li>
    </div>
  </div>
  </div>
</template>
<style scoped>
.table-bordered > tbody > tr {
  border-bottom: 2px solid #dee2e6;
}
.table-bordered > tbody > tr > td {
  border-bottom: 2px solid #dee2e6;
}
</style>