<template>
  <router-view />
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'

import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
const router = useRouter()

const userGoogle = ref(false)
provide('userGoogle', userGoogle)
const $q = useQuasar()
onAuthStateChanged(auth, (user) => {
  if (user) {
  // User is signed in, see docs for a list of available properties
  // https://firebase.google.com/docs/reference/js/firebase.User
  // const uid = user.uid;
    userGoogle.value = user
    router.push('/Viaje')
    console.log(user)
    setTimeout(() => {
      $q.loading.hide()
    }, 1000)
  // ...
  } else {
    setTimeout(() => {
      $q.loading.hide()
    }, 1000)

  // User is signed out
  // ...
  }
})
$q.loading.show()

</script>
