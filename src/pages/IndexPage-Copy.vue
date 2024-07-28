<template>

  <div class="screen-container">
    <q-tab-panels
      v-model="panel"
      animated
      swipeable
      vertical

      class="shadow-2"
    >
      <q-tab-panel name="mails">
        <div class="panel-content">
        <q-parallax :height="600" :speed="0.9">
          <template v-slot:media>

            <img src="https://lascebrassalen.com/wp-content/uploads/2022/09/002-1024x682.jpg">
          </template>

          <div class="text-overlay">

            <MyTextAnimator class="text-matrix-orange q-pa-md" text=" La CONCIENCIA es nuestra mente
             creativa pero solo puede procesar alrededor de  40 bits de información por segundo" />
          </div>

       </q-parallax>
      </div>

      </q-tab-panel>

      <q-tab-panel name="alarms">
        <q-parallax :height="600" :speed="0.9">
        <template v-slot:media >

          <img src="https://i0.wp.com/doquanticoaocosmico.com/wp-content/uploads/2022/04/118fa-mentes-como-funcionam.jpg">
        </template>
        <div class="bg-black q-pa-xs q-ma-xs" style="opacity: 0.6">
         <MyTextAnimator class="text-white q-pa-md" text=" El SUBCONCIENTE es la mente del mamifero que evoluciono para sobrevivir en la naturaleza, usando todos sus sentidos y repitiendo lo que haya sido seguro
          antes, logrando procesar 40 millones de bits de informacion por segundo." />

        </div>
       </q-parallax>
      </q-tab-panel>

      <q-tab-panel name="movies" style=" background-image: url(https://cdn.pixabay.com/photo/2019/03/11/09/18/universe-4048123_960_720.jpg)">

          <div class="bg-black q-pa-none q-mt-xs" style=" background-image: url(https://cdn.pixabay.com/photo/2019/03/11/09/18/universe-4048123_960_720.jpg);opacity: 0.6 ; max-height: 300px">
            <div class="row justify-begin">
              <q-btn href="https://www.youtube.com/watch?v=oEpIJI-z5Vw&list=PLVLTpK34Hy3kr2h9twqWdApiKxpfhn9Rh&index=1" color="red-5" icon="logout" label="Regresar a mi zona de confort" />
            </div>
            <MyTextAnimator class="text-white q-pa-xs" text=" Esta es tu OPORTUNIDAD de alinear tu Subconsciente con tu Conciencia." />

          </div>

        <div class="q-pa-md">

        <q-list bordered separator>

          <q-slide-item @left="LogingGoogle">
            <template v-slot:left>

              <q-icon name="sentiment_very_satisfied" />
              QUE DISFRUTES EL VIAJE
            </template>

            <q-item class="bg-blue">
              <q-item-section avatar>
                 <q-icon name="start" />
              </q-item-section>
              <q-item-section>Comienzar a diseñar mi vida</q-item-section>
            </q-item>
          </q-slide-item>

          </q-list>
        </div>
           <q-card class="my-card">
          <q-img src="https://standard.kz/storage/articles/0HyKn5hVBIsCnpyqpWP5lzQkMvVpqJwV4AXgr6nI.webp">

          </q-img>
        </q-card>

        </q-tab-panel>

      </q-tab-panels>
    </div>

</template>

<script lang="ts">
import MyTextAnimator from 'components/MyTextAnimator.vue'
import { Meta } from 'components/models'
// import ExampleComponent from 'components/ExampleComponent.vue'
import { defineComponent, ref } from 'vue'
// import { GoogleAuthProvider } from 'firebase/auth'
// import { auth } from '../firebase'
// import { useRouter } from 'vue-router' // Asegúrate de importar useRouter
/*
    <example-component
      title="Example component"
      active
      :todos="todos"
      :meta="meta"
    ></example-component>

ExampleComponent

*/
// const provider = new GoogleAuthProvider()

export default defineComponent({
  name: 'IndexPage',
  components: { MyTextAnimator },
  /* data () {
    return {
      text: 'Este es el texto a escribir letra por letra',
      words: []
    }
  }, */
  /*
  mounted () {
    this.words = this.text.split(' ')
    this.typeWords()
  }, */
  methods: {

  },
  setup () {
    // const router = useRouter() // Utiliza useRouter para tener acceso al enrutador de vue

    // Este componente usa un ciclo v-for para iterar sobre las palabras del texto y mostrarlas letra por letra. La función typeWords usa un bucle anidado para escribir cada letra de cada palabra y la función sleep se utiliza para simular el sonido de tecleo con un retardo de 100 milisegundos entre cada letra. La propiedad value de words se actualiza después de escribir cada letra.

    const meta = ref<Meta>({
      totalCount: 1200
    })
    return {
      meta,
      panel: ref('mails'),
      step: ref(1),
      onLeft () {
        console.log('left')
      }
    }
  }
})
</script>

<style lang="scss" scoped>
$primary-color: #2980b9;
$secondary-color: #091d25;
$overlay-color: rgba(0, 0, 0, 0.7);
$text-color: #ffffff;
$font-size-large: 3.5rem;
$font-size-medium: 1.1rem;
$font-size-small: 0.5rem ;
$matrix-fondo: #091d25  ;
$matrix-neon: #091d25  ;
$matrix-orange: #fea444;
$matrix-green: #52fd00;

$matrix-overlay: rgba(13, 27, 42, 0.85);

.screen-container {
  min-height: 650px;
  margin: 0px 15px 0px 15px;
  .q-tab-panel {
    position: relative;
    .q-parallax {

      border: 9px solid $matrix-orange;
      padding: 0rem;
      border-radius: 45px;
      box-shadow: 0 4px 10px 0px $matrix-orange,0 4px 10px 0px $matrix-orange,0 4px 10px 0px $matrix-orange; // Efecto de luz LED
      .text-overlay {
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        text-align: center;

      }
      img {
        position: absolute;
        top: -33px;
        width: 100%;
        height: 100%;
        object-fit: cover; // Cubre el área del contenedor, podría cortar partes de la imagen
        border-radius: 36px;

      }
    }
  }
  .text-content {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: $matrix-orange;
    font-size: $font-size-small;
    margin: 0 0 5px;
    line-height: 1.6;
    font-weight: bold;
  }
  .text-white {
    color: $text-color;
    font-size: $font-size-medium;
  }
  .panel-content {
    background-color: $matrix-fondo;
  }
  .shadow-2 {
    background-color: $matrix-fondo;
    border: none;
  }
  .text-matrix-orange {
    color: $matrix-orange;
    font-size: $font-size-medium;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 2px; // Espacio alrededor del texto para mejorar la legibilidad
    border-radius: 10px; // Bordes suavemente redondeados para el fondo
  }
  .scroll-indicator {
    color: $text-color;
    font-size: $font-size-small;
    margin-top: 10px;
  }
}

// Media queries for responsive adjustments
@media (max-width: 1200px) { // Tablets and small desktops
  .text-content,
  .text-white,
  .text-matrix-orange {
    font-size: $font-size-medium;
  }
  .q-tab-panel .q-parallax .text-overlay {
    padding: 1.5rem;
    border-radius: 10px;
  }
}

@media (max-width: 768px) { // Mobile devices
  .screen-container {
    margin: 0 15px 20px;
  }
  .text-content,
  .text-white,
  .text-matrix-orange {
    font-size: $font-size-small;
  }
  .q-tab-panel .q-parallax .text-overlay {
    padding: 1rem;
    border-radius: 5px;
  }
  .q-tab-panel {
    .q-parallax img {
      border-radius: 5px;
    }
  }
}
</style>
