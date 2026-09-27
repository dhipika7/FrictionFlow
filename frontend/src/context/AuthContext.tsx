import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, full_name: string, password: string, role: string) => Promise<void>;
  switchDemoRole: (targetRole: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 1,
    email: 'alex.student@frictionflow.edu',
    full_name: 'Alex Chen',
    role: 'student'
  });
  const [role, setRole] = useState<UserRole>('student');

  const login = async (email: string, password: string) => {
    try {
      const data = await api.login(email, password);
      localStorage.setItem('frictionflow_token', data.access_token);
      setUser(data.user);
      setRole(data.user.role);
    } catch (e) {
      // Fallback for demo
      const demoRole: UserRole = email.includes('teacher') ? 'teacher' : 'student';
      setUser({
        id: demoRole === 'teacher' ? 99 : 1,
        email,
        full_name: demoRole === 'teacher' ? 'Prof. Sarah Jenkins' : 'Alex Chen',
        role: demoRole
      });
      setRole(demoRole);
    }
  };

  const signup = async (email: string, full_name: string, password: string, roleInput: string) => {
    try {
      const data = await api.signup(email, full_name, password, roleInput);
      localStorage.setItem('frictionflow_token', data.access_token);
      setUser(data.user);
      setRole(data.user.role);
    } catch (e) {
      const assignedRole = (roleInput as UserRole) || 'student';
      setUser({ id: 2, email, full_name, role: assignedRole });
      setRole(assignedRole);
    }
  };

  const switchDemoRole = (targetRole: UserRole) => {
    if (targetRole === 'teacher') {
      setUser({
        id: 99,
        email: 'sarah.teacher@frictionflow.edu',
        full_name: 'Prof. Sarah Jenkins',
        role: 'teacher'
      });
      setRole('teacher');
    } else {
      setUser({
        id: 1,
        email: 'alex.student@frictionflow.edu',
        full_name: 'Alex Chen',
        role: 'student'
      });
      setRole('student');
    }
  };

  const logout = () => {
    localStorage.removeItem('frictionflow_token');
    setUser(null);
    setRole('student');
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated: !!user, login, signup, switchDemoRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
