<template>
  <q-layout view="lHh lpr lFf" container style="height: 50px" class="shadow-2 align-center bg-primary rounded-borders">

  <q-footer elevated class="bg-secundary-8 text-white">

        <q-toolbar>

            <q-btn
          label="Salir"
          color="secondary"
          v-if="userGoogle"
          @click="logoutGoogle"
        />
        </q-toolbar>
  </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { inject } from 'vue'

// usar google como proveedor de autenticación
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'

const userGoogle = inject('userGoogle')

import { useQuasar } from 'quasar'
const $q = useQuasar()

import { useRouter } from 'vue-router'
const router = useRouter()
/* No me resulto. eliminable
const FooterBar = defineComponent({
  name: 'MyComponent',
  components: {
  }
  // Your component logic here
})
*/
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
      router.push('/').then(() => {
        router.go()
      })
    })
    .catch((error) => {
      console.log('error: ' + error)

      // An error happened.
    })
}
</script>
