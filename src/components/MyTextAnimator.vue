<template>
  <div class="q-pa-md">
    <h4 ref="textContainer"></h4>
  </div>
</template>

<script>
/*   <button v-if="showButton" @click="doSomething">Quiero diseñar mi mente subconciente</button>
//

*/
export default {
  props: {
    text: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showButton: false
    }
  },
  unmounted () {
    // Llamar al método showText cuando el componente se monte
    // this.$refs.textContainer.innerHTML = ''
  },
  mounted () {
    // Llamar al método showText cuando el componente se monte
    this.showText()
  },
  methods: {
    async showText () {
      // si innerhtml esta null no hace nada
      const container = this.$refs.textContainer
      if (container) {
        this.$refs.textContainer.innerHTML = ''
        // Divide el texto en letras
        const textArray = this.text.split('')
        // Recorre cada letra y las agrega al div
        if (this.$refs.textContainer.innerHTML !== null) {
          for (let i = 0; i < textArray.length; i++) {
            this.$refs.textContainer.innerHTML += textArray[i]
            // Pausa entre cada letra
            await this.sleep(50)
          }
        }
      }
      // Habilita el botón cuando se haya completado la animación
    },
    sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    doSomething () {
      console.log('Haz algo')
    }
  }

}
</script>
