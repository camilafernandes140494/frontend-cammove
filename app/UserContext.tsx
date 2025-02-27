import { PERMISSION } from '@/api/users/users.types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserType = {
  id: string | null;
  name: string | null;
  permission: PERMISSION | null;
  gender: string | null;
  image: string | null
  token: string | null
};
type UserContextType = {
  user: UserType | null;
  setUser: (user: Partial<UserType>) => void;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>({
    id: null,
    name: null,
    gender: null,
    permission: null,
    image: null,
    token: null
  });

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = await AsyncStorage.getItem("@user_token");
      if (storedToken) {
        setUser((prevUser) => ({
          ...(prevUser || { id: null, name: null, permission: null, gender: null, image: null, token: null }),
          token: storedToken,
        }));
      }
    };

    loadUser();
  }, []);

  const login = async (token: string) => {
    await AsyncStorage.setItem("@user_token", token);
    setUser((prevUser) => ({
      ...(prevUser || { id: null, name: null, permission: null, gender: null, image: null, token: null }),
      token,
    }));
  };

  const logout = async () => {
    await AsyncStorage.removeItem("@user_token");
    setUser(null);
  };

  const updateUser = (newUser: Partial<UserType>) => {
    setUser((prevUser) => ({
      ...(prevUser || { id: null, name: null, permission: null, gender: null, image: null, token: null }),
      ...newUser,
    }));
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
