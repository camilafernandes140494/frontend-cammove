export type Exercise = {
  name: string;
  description: string;
  category?: string;
  muscleGroup?: string[];
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  id?: string;
};

export type Upload = {
  file: Blob;
  folder: 'exercises' | 'fallow-up';
};
