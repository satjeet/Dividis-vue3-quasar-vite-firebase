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
          <a href="URL_PARA_SALIR" class="exit-button slider-link">Salir</a>
          <div class="led-message">{{ section.text }}</div>
          <a href="URL_PARA_LOGIN" class="login-button slider-link">Login</a>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data () {
    return {
      sections: [
        { id: 1, text: 'Los sueños sin plan son solo deseos. ¿Listo para más?', next: 2 },
        { id: 2, text: 'Establece tu visión y vive con propósito. Adopta creencias que te impulsen y estrategias que te transformen.', next: 3 },
        { id: 3, text: 'Comienza a diseñar tu camino, con una simple eleccion.' }
      ]
    }
  },
  methods: {
    scrollTo (sectionId) {
      const sectionElement = this.$el.querySelector(`.section:nth-child(${sectionId})`)
      sectionElement.scrollIntoView({ behavior: 'smooth' })
    },
    exitApp () {
      // Código para salir de la aplicación
    },
    login () {
      // Código para manejar el login
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
      box-shadow: 0 0 10px orange, 0 0 20px orange, 0 0 30px orange;
    }

    .exit-button, .login-button {
      margin-top: 50px;
      margin-bottom: 50px;
      justify-content: center;

      width: 100%;
      max-width: 300px;
      padding: 15px 0;
      border-radius: 30px;
    }
  }
}

.slider-link {
  display: block;
  width: 100%;
  max-width: 300px;
  padding: 15px 0;
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
