export type PERMISSION = "ADMIN" | "STUDENT" | "TEACHER" | null;
export type GENDER = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY" | null;

export type PostUser = {
  name: string;
  gender: GENDER;
  birthDate: string;
  permission: PERMISSION;
};
