export type Student = {
  studentId: string;
  studentName: string;
  studentStatus: 'ACTIVE' | 'INACTIVE';
};

export type GetStudentsResponse = {
  students: Student[];
};

export type Relationship = {
  createdAt: string;
  status: 'ACTIVE' | 'INACTIVE';
  studentId: string;
  teacherId: string;
  id: string;
};
