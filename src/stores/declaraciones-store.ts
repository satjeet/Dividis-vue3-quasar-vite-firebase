import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '../firebase';
import { doc, updateDoc, collection, getDocs, getDoc, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { useViajeStore } from './viaje-store';

export interface Declaracion {
  id: string;
  texto: string;
  pilar: string;
  categoria: string;
  creadorId: string;
  compartidos: number;
  reacciones: {
    meEncanta: number;
    estaOk: number;
    mejorCambiala: number;
  };
  usuariosReaccionaron: string[];
  usuariosCompartieron: string[];
}

export const useDeclaracionesStore = defineStore('declaraciones', () => {
  const declaraciones = ref<Declaracion[]>([]);
  const viajeStore = useViajeStore();

  async function cargarDeclaraciones() {
    try {
      console.log("Cargando declaraciones...");
      const querySnapshot = await getDocs(collection(db, 'declaracionesPublicas'));

      declaraciones.value = []; // Limpiar antes de llenar

      console.log('Número de documentos en la colección declaracionesPublicas:', querySnapshot.size);
      console.log('Documentos en la colección declaracionesPublicas:');
      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        console.log('Documento ID:', doc.id);
        console.log('Datos del documento:', JSON.stringify(data, null, 2));

        if (Array.isArray(data.declaraciones)) {
          console.log('Número de declaraciones en el documento:', data.declaraciones.length);
          data.declaraciones.forEach(declaracion => {
            console.log('Declaración:', JSON.stringify(declaracion, null, 2));
            declaraciones.value.push(declaracion);
          });
        } else {
          // Si cada documento es una declaración en sí misma
          console.log('Declaración individual:', JSON.stringify(data, null, 2));
          declaraciones.value.push({ id: doc.id, ...data } as Declaracion);
        }
      });

      // Ordenar todas las declaraciones por la cantidad de veces que han sido compartidas
      declaraciones.value.sort((a, b) => b.compartidos - a.compartidos);

      console.log('Declaraciones cargadas:', JSON.stringify(declaraciones.value, null, 2));
    } catch (error) {
      console.error("Error al cargar declaraciones:", error);
    }
  }

  async function actualizarDeclaracion(declaracion: Declaracion) {
    try {
      const docRef = doc(db, 'declaracionesPublicas', `${declaracion.categoria}-${declaracion.pilar}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const declaraciones = docSnap.data().declaraciones.map((decl: Declaracion) => decl.id === declaracion.id ? declaracion : decl);
        await updateDoc(docRef, { declaraciones });
        console.log('Declaración actualizada:', JSON.stringify(declaracion, null, 2));
      }
    } catch (error) {
      console.error("Error al actualizar declaración:", error);
    }
  }

  return {
    declaraciones,
    cargarDeclaraciones,
    actualizarDeclaracion
  };
});
