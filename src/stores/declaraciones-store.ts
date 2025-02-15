import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '../firebase';
import { doc, updateDoc, collection, getDocs, getDoc, setDoc, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { useViajeStore } from './viaje-store';
import type { Declaracion } from '../types/declaracion';

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
            declaraciones.value.push({
              ...declaracion,
              esPublica: true
            });
          });
        } else {
          // Si cada documento es una declaración en sí misma
          console.log('Declaración individual:', JSON.stringify(data, null, 2));
          declaraciones.value.push({
            id: doc.id,
            ...data,
            esPublica: true
          } as Declaracion);
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
      // Update local store first for immediate reactivity
      declaraciones.value = declaraciones.value.map(decl =>
        decl.id === declaracion.id ? { ...declaracion, esPublica: true } : decl
      );

      // Then update Firebase
      const docRef = doc(db, 'declaracionesPublicas', `${declaracion.categoria}-${declaracion.pilar}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const declaracionesFirebase = docSnap.data().declaraciones.map((decl: Declaracion) =>
          decl.id === declaracion.id ? { ...declaracion, esPublica: true } : decl
        );
        await updateDoc(docRef, { declaraciones: declaracionesFirebase });
        console.log('Declaración actualizada:', JSON.stringify(declaracion, null, 2));
      }
    } catch (error) {
      console.error("Error al actualizar declaración:", error);
      // Rollback on error
      await cargarDeclaraciones();
    }
  }

  async function agregarDeclaracion(declaracion: Declaracion) {
    try {
      // Actualizar el estado local primero
      const declaracionConPublica = { ...declaracion, esPublica: true };
      declaraciones.value = [declaracionConPublica, ...declaraciones.value];

      // Luego guardar en Firebase
      const docRef = doc(db, 'declaracionesPublicas', `${declaracion.categoria}-${declaracion.pilar}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        await updateDoc(docRef, {
          declaraciones: [declaracionConPublica, ...data.declaraciones]
        });
      } else {
        await setDoc(docRef, { declaraciones: [declaracionConPublica] });
      }

      console.log('Declaración agregada:', JSON.stringify(declaracionConPublica, null, 2));
    } catch (error) {
      // Si hay error, revertir el cambio local
      declaraciones.value = declaraciones.value.filter(d => d.id !== declaracion.id);
      console.error("Error al agregar declaración:", error);
      throw error; // Propagar el error para manejarlo en el componente
    }
  }

  return {
    declaraciones,
    cargarDeclaraciones,
    actualizarDeclaracion,
    agregarDeclaracion
  };
});
