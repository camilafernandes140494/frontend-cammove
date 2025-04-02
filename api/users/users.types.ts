export type PERMISSION = 'ADMIN' | 'STUDENT' | 'TEACHER' | null;
export type GENDER = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY' | null;

export type PostUser = {
  name: string;
  gender: GENDER;
  birthDate: string;
  permission: PERMISSION;
};

export type Users = {
  id?: string;
  name: string;
  gender: string;
  birthDate: string;
  email: string;
  permission: PERMISSION;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};
