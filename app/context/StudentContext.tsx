import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserById } from '@/api/users/users.api';
import { Users } from '@/api/users/users.types';

type StudentContextType = {
  student: Users | undefined;
  refetchStudent: (id: string) => void;
};

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider = ({ children, studentCode: initialStudentCode }: { children: ReactNode; studentCode: string }) => {
  const [studentCode, setStudentCode] = useState(initialStudentCode);

  const { data: student } = useQuery({
    queryKey: ['student', studentCode],
    queryFn: () => getUserById(studentCode),
    enabled: !!studentCode,
  });

  const refetchStudent = (newStudentCode: string) => {
    setStudentCode(newStudentCode);
  };

  return (
    <StudentContext.Provider value={{ student, refetchStudent }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};
