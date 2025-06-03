import { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/user');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      // If the token is invalid - removes
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await api.post('/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to login';
      setError(errorMessage);
      return false;
    }
  };

  const signup = async (name, lastname, email, password) => {
    setError(null);
    try {
      const response = await api.post('/register', { 
        name, 
        lastname, 
        email, 
        password 
      });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create account';
      setError(errorMessage);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 