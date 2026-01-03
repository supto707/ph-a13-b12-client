import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { authAPI } from '@/lib/api';
import { UserRole, User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, photoUrl: string, role: UserRole) => Promise<boolean>;
  loginWithGoogle: () => Promise<{ success: boolean; isNewUser: boolean }>;
  logout: () => void;
  updateUserCoins: (newCoins: number) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('microtask_token');
      const storedUser = localStorage.getItem('microtask_user');

      if (token && storedUser) {
        try {
          // Verify token with backend
          const response = await authAPI.verify();
          const userData = response.data.user;
          setUser({
            _id: userData._id,
            name: userData.name,
            email: userData.email,
            photoUrl: userData.photoUrl,
            role: userData.role,
            coins: userData.coins,
            createdAt: new Date(userData.createdAt),
          });
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem('microtask_token');
          localStorage.removeItem('microtask_user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    const demoAccounts: Record<string, string> = {
      'worker@test.com': 'password123',
      'buyer@test.com': 'password123',
      'admin@microtask.com': 'password123',
    };

    try {
      let firebaseUid: string;

      // Bypass Firebase for demo accounts
      if (demoAccounts[email] && password === demoAccounts[email]) {
        console.log('Demo account detected, bypassing Firebase...');
        firebaseUid = `demo-${email.split('@')[0]}-uid`;
      } else {
        // Sign in with Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        firebaseUid = userCredential.user.uid;
      }

      // Login with backend
      const response = await authAPI.login({
        email,
        firebaseUid,
      });

      const { token, user: userData } = response.data;

      localStorage.setItem('microtask_token', token);
      localStorage.setItem('microtask_user', JSON.stringify(userData));

      setUser({
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        photoUrl: userData.photoUrl,
        role: userData.role,
        coins: userData.coins,
        createdAt: new Date(userData.createdAt),
      });

      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    photoUrl: string,
    role: UserRole
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Register with backend
      const response = await authAPI.register({
        name,
        email,
        photoUrl: photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        role,
        firebaseUid: firebaseUser.uid,
      });

      const { token, user: userData } = response.data;

      localStorage.setItem('microtask_token', token);
      localStorage.setItem('microtask_user', JSON.stringify(userData));

      setUser({
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        photoUrl: userData.photoUrl,
        role: userData.role,
        coins: userData.coins,
        createdAt: new Date(userData.createdAt),
      });

      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; isNewUser: boolean }> => {
    setIsLoading(true);

    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Login/Register with backend
      const response = await authAPI.googleLogin({
        name: firebaseUser.displayName || 'Google User',
        email: firebaseUser.email!,
        photoUrl: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=google`,
        firebaseUid: firebaseUser.uid,
      });

      const { token, user: userData, isNewUser } = response.data;

      localStorage.setItem('microtask_token', token);
      localStorage.setItem('microtask_user', JSON.stringify(userData));

      setUser({
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        photoUrl: userData.photoUrl,
        role: userData.role,
        coins: userData.coins,
        createdAt: new Date(userData.createdAt),
      });

      setIsLoading(false);
      return { success: true, isNewUser: isNewUser || false };
    } catch (error: any) {
      console.error('Google login error:', error);
      setIsLoading(false);
      return { success: false, isNewUser: false };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Firebase signout error:', error);
    }
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

  const refreshUser = async () => {
    try {
      const response = await authAPI.verify();
      const userData = response.data.user;
      const updatedUser = {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        photoUrl: userData.photoUrl,
        role: userData.role,
        coins: userData.coins,
        createdAt: new Date(userData.createdAt),
      };
      setUser(updatedUser);
      localStorage.setItem('microtask_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      loginWithGoogle,
      logout,
      updateUserCoins,
      refreshUser
    }}>
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
