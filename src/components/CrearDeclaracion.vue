<template>
  <div class="declaracion-container">
    <div class="declaracion-content">
      <q-input
        v-model="declaracion"
        maxlength="250"
        hint="Máximo 250 caracteres"
        counter
        class="declaracion-input"
      />
      <div class="selectors-row">
        <q-select v-model="categoria" :options="categorias" label="Categoría" class="declaracion-select" />
        <q-select v-model="pilar" :options="pilares" label="Pilar" class="declaracion-select" />
      </div>
     <q-btn label="Declarar" @click="guardarDeclaracion" class="declaracion-btn" :disabled="isButtonDisabled" />

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDeclaracionesStore } from '../stores/declaraciones-Store'
import { useViajeStore } from '../stores/viaje-Store'

const declaracion = ref('')
const categoria = ref('')
const pilar = ref('')
const categorias = ['Salud', 'Intelecto', 'Personalidad', 'Finanzas', 'Carrera', 'Emociones', 'Calidad de Vida', 'Relaciones', 'Vision General']
const pilares = ['Vision', 'Proposito', 'Creencias', 'Estrategia']

const storeGlobal = useDeclaracionesStore()
const storeViaje = useViajeStore()

const isButtonDisabled = computed(() => !categoria.value || !pilar.value)

const guardarDeclaracion = () => {
  const declData = {
    texto: declaracion.value,
    categoria: categoria.value,
    pilar: pilar.value
  }

  // Guardar en store global de declaraciones
  storeGlobal.agregarDeclaracion(declData)

  // Guardar en viajeStore
  storeViaje.addSentence(categoria.value, pilar.value, declaracion.value)

  // Limpiar campos
  declaracion.value = ''
  categoria.value = ''
  pilar.value = ''
}

</script>

<style lang="sass" scoped>

.declaracion-btn:disabled
  background-color: #ccc
  cursor: not-allowed

.declaracion-container
  background-color: #f5f5f5
  padding: 20px
  border-radius: 10px
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1)
  max-width: 600px
  margin: 40px auto

.declaracion-title
  color: #333
  text-align: center
  margin-bottom: 20px

.declaracion-content
  display: flex
  flex-direction: column
  gap: 15px

.declaracion-input, .declaracion-select
  background-color: #fff
  border: 1px solid #e0e0e0
  border-radius: 5px
  padding: 10px
  font-size: 16px
  color: #333

.declaracion-counter
  color: #666
  font-size: 14px
  text-align: right

.declaracion-btn
  background-color: #4CAF50
  color: #fff
  padding: 10px 20px
  border-radius: 5px
  cursor: pointer
  transition: background-color 0.3s

  &:hover
    background-color: #45a049

.selectors-row
  display: flex
  justify-content: space-between
  gap: 10px

.declaracion-select
  flex: 1
  margin-right: 5px

  &:last-child
    margin-right: 0
</style>
