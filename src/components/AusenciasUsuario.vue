<template>
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
</template>
<script setup>
defineProps({
  misAusencias: Array,
})
</script>