"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
  userId: string;
  setUserId: (userId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string>('temp');

  useEffect(() => {
    // Load userId from localStorage if available
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      setUserId(savedUserId);
    }
  }, []);

  const updateUserId = (newUserId: string) => {
    const finalUserId = newUserId.trim() || 'temp';
    setUserId(finalUserId);
    localStorage.setItem('userId', finalUserId);
  };

  return (
    <UserContext.Provider value={{ userId, setUserId: updateUserId }}>
      {children}
    </UserContext.Provider>
  );
};