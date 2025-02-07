<template>
  <router-view />
</template>

<script setup="" lang="ts">
  import { ref, provide } from 'vue'
  import { onAuthStateChanged } from 'firebase/auth'
  import { auth } from './firebase'
  import { useRouter } from 'vue-router'
  import { useQuasar } from 'quasar'

  const userGoogle = ref(null)
  provide('userGoogle', userGoogle)

  const $q = useQuasar()
  const router = useRouter()

  onAuthStateChanged(auth, (user) => {
  if (user) {
  userGoogle.value = user
  console.log('Usuario autenticado:', user)

  // Redirige a la ruta /viaje cuando el usuario esté autenticado
  setTimeout(() => {
  router.push('/viaje')
  $q.loading.hide()
  }, 1000)
  } else {
  // Si el usuario no está autenticado, oculta el loader
  setTimeout(() => {
  $q.loading.hide()
  }, 1000)
  }
  })

  // Muestra el loader mientras se verifica el estado de autenticación
  $q.loading.show()
</script>













