/*
Una store de Pinia llamada viaje-store donde se almacenarán,
editaran y eliminaran las oraciones ingresadas por el usuario
en cada pilar de cada categoría
*/
import { defineStore } from 'pinia'
import { auth, db } from '../firebase'
import { doc, setDoc, DocumentSnapshot, getDoc, collection } from 'firebase/firestore'

interface Pilar {
  name: string;
  sentences: string[];
}

interface Category {
  name: string;
  pilars: { name: string;
    sentences: string[];
  }[]

}

interface FirebaseCategoriesData {
  categories: {
    name: string;
    pilars : {
      name: string;
      sentences: string[];
    }[];
  }[];
}
export const useViajeStore = defineStore({
  id: 'my-viaje-store',
  state: () => ({
    categories: [] as Category[],
    cambiosSinGuardar: 0 as number,
    datosCargados: false as boolean,
    categoriaSeleccionada: '' as string,
    pilarSeleccionado: '' as string
  }),
  getters: {
    SumarCambiosSinGuardar: (state) => state.cambiosSinGuardar + 1,
    isContadorCero ():boolean {
      return this.cambiosSinGuardar === 0
    }

  },
  actions: { /*
    addSentence (categoryName: string, pillarName: string, sentence: string) {
      const categoryIndex = this.categories.findIndex(category => category.name === categoryName)
      const pillarIndex = this.categories[categoryIndex].pillars.findIndex(pillar => pillar.name === pillarName)
      this.categories[categoryIndex].pillars[pillarIndex].sentences.push(sentence)
    }, */

    // Nuevas acciones para actualizar la categoría y el pilar seleccionados
    setCategoriaSeleccionada (categoria: string) {
      this.categoriaSeleccionada = categoria
    },
    setPilarSeleccionado (pilar: string) {
      this.pilarSeleccionado = pilar
    },
    addSentence (categoryName: string, pilarName: string, sentence: string) {
      this.$state.cambiosSinGuardar = this.$state.cambiosSinGuardar + 1
      // this.$state.cambiosSinGuardar = this.SumarCambiosSinGuardar
      const category = this.categories.find(category => category.name === categoryName)
      const categoryIndex = this.categories.findIndex(category => category.name === categoryName)

      if (!category) {
        // Si no se encuentra la categoría, se agrega una nueva con el pilar y la oración
        this.categories.push({
          name: categoryName,
          pilars: [{
            name: pilarName,
            sentences: [sentence]
          }]
        })
        console.log('add sentence 1')
      } else {
        const pilar = category.pilars.find(pilar => pilar.name === pilarName)
        const pilarIndex = this.categories[categoryIndex].pilars.findIndex(pilar => pilar.name === pilarName)
        if (!pilar) {
          // Si no se encuentra el pilar, se agrega uno nuevo con la oración
          this.categories[categoryIndex].pilars.push({
            name: pilarName,
            sentences: [sentence]
          })
          console.log('add sentence 2')
        } else {
          // Si se encuentra el pilar, se agrega la oración
          // this.categories[categoryIndex].pilars[pilarIndex].sentences.push(sentence)
          if (!pilar.sentences.includes(sentence)) {
            pilar.sentences.push(sentence)
          }
          console.log('add sentence 3')
        }
      }
    },
    editSentence (categoryName: string, pilarName: string, sentenceIndex: number, sentence: string) {
      // this.$state.cambiosSinGuardar = this.$state.cambiosSinGuardar + 1
      this.$state.cambiosSinGuardar = this.SumarCambiosSinGuardar

      const categoryIndex = this.categories.findIndex(category => category.name === categoryName)
      const pilarIndex = this.categories[categoryIndex].pilars.findIndex(pilar => pilar.name === pilarName)
      this.categories[categoryIndex].pilars[pilarIndex].sentences[sentenceIndex] = sentence
    },
    deleteSentence (categoryName: string, pilarName: string, sentenceIndex: number) {
      // this.$state.cambiosSinGuardar = this.$state.cambiosSinGuardar + 1
      this.$state.cambiosSinGuardar = this.SumarCambiosSinGuardar

      const categoryIndex = this.categories.findIndex(category => category.name === categoryName)
      const pilarIndex = this.categories[categoryIndex].pilars.findIndex(pilar => pilar.name === pilarName)
      this.categories[categoryIndex].pilars[pilarIndex].sentences.splice(sentenceIndex, 1)
    },
    async guardarCambiosFirebase () {
      // Obtener el identificador del usuario actual
      const usuarioId = auth.currentUser?.uid
      if (usuarioId) {
        // Guardar los cambios en Firebase
        await setDoc(doc(db, 'usuarios', usuarioId), {
          categories: this.categories
        })
      }
      this.$state.cambiosSinGuardar = 0
    },
    // Establecer la lista de objetos como estado inicial de la store de Pinia

    async cargaInicialColeccionFirebase () {
      if (!this.$state.datosCargados) {
        const usuarioId = auth.currentUser?.uid
        if (usuarioId) {
          // Obtener referencia a una colección

          const collectionRef = collection(db, 'usuarios', usuarioId, 'categories')
          console.log('mensaje collectionRef', collectionRef)

          // Obtener referencia a un documento
          const categoriesRef = doc(collection(db, 'usuarios'), usuarioId)
          // Obtener el documento
          const docSnap = await getDoc(categoriesRef)
          if (docSnap.exists()) {
            /*
  En este código, primero se convierten los datos de Firebase en el tipo FirebaseCategoriesData utilizando la sintaxis de aserción (as) de TypeScript.
   Luego se realiza una conversión adicional para convertir los datos a un array de Category. La conversión se realiza utilizando el método map() para
    transformar cada objeto FirebaseCategory en un objeto Category con la estructura adecuada.
  */
            const categoriesData: FirebaseCategoriesData = docSnap.data() as FirebaseCategoriesData
            console.log('categoriesData:', categoriesData)
            const categories: Category[] = categoriesData.categories.map(categoryData => {
              return {
                name: categoryData.name,
                pilars: categoryData.pilars.map(pilarData => {
                  return {
                    name: pilarData.name,
                    sentences: pilarData.sentences
                  }
                })
              }
            })
            this.$state.categories = categories// this.$state.categories.concat(categories)
            console.log('categories:', this.$state.categories)
            this.$state.datosCargados = true

            // return categories
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!')
          }
        }
      }
    }
  }
}

)
