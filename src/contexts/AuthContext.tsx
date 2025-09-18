import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: User['role']) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string, role: User['role']) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: User['role']) => {
    setLoading(true);
    // Simulate API call - replace with actual authentication
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      role,
      verified: true,
      createdAt: new Date(),
      profile: {
        bio: `${role} at Global Learning Platform`,
        specialization: role === 'doctor' ? 'General Medicine' : role === 'teacher' ? 'Computer Science' : undefined,
        rating: 4.8,
        totalStudents: role === 'teacher' || role === 'doctor' ? Math.floor(Math.random() * 1000) : undefined,
        totalCourses: role === 'teacher' ? Math.floor(Math.random() * 50) : undefined,
      }
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setLoading(false);
  };

  const register = async (email: string, password: string, name: string, role: User['role']) => {
    setLoading(true);
    // Simulate API call - replace with actual registration
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role,
      verified: false,
      createdAt: new Date(),
      profile: {
        bio: `New ${role} at Global Learning Platform`,
      }
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};