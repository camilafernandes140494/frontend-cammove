import { PERMISSION } from '@/api/users/users.types';
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserType = {
    id: string | null;
    name: string | null;
    permission: PERMISSION | null;
    gender: string | null;
}
type UserContextType = {
    user: UserType;
    setUser: (user: Partial<UserType>) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType>({
        id: null,
        name: null,
        gender: null,
        permission: null
    });

    const updateUser = (newUser: Partial<UserType>) => {
        setUser(prevUser => ({
            ...prevUser,
            ...newUser,
        }));
    };


    return (
        <UserContext.Provider value={{ user, setUser: updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
