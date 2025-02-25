export type PilarType = 'Vision' | 'Proposito' | 'Creencias' | 'Estrategias';

export type MessageCategory = {
  [K in PilarType]: string[];
}

export type RecognitionMessages = {
  [key: string]: MessageCategory;
}
