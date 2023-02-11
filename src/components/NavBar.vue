<template>
    <q-header elevated>
      <q-toolbar>

        <q-toolbar-title>
          Diseña una Vida que Disfrutes
        </q-toolbar-title>
        <q-btn
        label="Ingresar"
        color="secondary"
        v-if="!userGoogle"
        @click="accessGoogle"
      />
      <q-btn
        label="Salir"
        color="secondary"
        v-if="userGoogle"
        @click="logoutGoogle"
      />

      </q-toolbar>
    </q-header>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'

// usar google como proveedor de autenticación
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'
import { auth } from '../firebase'

const userGoogle = inject('userGoogle')
const provider = new GoogleAuthProvider()

const accessGoogle = () => {
  console.log('accessGoogle')
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential.accessToken
      // The signed-in user info.
      const user = result.user
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code
      const errorMessage = error.message
      // The email of the user's account used.
      const email = error.customData.email
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error)
      // ...
    })
}

import { useQuasar } from 'quasar'
const $q = useQuasar()

const logoutGoogle = () => {
  signOut(auth)
    .then(() => {
      $q.loading.show()

      // Sign-out successful.
      console.log('logout de Google exitoso')
      setTimeout(() => {
        $q.loading.hide()
        // userGoogle.value = false;
      }, 1000)
    })
    .catch((error) => {
      console.log('error: ' + error)

      // An error happened.
    })
}
</script>
