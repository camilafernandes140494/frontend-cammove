import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyTeacher } from '@/api/relationships/relationships.api';
import { useUser } from './UserContext';
import { Relationship } from '@/api/relationships/relationships.types';

type MyTeacherContextType = {
  teacher: Relationship | undefined;
};

const MyTeacherContext = createContext<MyTeacherContextType | undefined>(undefined);

export const MyTeacherProvider = ({ children }: { children: ReactNode; }) => {
  const { user } = useUser();

  const { data: teacher } = useQuery({
    queryKey: ['getMyTeacher', user?.id],
    queryFn: () => getMyTeacher(user?.id || ''),
    enabled: !!user?.id,
  });

  return (
    <MyTeacherContext.Provider value={{ teacher }}>
      {children}
    </MyTeacherContext.Provider>
  );
};

export const useMyTeacher = () => {
  const context = useContext(MyTeacherContext);
  if (!context) {
    throw new Error('useMyTeacher must be used within a MyTeacherProvider');
  }
  return context;
};
