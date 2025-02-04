<template>
  <div class="index-page">
    <div v-for="section in sections" :key="section.id" class="section">
      <div class="content">
        <div v-if="section.id !== 3" class="text-with-led">
          {{ section.text }}
        </div>
        <!-- Flechas solo en secciones antes de la final -->
        <q-btn v-if="section.next" @click="scrollTo(section.next)" icon="south" color="orange" round dense class="next-button" />
        <div v-if="section.id === 3" class="final-content">
          <q-btn href="https://www.youtube.com/watch?v=VPRjCeoBqrI&list=PLVLTpK34Hy3kr2h9twqWdApiKxpfhn9Rh&index=1&ab_channel=Coldplay" class="exit-button slider-link" icon="logout" label="Regresar a mi zona de confort" />
          <div class="led-message q-mt-md">{{ section.text }}</div>

          <div class="q-pa-md">
            <q-list bordered separator>
              <!-- Si el usuario NO está autenticado, mostrar el botón para iniciar sesión -->
              <q-slide-item class="led-message text-with-led slider-link" left-color="black" v-if="!userGoogle" @left="LogingGoogle">
                <template v-slot:left>
                  <q-icon name="sentiment_very_satisfied" />
                  QUE DISFRUTES EL VIAJE
                </template>
                <q-item @click="LogingGoogle">
                  <q-item-section avatar>
                     <q-icon name="start" />
                  </q-item-section>
                  <q-item-section>Desliza pra comenzar</q-item-section>
                </q-item>
              </q-slide-item>

              <!-- Si el usuario está autenticado, mostrar su nombre y opción para comenzar -->
              <q-slide-item class="led-message text-with-led slider-link" left-color="black" v-if="userGoogle">
                <template v-slot:left>
                  <q-icon name="sentiment_very_satisfied" />
                  Bienvenido, {{ userGoogle.displayName || userGoogle.email }}
                </template>
                <q-item @click="startJourney">
                  <q-item-section avatar>
                     <q-icon name="start" />
                  </q-item-section>
                  <q-item-section>Comenzar</q-item-section>
                </q-item>
              </q-slide-item>
            </q-list>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { inject } from 'vue'
import { useQuasar } from 'quasar'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from 'src/firebase'

export default {
  name: 'IndexPage',
  setup () {
    const userGoogle = inject('userGoogle') // Obtenemos el estado del usuario
    const $q = useQuasar() // Asegúrate de que Quasar Notify está habilitado

    const LogingGoogle = async () => {
      try {
        const provider = new GoogleAuthProvider()
        await signInWithPopup(auth, provider)
        $q.notify({
          type: 'positive',
          message: 'Inicio de sesión exitoso. ¡Bienvenido!'
        })
      } catch (error) {
        console.error('Error en el inicio de sesión:', error)
        $q.notify({
          type: 'negative',
          message: 'Error al iniciar sesión con Google'
        })
      }
    }

    const startJourney = () => {
      // Redirigir al viaje si el usuario está autenticado
      if (userGoogle) {
        this.$router.push('/viaje')
      }
    }

    return {
      sections: [
        { id: 1, text: 'Los sueños sin plan son solo deseos. ¿Listo para más?', next: 2 },
        { id: 2, text: 'Establece tu visión y vive con propósito. Adopta creencias que te impulsen y estrategias que te transformen.', next: 3 },
        { id: 3, text: 'Comienza a diseñar tu camino, con una simple eleccion.' }
      ],
      userGoogle,
      LogingGoogle,
      startJourney,
      scrollTo (sectionId) {
        const sectionElement = this.$el.querySelector(`.section:nth-child(${sectionId})`)
        sectionElement.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.index-page {
  .section {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center; // Centra el contenido en el medio verticalmente
    background: #091d25;
    position: relative; // Posición relativa para el posicionamiento absoluto de la flecha
  }

  .content {
    width: 80%;
    max-width: 800px;
    margin: 0 auto; // Centrado horizontal
    // Ajuste de la altura para el contenido principal para evitar que crezca demasiado
    padding: 20vh 0; // Proporciona espacio arriba y abajo dentro de la sección
    box-sizing: border-box;

    .text-with-led {
      font-size: 2em; // Ajuste para el tamaño del texto
      color: orange;
      padding: 20px;
      border: 3px solid orange;
      border-radius: 15px;
      animation: neon-orange 0.8s ease-in-out infinite alternate;
      // Posicionamiento ajustado para mantener el cuadro en el centro
      margin: auto 0;
    }
  }

  // Posiciona la flecha en la parte inferior de la sección
  .next-button {
    position: absolute;
    bottom: 5vh; // Ajuste para colocar la flecha cerca del final de la pantalla
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }

  .final-content {
    height: 33.33vh; // El último tercio de la pantalla
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .led-message {
      font-size: 2em;
      color: orange;
      padding: 20px;
      border: 5px solid orange;
      border-radius: 15px;
      animation: blink 1s linear infinite;
      background-color: black;

      box-shadow: 0 0 10px orange, 0 0 20px orange, 0 0 30px orange;
    }

    .exit-button, .login-button {
      font-size: 10px;
      text-align: center; /* Centra el texto horizontalmente */
      width: 100%;
      max-width: 200px;
      border-radius: 30px;
    }
  }
}

.slider-link {
  display: block;
  width: 100%;
  max-width: 300px;
  padding: 5px 0;
  border-radius: 30px;
  text-align: center;
  color: white;
  background-color: orange;
  text-decoration: none;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateX(10px); // Desliza el botón hacia la derecha al pasar el mouse
  }
}

// Responsividad para dispositivos más pequeños
@media (max-width: 768px) {
  .index-page .content .text-with-led {
    font-size: 1.5em; // Tamaño más pequeño para tabletas y móviles
  }
  .index-page .final-content .led-message {
    font-size: 1.5em;
  }
}

@media (max-width: 480px) {
  .index-page .content .text-with-led {
    font-size: 1.2em; // Tamaño más pequeño para teléfonos móviles
  }
  .index-page .final-content .led-message {
    font-size: 1.2em;
  }
}

// Keyframes para animaciones
@keyframes blink {
  50% { color: #091d25; }
}

@keyframes neon-orange {
  from {
    box-shadow: 0 0 5px orange, 0 0 10px orange, 0 0 15px orange;
    color: #ff9800;
    border-color: #ff9800;
  }
  to {
    box-shadow: 0 0 10px #ff9800, 0 0 15px #ff9800, 0 0 20px #ff9800;
    color: orange;
    border-color: orange;
  }
}
</style>
