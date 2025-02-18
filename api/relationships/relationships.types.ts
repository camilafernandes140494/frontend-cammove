export type Student = {
  studentId: string;
  studentName: string;
};

export type GetStudentsResponse = {
  students: Student[];
};
