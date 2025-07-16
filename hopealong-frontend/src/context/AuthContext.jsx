import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const refreshUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 5000
      });
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
      localStorage.removeItem('token'); // Remove invalid token
      setError(err.response?.data?.message || 'Session expired. Please login again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { email, password },
        { timeout: 5000 }
      );
      
      // Store token in localStorage for cross-origin compatibility
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      return { success: false, error: err.response?.data?.message || 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        userData,
        { withCredentials: true, timeout: 5000 }
      );
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear token from localStorage
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    } catch (err) {
      setError('Logout failed. Please try again.');
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};