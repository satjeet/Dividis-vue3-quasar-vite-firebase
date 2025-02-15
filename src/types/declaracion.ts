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
  usuariosReaccionTipo: {
    [userId: string]: 'meEncanta' | 'estaOk' | 'mejorCambiala';
  };
  esPublica: boolean;
}

export type TipoReaccion = 'meEncanta' | 'estaOk' | 'mejorCambiala';

export interface DeclaracionFormState {
  declaracion: string;
  categoria: string;
  pilar: string;
  isExpanded: boolean;
}
