import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserById } from '@/api/users/users.api';
import { Users } from '@/api/users/users.types';

type StudentContextType = {
  student: Users | undefined;
  isLoading: boolean;
  refetchStudent: (id: string) => void;
};

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider = ({ children, studentCode: initialStudentCode }: { children: ReactNode; studentCode: string, }) => {
  const [studentCode, setStudentCode] = useState(initialStudentCode);

  const { data: student, isLoading: isLoadingStudent, isFetching: isFetchingStudent } = useQuery({
    queryKey: ['student', studentCode],
    queryFn: () => getUserById(studentCode),
    enabled: !!studentCode,
  });

  const refetchStudent = (newStudentCode: string) => {
    setStudentCode(newStudentCode);
  };

  let isLoading = isLoadingStudent || isFetchingStudent

  return (
    <StudentContext.Provider value={{ student, refetchStudent, isLoading }}>
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
