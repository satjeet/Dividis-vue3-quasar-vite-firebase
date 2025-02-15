export const PILAR_EXPLANATIONS = {
  Vision: 'Tu Visión se refiere al estado ideal que te gustaría alcanzar en esta categoría importante. Pregúntate: ¿Cómo quieres que se sienta este área de tu vida? ¿Cómo te gustaría que luciera? ¿Qué te gustaría estar haciendo de manera consistente? Describe claramente tu Visión ideal.',
  Proposito: 'Tu Propósito se refiere a las razones convincentes detrás de lo que quieres en esta categoría. ¿Qué te energiza? ¿Qué te empodera para actuar? ¿Qué te motiva a alcanzar tu Visión? Describe POR QUÉ quieres sacar el máximo provecho de esta área de tu vida.',
  Creencias: 'Tu creencias se refiere a las creencias fundamentales que tienes sobre esta categoría. ¿En qué crees? ¿Qué creencias profundas están moldeando tu vida? ¿Tus creencias son empoderadoras? ¿Te mueven a un nivel profundo o te están frenando? ¿Cuál es tu Premisa para esta área de tu vida, o cómo te gustaría que fuera?',
  Estrategias: 'Tu Estrategia se refiere a las acciones específicas que te llevarán de donde estás ahora a donde quieres estar. ¿Cómo harás realidad tu visión? Pregúntate qué tipo de hábitos positivos, actitudes y pasos de acción puedes implementar. ¿Cuál es la RECETA para la Visión que quieres crear?',
} as const;

export type PilarType = keyof typeof PILAR_EXPLANATIONS;
