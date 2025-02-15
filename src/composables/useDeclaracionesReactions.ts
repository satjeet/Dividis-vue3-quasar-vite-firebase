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
    // No permitir compartir si el usuario es el dueño
    if (declaracion.creadorId === usuarioId) {
      console.log('No puedes compartir tu propia declaración');
      return;
    }

    // No permitir compartir si ya la compartió antes
    if (declaracion.usuariosCompartieron?.includes(usuarioId)) {
      console.log('Ya has compartido esta declaración');
      return;
    }

    try {
      // First update the local object
      declaracion.compartidos = (declaracion.compartidos || 0) + 1;
      if (!declaracion.usuariosCompartieron) {
        declaracion.usuariosCompartieron = [];
      }
      declaracion.usuariosCompartieron.push(usuarioId);

      // Update in Firebase
      await updateDeclaracionInFirebase(declaracion);

      // Add to user's personal journey
      await viajeStore.addSentence(
        declaracion.categoria,
        declaracion.pilar,
        declaracion.texto
      );
      await viajeStore.guardarCambiosFirebase();

    } catch (error) {
      console.error('Error al compartir declaración:', error);
      // Rollback changes if something failed
      declaracion.compartidos--;
      declaracion.usuariosCompartieron = declaracion.usuariosCompartieron.filter(id => id !== usuarioId);
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
