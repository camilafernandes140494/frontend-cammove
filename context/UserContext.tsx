import { PERMISSION } from '@/api/users/users.types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserType = {
  id: string | null;
  name: string | null;
  permission: PERMISSION | null;
  gender: string | null;
  image: string | null;
  email: string | null;
  token: string | null;
  birthDate: string | null;
  status: string | null;
  phone: string | null;
  onboarding_completed: boolean
};

type UserContextType = {
  user: Partial<UserType> | null;
  setUser: (user: Partial<UserType>) => void;
  login: (userData: Partial<UserType>) => Promise<void>;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);


export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Partial<UserType> | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("@user_data");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    loadUser();
  }, []);

  const login = async (userData: Partial<UserType>) => {
    await AsyncStorage.setItem("@user_data", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("@user_data");
    setUser(null);
  };

  const updateUser = async (newUser: Partial<UserType>) => {
    setUser((prevUser) => {
      const updatedUser: UserType = {
        id: prevUser?.id ?? null,
        name: prevUser?.name ?? null,
        permission: prevUser?.permission ?? null,
        gender: prevUser?.gender ?? null,
        image: prevUser?.image ?? null,
        email: prevUser?.email ?? null,
        token: prevUser?.token ?? null,
        birthDate: prevUser?.birthDate ?? null,
        status: prevUser?.status ?? null,
        phone: prevUser?.phone ?? null,
        onboarding_completed: false,
        ...newUser,
      };

      AsyncStorage.setItem("@user_data", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };


  return (
    <UserContext.Provider value={{ user, setUser: updateUser, login, logout }}>
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
