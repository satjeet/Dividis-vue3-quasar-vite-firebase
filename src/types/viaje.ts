export interface Pilar {
  name: string;
  sentences: string[];
}

export interface Category {
  name: string;
  pilars: Pilar[];
}

export interface FirebaseCategoriesData {
  categories: Category[];
}
