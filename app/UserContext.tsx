import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserType = {
    id: string | null;
    name: string | null;
    email: string | null;
}
type UserContextType = {
    user: UserType;
    setUser: (user: UserType) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType>({
        id: null,
        name: null,
        email: null
    });

    return (
        <UserContext.Provider value={{ user, setUser }}>
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
