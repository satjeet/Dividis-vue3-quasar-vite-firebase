<template>

  <div class="q-pa-xs q-ma-xs" style="min-height: 600px">
    <q-tab-panels
      v-model="panel"
      animated
      swipeable
      vertical
      class="bg-black text-white shadow-2 rounded-borders"
    >
      <q-tab-panel name="mails">
        <q-parallax :height="600" :speed="0.8">
          <template v-slot:media>

            <img src="https://lascebrassalen.com/wp-content/uploads/2022/09/002-1024x682.jpg">
          </template>

          <div class="bg-black q-pa-none q-ma-none" style="opacity: 0.6 ">

            <MyTextAnimator class="text-white q-pa-md" text=" La CONCIENCIA es nuestra mente creativa pero solo puede procesar alrededor de  40 bits de información por segundo" />
          </div>

       </q-parallax>
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
            <MyTextAnimator class="text-white q-pa-xs" text=" Esta es TU Oportunidad de alinear tu Subconsciente con tu Conciencia." />

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
import { Todo, Meta } from 'components/models'
// import ExampleComponent from 'components/ExampleComponent.vue'
import { defineComponent, ref } from 'vue'
/*
    <example-component
      title="Example component"
      active
      :todos="todos"
      :meta="meta"
    ></example-component>

ExampleComponent

*/
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
    LogingGoogle () {
      console.log('accessGoogle')
    }

  },
  setup () {
    // Este componente usa un ciclo v-for para iterar sobre las palabras del texto y mostrarlas letra por letra. La función typeWords usa un bucle anidado para escribir cada letra de cada palabra y la función sleep se utiliza para simular el sonido de tecleo con un retardo de 100 milisegundos entre cada letra. La propiedad value de words se actualiza después de escribir cada letra.
    const todos = ref<Todo[]>([
      {
        id: 1,
        content: 'ct1'
      },
      {
        id: 2,
        content: 'ct2'
      },
      {
        id: 3,
        content: 'ct3'
      },
      {
        id: 4,
        content: 'ct4'
      },
      {
        id: 5,
        content: 'ct5'
      }
    ])
    const meta = ref<Meta>({
      totalCount: 1200
    })
    return {
      todos,
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
