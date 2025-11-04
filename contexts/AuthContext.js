'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authService } from '../services/auth.service';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = Cookies.get('token');
      const userData = Cookies.get('user');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
        
        // Verify token is still valid
        try {
          await authService.getMe();
        } catch (error) {
          logout();
          return;
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });

      if (response.success) {
        const { user, token } = response.data;
        
        Cookies.set('token', token, { expires: 7 });
        Cookies.set('user', JSON.stringify(user), { expires: 7 });
        
        setUser(user);
        
        if (user.role === 'Admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/developer/tasks');
        }
        
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);

      if (response.success) {
        return { success: true, message: 'Registration successful! Please login.' };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setUser(null);
    router.push('/login');
  };

  const updateUser = (userData) => {
    setUser(userData);
    Cookies.set('user', JSON.stringify(userData), { expires: 7 });
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'Admin',
    isDeveloper: user?.role === 'Developer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    return {
      user: null,
      login: async () => ({ success: false, message: 'Auth not initialized' }),
      register: async () => ({ success: false, message: 'Auth not initialized' }),
      logout: () => {},
      updateUser: () => {},
      loading: false,
      isAuthenticated: false,
      isAdmin: false,
      isDeveloper: false,
    };
  }
  
  return context;
}