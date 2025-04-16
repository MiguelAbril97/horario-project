<template>
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
                  <div v-if="h.hora === hora && h.dia === dia" class="d-flex flex-column">
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
  </template>
  
  <script setup>
  defineProps({
    horarios: Array,
    dias: Array,
    horas: Array
  })
  </script>