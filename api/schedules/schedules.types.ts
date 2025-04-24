export type ScheduledStudents = {
  studentName: string;
  studentId: string;
};

export type SchedulesData = {
  time: string[];
  date: string[];
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  students: ScheduledStudents[];
  available: boolean;
  studentLimit: number;
  id: string;
};

export type SchedulesDateData = {
  dates: string[];
};

export type SchedulesStudentDateData = {
  date: string;          
  description: string;  
  name: string;         
  time: string[];  
};
