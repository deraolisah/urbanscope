import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const API_URL = import.meta.env.VITE_API_URL;

  
  // Set default authorization header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, 
      { email, password }
      // Remove withCredentials: true
    );
    
    if (response.data.token) {
      setToken(response.data.token);
    }
    
    setUser(response.data.user);
    return response.data;
  };

  const register = async (username, email, password) => {
    const response = await axios.post(`${API_URL}/auth/register`, 
      { username, email, password }
      // Remove withCredentials: true
    );
    
    if (response.data.token) {
      setToken(response.data.token);
    }
    
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    }
  };

  // Check auth status
  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        // Set the token for this request
        const response = await axios.get(`${API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        });
        setUser(response.data);
        setToken(storedToken);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();    
  }, [API_URL]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token,
      login, 
      register, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;