import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '../firebase';
import { doc, setDoc, updateDoc, collection, query, orderBy, limit, startAfter, getDocs, getDoc, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
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
  const lastVisible = ref<any>(null);
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

      console.log('Declaraciones cargadas:', JSON.stringify(declaraciones.value, null, 2));
      lastVisible.value = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
    } catch (error) {
      console.error("Error al cargar declaraciones:", error);
    }
  }

  async function cargarMasDeclaraciones() {
    if (lastVisible.value) {
      try {
        const q = query(collection(db, 'declaracionesPublicas'), orderBy('compartidos', 'desc'), startAfter(lastVisible.value), limit(10));
        const querySnapshot = await getDocs(q);
        console.log('Documentos en la colección declaracionesPublicas (cargar más):');
        querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          console.log('Documento:', doc.id, 'Datos:', JSON.stringify(data, null, 2));
          if (Array.isArray(data.declaraciones)) {
            data.declaraciones.forEach(declaracion => {
              declaraciones.value.push(declaracion);
            });
          } else {
            console.log('Declaración individual:', data);
            declaraciones.value.push({ id: doc.id, ...data } as Declaracion);
          }
        });
        console.log('Más declaraciones cargadas:', JSON.stringify(declaraciones.value, null, 2));
        lastVisible.value = querySnapshot.docs[querySnapshot.docs.length - 1];
      } catch (error) {
        console.error("Error al cargar más declaraciones:", error);
      }
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
    cargarMasDeclaraciones,
    actualizarDeclaracion
  };
});
