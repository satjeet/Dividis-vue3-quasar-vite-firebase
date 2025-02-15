import { ref } from 'vue';
import { Declaracion } from '../stores/declaraciones-store';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useViajeStore } from '../stores/viaje-store';

export function useDeclaracionesReactions(usuarioId: string) {
  const viajeStore = useViajeStore();

  const react = async (declaracion: Declaracion, reaccion: keyof Declaracion['reacciones']) => {
    // Get current user reaction if any
    const currentReaction = declaracion.usuariosReaccionTipo?.[usuarioId];

    // If clicking the same reaction, remove it
    if (currentReaction === reaccion) {
      declaracion.reacciones[reaccion] = (declaracion.reacciones[reaccion] || 0) - 1;
      delete declaracion.usuariosReaccionTipo[usuarioId];
      declaracion.usuariosReaccionaron = declaracion.usuariosReaccionaron.filter(uid => uid !== usuarioId);
    }
    // If switching to a new reaction
    else {
      // If user had a previous reaction, remove it first
      if (currentReaction) {
        declaracion.reacciones[currentReaction] = (declaracion.reacciones[currentReaction] || 0) - 1;
      } else {
        // Add user to reacted list if they haven't reacted before
        declaracion.usuariosReaccionaron.push(usuarioId);
      }

      // Add new reaction
      declaracion.reacciones[reaccion] = (declaracion.reacciones[reaccion] || 0) + 1;
      if (!declaracion.usuariosReaccionTipo) {
        declaracion.usuariosReaccionTipo = {};
      }
      declaracion.usuariosReaccionTipo[usuarioId] = reaccion;
    }

    await updateDeclaracionInFirebase(declaracion);
  };

  const compartirDeclaracion = async (declaracion: Declaracion) => {
    const [categoria, pilar, id] = declaracion.id.split('-');
    const docRef = doc(db, 'declaracionesPublicas', `${categoria}-${pilar}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const declaraciones = docSnap.data().declaraciones.map((decl: Declaracion) => {
        if (decl.id === id) {
          if (!decl.usuariosCompartieron.includes(usuarioId)) {
            decl.compartidos += 1;
            declaracion.usuariosCompartieron.push(usuarioId);
            viajeStore.addSentence(decl.categoria, decl.pilar, decl.texto);
            viajeStore.guardarCambiosFirebase();
          }
        }
        return decl;
      });
      await updateDoc(docRef, { declaraciones });
    }
  };

  const updateDeclaracionInFirebase = async (declaracion: Declaracion) => {
    const docRef = doc(db, 'declaracionesPublicas', `${declaracion.categoria}-${declaracion.pilar}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const declaraciones = docSnap.data().declaraciones.map((decl: Declaracion) =>
        decl.id === declaracion.id ? declaracion : decl
      );
      await updateDoc(docRef, { declaraciones });
    }
  };

  return {
    react,
    compartirDeclaracion
  };
}
