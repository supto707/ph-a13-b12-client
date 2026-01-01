import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, photoUrl: string, role: UserRole) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  updateUserCoins: (newCoins: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@microtask.com',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    role: 'admin',
    coins: 1000,
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'John Worker',
    email: 'worker@test.com',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    role: 'worker',
    coins: 250,
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Sarah Buyer',
    email: 'buyer@test.com',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    role: 'buyer',
    coins: 500,
    createdAt: new Date(),
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('microtask_user');
    const token = localStorage.getItem('microtask_token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password123') {
      const token = `token_${Date.now()}`;
      localStorage.setItem('microtask_token', token);
      localStorage.setItem('microtask_user', JSON.stringify(foundUser));
      setUser(foundUser);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    photoUrl: string,
    role: UserRole
  ): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    const newUser: User = {
      id: `${Date.now()}`,
      name,
      email,
      photoUrl: photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      role,
      coins: role === 'worker' ? 10 : 50, // Workers get 10, Buyers get 50
      createdAt: new Date(),
    };
    
    mockUsers.push(newUser);
    
    const token = `token_${Date.now()}`;
    localStorage.setItem('microtask_token', token);
    localStorage.setItem('microtask_user', JSON.stringify(newUser));
    setUser(newUser);
    setIsLoading(false);
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate Google OAuth
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const googleUser: User = {
      id: `google_${Date.now()}`,
      name: 'Google User',
      email: `user${Date.now()}@gmail.com`,
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google',
      role: 'worker',
      coins: 10,
      createdAt: new Date(),
    };
    
    mockUsers.push(googleUser);
    
    const token = `google_token_${Date.now()}`;
    localStorage.setItem('microtask_token', token);
    localStorage.setItem('microtask_user', JSON.stringify(googleUser));
    setUser(googleUser);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('microtask_token');
    localStorage.removeItem('microtask_user');
    setUser(null);
  };

  const updateUserCoins = (newCoins: number) => {
    if (user) {
      const updatedUser = { ...user, coins: newCoins };
      setUser(updatedUser);
      localStorage.setItem('microtask_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, loginWithGoogle, logout, updateUserCoins }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
