<script setup>
import { ref } from 'vue'
import { subirHorario } from '@/api/peticiones'
import { useRouter } from 'vue-router';

const errorArchivo = ref(null)

const onFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async function(e) {
      const text = e.target.result;
      try {
        await subirHorario(file);
        /* Envía el texto a Chatbase, asi actualizamos los datos del bot.
        Para eso se necesitaria un plan de pago, aunque en la pagina dice que no :v
        await fetch('https://www.chatbase.co/api/v1/update-chatbot-data', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer TU_API_KEY',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chatbotId: '9pVXnzsBmOSXFU0PaGI80',
            chatbotName: 'Asistente de Horarios',
            sourceText: text
          })
        });*/
      } catch (err) {
        errorArchivo.value = err.message
      }
    };
    //reader.readAsText(file);
  }
};

 

</script>

<template>
  <div class="card mt-4">
        <div class="card-header bg-warning text-dark text-center">
        <strong class="fs-3">¡Atención!</strong>
        </div>
        <div class="card-body">
        <p class="fs-5">
            Al subir un nuevo horario se perderán todos los datos actuales (usuarios, horarios, ausencias...) y se reemplazarán por los nuevos.
        </p>
        <div class="input-group mb-3 justify-content-center">
            <input
            type="file"
            class="form-control form-control-lg w-auto custom-file-input-estilizado"
            id="inputGroupFile01"
            @change="onFileChange"
            accept=".csv,.txt"
            >
        </div>
        
        <small class="form-text text-muted fs-6">
        Solo se aceptan archivos <strong>.txt</strong> o <strong>.csv</strong>
        </small>

        <p v-if="errorArchivo" class="text-danger fs-5 text-center">Error: {{ errorArchivo }}</p>
        </div>
  </div>
</template>

<style scoped>
.fs-3 {
  font-size: 2rem;
}
.fs-5 {
  font-size: 1.25rem;
}
.custom-file-input-estilizado {
  border: 2px dashed #ffc107;
  padding: 1.2rem;
  background: #fffbea;
  cursor: pointer;
  transition: border-color 0.2s;
}
.custom-file-input-estilizado:hover, .custom-file-input-estilizado:focus {
  border-color: #ff9800;
  background: #fff3cd;
}
</style>